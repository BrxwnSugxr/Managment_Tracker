const inquirer = require('inquirer');

function mainSelect() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View All Departments',
          'View All Roles',
          'View All Employees',
          'View by Manager',
          'View by Department',
          'View Total Utilized Budget of a Department',
          'Add Department',
          'Add Role',
          'Add Employee',
          'Delete Department',
          'Delete Role',
          'Delete Employee',
          'Update Employee Role',
          'Update Employee Manager',
          'Quit',
        ],
      },
    ])
    .then((val) => {
      const action = val.action.split(' ');

      switch (action[0]) {
        case 'View':
          viewAction(action[2]);
          break;
        case 'Add':
          addAction(action[1]);
          break;
        case 'Update':
          updateAction(action[2]);
          break;
        case 'Delete':
          deleteAction(action[1]);
          break;
        default:
          quit();
      }
    });
}

function quit() {
  console.log('\nGoodbye!');
  process.exit(0);
}

function viewAction(table) {
  let query;

  switch (table) {
    case 'Departments':
      query = 'SELECT * from department';

      runQuery(query).then(() => mainSelect());
      break;

    case 'Roles':
      query =
        'SELECT role.id, role.title, department.name, role.salary from role join department on department.id = role.department_id order by role.id';

      runQuery(query).then(() => mainSelect());
      break;

    case 'Employees':
      query =
        "SELECT a.id, a.first_name, a.last_name, role.title, role.name as department, role.salary, concat(b.first_name,' ',b.last_name) as manager from employee a left join employee b on a.manager_id = b.id join (select role.id, role.title, role.salary, department.name from role join department on department.id = role.department_id) role on role.id = a.role_id";

      runQuery(query).then(() => mainSelect());
      break;

    case 'Utilized':
      query = 'SELECT name from department';
      getQuery(query).then((choices) => {
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'department',
              message: 'Which department do you like to check?',
              choices: [...choices],
            },
          ])
          .then((val) => {
            query =
              'SELECT name AS department, role.salary AS salary FROM department LEFT JOIN (SELECT department_id, sum(salary) AS salary FROM role LEFT JOIN employee ON role_id = role.id GROUP BY department_id) role ON department.id = role.department_id WHERE name = ?';
            param = [val.department];

            runQuery(query, param).then(() => mainSelect());
          });
      });
      break;

    case 'Department':
      query = 'SELECT name from department';
      getQuery(query).then((choices) => {
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'department',
              message: 'Which department do you like to check?',
              choices: [...choices],
            },
          ])
          .then((val) => {
            query =
              'SELECT a.id, a.first_name, a.last_name, role.title, role.name as department from employee a left join employee b on a.manager_id = b.id join (select role.id, role.title, department.name from role join department on department.id = role.department_id WHERE department.name = ?) role on role.id = a.role_id';
            param = [val.department];

            runQuery(query, param).then(() => mainSelect());
          });
      });
      break;

    case 'Manager':
      query = "SELECT CONCAT(first_name,' ',last_name) as name from employee";
      getQuery(query).then((choices) => {
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'manager',
              message: 'Which manager do you like to check?',
              choices: [...choices],
            },
          ])
          .then((val) => {
            query =
              "SELECT a.id, a.first_name, a.last_name, role.title, role.name as department, concat(b.first_name,' ',b.last_name) as manager from employee a left join employee b on a.manager_id = b.id join (select role.id, role.title, department.name from role join department on department.id = role.department_id) role on role.id = a.role_id WHERE CONCAT(b.first_name,' ',b.last_name) = ?";
            param = [val.manager];

            runQuery(query, param).then(() => mainSelect());
          });
      });
      break;
  }
}
