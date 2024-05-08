// src/index.js
const parseWhereClause = require('./queryParser');
const parseQuery = require('./queryParser');
const readCSV = require('./csvReader')

async function executeSELECTQuery(query) {
    try {
        const { fields, table, whereClauses } = parseQuery(query);
        const data = await readCSV(`${table}.csv`);

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
        return filteredData.map(row => {
            const selectedRow = {};
            fields.forEach(field => {
                selectedRow[field] = row[field];
            });
            return selectedRow;
        });
    } catch (error) {
        throw new Error(`Failed to execute query: ${error.message}`);
    }
}


module.exports = executeSELECTQuery;