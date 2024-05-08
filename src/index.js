// src/index.js
const parseQuery = require('./queryParser');
const readCSV = require('./csvReader')

async function executeSELECTQuery(query) {
    try {
        const { fields, table, whereClauses, joinTable, joinCondition } = parseQuery(query);
        let data = await readCSV(`${table}.csv`);

        if (joinTable && joinCondition) {
            const joinData = await readCSV(`${joinTable}.csv`);
            data = data.flatMap(mainRow => {
                return joinData
                    .filter(joinRow => {
                        const mainValue = mainRow[joinCondition.left.split('.')[1]];
                        const joinValue = joinRow[joinCondition.right.split('.')[1]];
                        return mainValue === joinValue;
                    })
                    .map(joinRow => {
                        return fields.reduce((acc, field) => {
                            const [tableName, fieldName] = field.split('.');
                            acc[field] = tableName === table ? mainRow[fieldName] : joinRow[fieldName];
                            return acc;
                        }, {});
                    });
            });
        }


        function evaluateCondition(row, clause) {
            const { field, operator, value } = clause;
            switch (operator) {
                case '=': return row[field] === value;
                case '!=': return row[field] !== value;
                case '>': return row[field] > value;
                case '<': return row[field] < value;
                case '>=': return row[field] >= value;
                case '<=': return row[field] <= value;
                case '<>': return row[field] !== value; // Handle <>
                default: throw new Error(`Unsupported operator: ${operator}`);
            }
        }

        // Apply WHERE clause filtering
        const filteredData = whereClauses.length > 0
            ? data.filter(row => whereClauses.every(clause => evaluateCondition(row, clause)))
            : data;

        // Select the specified fields
        const selectedRows = filteredData.map(row => {
            const selectedRow = {};
            fields.forEach(field => {
                selectedRow[field] = row[field];
            });
            return selectedRow;
        });

        // Return the selected rows
        return selectedRows;
    } catch (error) {
        throw new Error(`Failed to execute query: ${error.message}`);
    }
}


module.exports = executeSELECTQuery;