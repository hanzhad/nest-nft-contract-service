require('dotenv').config({path: '../.env'});

const params = {
    "development": {
        "username": process.env.PG_USER,
        "password": process.env.PG_PASS,
        "database": process.env.PG_BASE,
        "host": process.env.PG_HOST,
        "port": process.env.PG_PORT,
        "dialect": "postgres",
    }
}
module.exports = params;
