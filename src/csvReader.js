const fs = require('fs');
const csv = require('csv-parser');

function readCSV(filePath) {
    const results = [];
    // let headers = null;

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            // .on('headers', (headerList) => {
            //     headers = headerList;
            // })
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}


// function readCSV(filePath) {
//     const results = [];

//     return new Promise((resolve, reject) => {
//         fs.createReadStream(filePath)
//             .pipe(csv())
//             .on('data', (data) => results.push(data))
//             .on('end', () => {
//                 resolve(results);
//             })
//             .on('error', (error) => {
//                 reject(error);
//             });
//     });
// }

module.exports = readCSV;

