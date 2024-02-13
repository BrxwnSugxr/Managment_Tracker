
const mysql = require('mysql2');
const cTable = require('console.table');


let choices = [];


const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'abc123!',
    database: 'company_db',
  },
  console.log(`Connected to the company_db database.`)
);


const runQuery = async (query, param) => {
  const [rows] = await db.promise().query(query, param);

  if (query.includes('SELECT')) {
    if (rows.length > 0) {
      console.table(rows);
    } else {
      console.log('\nThere are no records to show.\n');
    }
  } else {

    if (rows.affectedRows > 0) {
      if (query.includes('DELETE')) {
        console.log(`${param[0]} removed from the database.`);
      } else if (query.includes('INSERT')) {
        console.log(`${param[0]} added the database.`);
      }
    }
  }
};


const getQuery = async (query) => {
  const [rows] = await db.promise().query(query);

  choices = [];
  rows.forEach((val) => {
    choices.push(val.name);
  });
  return choices;
};

module.exports = [runQuery, getQuery];
