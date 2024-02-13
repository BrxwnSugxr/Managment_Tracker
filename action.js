// const inquirer = require('inquirer');
// const [runQuery, getQuery] = require('./helper/sqlUtils');

// function mainSelect() {
//   inquirer
//     .prompt([
//       {
//         type: 'list',
//         name: 'action',
//         message: 'What would you like to do?',
//         choices: [
//           'View All Departments',
//           'View All Roles',
//           'View All Employees',
//           'View by Manager',
//           'View by Department',
//           'View Total Utilized Budget of a Department',
//           'Add Department',
//           'Add Role',
//           'Add Employee',
//           'Delete Department',
//           'Delete Role',
//           'Delete Employee',
//           'Update Employee Role',
//           'Update Employee Manager',
//           'Quit',
//         ],
//       },
//     ])
//     .then((val) => {
//       const action = val.action.split(' ');

//       switch (action[0]) {
//         case 'View':
//           viewAction(action[2]);
//           break;
//         case 'Add':
//           addAction(action[1]);
//           break;
//         case 'Update':
//           updateAction(action[2]);
//           break;
//         case 'Delete':
//           deleteAction(action[1]);
//           break;
//         default:
//           quit();
//       }
//     });
// }

// function quit() {
//   console.log('\nGoodbye!');
//   process.exit(0);
// }

// module.exports = {
//   quit,
//   mainSelect,
// };
