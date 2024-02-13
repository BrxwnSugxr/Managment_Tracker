//
const mysql = require('mysql2');
const cTable = require('console.table');

//
let choices = [];

// Connect to database
const db = mysql.createConnection(
  {
    //.env
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,

  },
  console.log(`Connected to the company_db database.`)
);

//
const runQuery = async (query, param) => {
  const [rows] = await db.promise().query(query, param);
  //
  if (query.includes('SELECT')) {
    if (rows.length > 0) {
      console.table(rows);
    } else {
      console.log('\nThere are no records to show.\n');
    }
  } else {
    //
    if (rows.affectedRows > 0) {
      if (query.includes('DELETE')) {
        console.log(`${param[0]} removed from the database.`);
      } else if (query.includes('INSERT')) {
        console.log(`${param[0]} added the database.`);
      }
    }
  }
};

//
const getQuery = async (query) => {
  const [rows] = await db.promise().query(query);
  //
  choices = [];
  rows.forEach((val) => {
    choices.push(val.name);
  });
  return choices;
};

module.exports = [runQuery, getQuery];
