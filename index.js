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
function addAction(table) {
    let query;
    let param;
    switch (table) {
      case "Department":
        inquirer
          .prompt([
            {
              type: "input",
              name: "deptName",
              message: "What is the name of the department?",
              validate(deptName) {
                if (!deptName) {
                  return "Please enter a department name";
                }
                return true;
              },
            },
          ])
          .then((val) => {
            query = "INSERT INTO department (name) VALUES (?)";
            param = [val.deptName];
          
            runQuery(query, param).then(() => mainSelect());
          });
        break;
  
      case "Role":
       
        query = "SELECT name from department";
        getQuery(query).then((choices) => {
          inquirer
            .prompt([
              {
                type: "input",
                name: "roleName",
                message: "What is the name of the role?",
                validate(roleName) {
                  if (!roleName) {
                    return "Please enter a role name";
                  }
                  return true;
                },
              },
              {
                type: "input",
                name: "roleSalary",
                message: "What is the salary of the role?",
                validate(roleSalary) {
                  if (!roleSalary) {
                    return "Please enter a salary";
                  }
                  if (!/[0-9]/gi.test(roleSalary)) {
                    return "Please enter a non-zero number";
                  }
                  return true;
                },
              },
              {
                type: "list",
                name: "roleDept",
                message: "Which department does this role belong to?",
                choices: [...choices],
              },
            ])
            .then((val) => {
            
              query = `SELECT id as name FROM department WHERE name = '${val.roleDept}'`;
              getQuery(query).then((choices) => {
               
                query =
                  "INSERT INTO role (title,salary,department_id) VALUES (?,?,?)";
                param = [val.roleName, parseInt(val.roleSalary), ...choices];
                runQuery(query, param).then(() => mainSelect());
              });
            });
        });
        break;
  
      case "Employee":
        let title;
        let manager;
        
        query = "SELECT title as name from role";
        getQuery(query).then((choices) => {
          title = [...choices];
        });
       
        query = "SELECT concat(first_name,' ',last_name) as name from employee";
        getQuery(query)
          .then((choices) => {
            
            manager = ["None", ...choices];
          })
          .then(() => {
            inquirer
              .prompt([
                {
                  type: "input",
                  name: "firstName",
                  message: "What is the first name of the employee?",
                  validate(firstName) {
                    if (!firstName) {
                      return "Please enter the first name";
                    }
                    return true;
                  },
                },
                {
                  type: "input",
                  name: "lastName",
                  message: "What is the last name of the employee?",
                  validate(lastName) {
                    if (!lastName) {
                      return "Please enter the last name";
                    }
                    return true;
                  },
                },
                {
                  type: "list",
                  name: "role",
                  message: "What is the role of the employee?",
                  choices: [...title],
                },
                {
                  type: "list",
                  name: "manager",
                  message: "Who is the manager of the employee?",
                  choices: [...manager],
                },
              ])
              .then((val) => {
                let roleId;
                let managerId;
                let fields = "(first_name, last_name, role_id";
                let values = "(?,?,?";
  
                
                if (manager !== "None") {
                
                  query = `SELECT id as name FROM employee WHERE CONCAT(first_name,' ',last_name) = '${val.manager}'`;
                  getQuery(query).then((choices) => {
                    [managerId] = choices;
                    fields += ", manager_id)";
                    values += ",?)";
                  });
                } else {
                  fields += ")";
                  values += ")";
                }
  
                
                query = `SELECT id as name FROM role WHERE title = '${val.role}'`;
                getQuery(query).then((choices) => {
                  [roleId] = choices;
                 
                  query = `INSERT INTO employee ${fields} VALUES ${values}`;
                  param =
                    manager !== "None"
                      ? [val.firstName, val.lastName, roleId, managerId]
                      : [val.firstName, val.lastName, roleId];
                  runQuery(query, param).then(() => mainSelect());
                });
              });
          });
        break;
    }
  }
  function updateAction(table) {
    let prompt = [];
    let message;
  
    if (table === "Role") {
    
      query = "SELECT title as name from role";
      getQuery(query).then((choices) => {
        prompt = [...choices];
        message = "Which role do you want to assign the selected employee?";
      });
    }
  
    query = "SELECT concat(first_name,' ',last_name) as name from employee";
    getQuery(query).then((choices) => {
      
      if (table !== "Role") {
        prompt = [...choices];
        message = "Which manager do you want to assign the selected employee?";
      }
   
      inquirer
        .prompt([
          {
            type: "list",
            name: "name",
            message: "Which employee do you want to update?",
            choices: [...choices],
          },
          {
            type: "list",
            name: "update",
            message: message,
            choices: [...prompt],
          },
        ])
        .then((val) => {
  
          if (table === "Role") {
            query = `SELECT id as name FROM role WHERE title = '${val.update}'`;
          } else {
            query = `SELECT id as name FROM employee WHERE CONCAT(first_name,' ',last_name) = '${val.update}'`;
          }
          getQuery(query).then((choices) => {
            [roleId] = choices;
           
            if (table === "Role") {
              query = `UPDATE employee SET role_id = ? WHERE CONCAT(first_name,' ',last_name) = '${val.name}'`;
            } else {
              query = `UPDATE employee SET manager_id = ? WHERE CONCAT(first_name,' ',last_name) = '${val.name}'`;
            }
            param = [roleId];
        
            runQuery(query, param).then(() => {
              console.log(`${val.name} updated.`);
              mainSelect();
            });
          });
        });
    });
  }