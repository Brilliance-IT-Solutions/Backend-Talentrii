require('dotenv').config();
// module.exports = Object.freeze({
//     connection: {
//         host: process.env.DB_HOSTNAME,
//         user: process.env.DB_USERNAME,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_NAME,
//         port: 3306,
//         multipleStatements: true
//     },
// });


const connection =  {
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306,
    multipleStatements: true
}

module.exports = connection;