const parseQuery = require('./queryParser');
const readCSV = require('./csvReader');

async function executeSELECTQuery(query) {
    const { fields, table, whereClause } = parseQuery(query);
    const data = await readCSV(`${table}.csv`);

    if (whereClause) {
        const [fieldName, value] = whereClause.split('=').map(item => item.trim());
        return data.filter(row => row[fieldName] === value)
                   .map(row => {
                       const filteredRow = {};
                       fields.forEach(field => {
                           filteredRow[field] = row[field];
                       });
                       return filteredRow;
                   });
    }
    
    // Filter the fields based on the query
    else {
        return data.map(row => {
            const filteredRow = {};
            fields.forEach(field => {
                filteredRow[field] = row[field];
            });
            return filteredRow;
        });
    }
    
}

module.exports = executeSELECTQuery; 