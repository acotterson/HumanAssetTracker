// Include packages needed for this application
const inquirer = require("inquirer");
// Import and require mysql2
const mysql = require("mysql2");

const cTable = require("console.table");
// const db = require("./db");
// const queries = require("./queries");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "grunts_db",
  },
  console.log(`Connected to the grunts_db database.`)
);

// Options lists
const mMenu = [
  "View All Employees",
  "Add Employee",
  "Update Employee",
  "Delete Employee",
  "View All Roles",
  "Add Role",
  "Update Role",
  "Delete Role",
  "View All Departments",
  "Add Department",
  "Delete Department",
  "View Department Salary Budget Use",
  "Quit",
];
const empDispOptions = ["By ID", "By Manager", "By Department"];

// User choice question
const questions = [
  {
    type: "list",
    message: "What would you like to do?",
    name: "mMenuChoice",
    choices: mMenu,
  },
  {
    type: "input",
    name: "depName",
    message: "What is the name of the department?",
  },
  {
    type: "input",
    name: "roleName",
    message: "What is the name of the role?",
  },
  {
    type: "number",
    name: "roleSalary",
    message: "What is the salary of the role?",
  },
  {
    type: "list",
    message: "",
    name: "choice",
    choices: [],
  },
  {
    type: "input",
    name: "empFName",
    message: "What is the employee's first name?",
  },
  {
    type: "input",
    name: "empLName",
    message: "What is the employee's last name?",
  },
  {
    type: "list",
    name: "roleRole",
    message: "What is the employee's role?",
    choices: [],
  },
  {
    type: "list",
    message: "Who is the employees's manager?",
    name: "manChoice",
    choices: [],
  },
  {
    type: "list",
    message: "Which employee's role do you want to update?",
    name: "empChoice",
    choices: [],
  },
  {
    type: "list",
    message: "Which role do you want to assign to the selected employee?",
    name: "empChoice",
    choices: [],
  },
  {
    type: "list",
    message: "How do you want to arrange employees?",
    name: "empDispChoice",
    choices: empDispOptions,
  },
];

// Display employees by id
function employeeDisplay() {
  const sql = `SELECT e.id,
    e.first_name,
    e.last_name,
    r.title,
    d.name AS department,
    r.salary,
    CONCAT(m.first_name, ' ', m.last_name) AS 'manager'
FROM employee e
    LEFT JOIN role r ON e.role_id = r.id
    LEFT JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON m.id = e.manager_id
ORDER BY e.id;`;
  db.promise()
    .query(sql)
    .then(([row, fields]) => {
      console.table(row);
      main();
    })
    .catch((err) => {
      console.log(err);
    });
}

// Add new employee
function employeeAdd() {}

// Update employee
function employeeUpdate() {}

// Delete employee
function employeeDelete() {
    // get list of available employees
    const sql = `SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) as name FROM employee e`;
    db.promise()
      .query(sql)
      .then(([row, fields]) => {
        // modify question based on available employees and to indicate deletion
        questions[4].choices = row.map((x) => x.name);
        questions[4].message = "Which employee do you want to delete?";
        // ask which employee to delete
        inquirer.prompt(questions[4]).then((data) => {
          // use query to delete selected employee using name selected
          const sql = `DELETE FROM employee WHERE id = ?`;
          const params = (row.filter(el => el.name === data.choice))[0].id;
          db.promise()
            .query(sql, params)
            .then(([row, fields]) => {
              if (!row.affectedRows) {
                console.log("Employee not found");
              } else {
                console.log(data.choice + " deleted from the database.");
              }
              main();
            })
            .catch((err) => {
              console.log(err);
            });
        });
      })
      .catch((err) => {
        console.log(err);
      });
}

// Display roles
function roleDisplay() {
  const sql = `SELECT r.id, r.title, d.name AS department, r.salary
  FROM role r
  LEFT JOIN department d ON r.department_id = d.id;`;
  db.promise()
    .query(sql)
    .then(([row, fields]) => {
      console.table(row);
      main();
    })
    .catch((err) => {
      console.log(err);
    });
}

// Add new role
function roleAdd() {
  const params = [];
  // get name of role
  inquirer.prompt(questions[2]).then((nameData) => {
    console.log(nameData.roleName);
    params.push(nameData.roleName);
    // get salary of role
    inquirer.prompt(questions[3]).then((salData) => {
      console.log(salData.roleSalary);
      params.push(salData.roleSalary);
      // query db to get department options
      const sql1 = `SELECT * FROM department`;
      db.promise()
        .query(sql1)
        .then(([row1, fields]) => {
          // modify question based on available departments and to ask the correct question
          questions[4].choices = row1.map((x) => x.name);
          questions[4].message = "Which department does the role belong to?";
          // get department of role
          inquirer.prompt(questions[4]).then((depData) => {
            const sql2 = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;
            // match department name to department id from last query
            params.push((row1.filter(el => el.name === depData.choice))[0].id);
            // add the new role
            db.promise()
              .query(sql2, params)
              .then(([row2, fields]) => {
                if (!row2.affectedRows) {
                  console.log("Role not added.");
                } else {
                  console.log(nameData.roleName + " added to the database.");
                }
                main();
              })
              .catch((err) => {
                console.log(err);
              });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
}

// Update role
function roleUpdate() {}

// Delete role
function roleDelete() {
    // get list of available departments
    const sql = `SELECT d.name AS department FROM department d`;
    db.promise()
      .query(sql)
      .then(([row, fields]) => {
        // modify question based on available departments and to indicate deletion
        questions[4].choices = row.map((x) => x.department);
        questions[4].message = "Which department do you want to delete?";
        // ask which department to delete
        inquirer.prompt(questions[4]).then((data) => {
          // use query to delete selected department using name selected
          const sql = `DELETE FROM department WHERE name = ?`;
          const params = data.choice;
          db.promise()
            .query(sql, params)
            .then(([row, fields]) => {
              if (!row.affectedRows) {
                console.log("Department not found");
              } else {
                console.log(data.choice + " deleted from the database.");
              }
              main();
            })
            .catch((err) => {
              console.log(err);
            });
        });
      })
      .catch((err) => {
        console.log(err);
      });
}

// Display departments
function departmentDisplay() {
  const sql = `SELECT * FROM department;`;
  db.promise()
    .query(sql)
    .then(([row, fields]) => {
      console.table(row);
      main();
    })
    .catch((err) => {
      console.log(err);
    });
}

// Add new department
function departmentAdd() {
  // get the department
  inquirer.prompt(questions[1]).then((data) => {
    // use query to add the department
    const sql = `INSERT INTO department (name) VALUES (?)`;
    const params = data.depName;
    db.promise()
      .query(sql, params)
      .then(([row, fields]) => {
        if (!row.affectedRows) {
          console.log("Department not added.");
        } else {
          console.log(data.depName + " added to the database.");
        }
        main();
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

// Delete department
function departmentDelete() {
  // get list of available departments
  const sql = `SELECT d.name AS department FROM department d`;
  db.promise()
    .query(sql)
    .then(([row, fields]) => {
      // modify question based on available departments and to indicate deletion
      questions[4].choices = row.map((x) => x.department);
      questions[4].message = "Which department do you want to delete?";
      // ask which department to delete
      inquirer.prompt(questions[4]).then((data) => {
        // use query to delete selected department using name selected
        const sql = `DELETE FROM department WHERE name = ?`;
        const params = data.choice;
        db.promise()
          .query(sql, params)
          .then(([row, fields]) => {
            if (!row.affectedRows) {
              console.log("Department not found");
            } else {
              console.log(data.choice + " deleted from the database.");
            }
            main();
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

// Display employees by manager
function employeeManDisplay() {
  const sql = `SELECT e.id,
  CONCAT(m.first_name, ' ', m.last_name) AS 'manager',
  e.first_name,
  e.last_name,
  r.title,
  d.name AS department,
  r.salary
FROM employee e
  LEFT JOIN role r ON e.role_id = r.id
  LEFT JOIN department d ON r.department_id = d.id
  LEFT JOIN employee m ON m.id = e.manager_id
ORDER BY m.id;`;
  db.promise()
    .query(sql)
    .then(([row, fields]) => {
      console.table(row);
      main();
    })
    .catch((err) => {
      console.log(err);
    });
}

// Display employees by department
function employeeDepDisplay() {
  const sql = `
  SELECT e.id,
    d.name AS department,
    CONCAT(m.first_name, ' ', m.last_name) AS 'manager',
    e.first_name,
    e.last_name,
    r.title,
    r.salary
FROM employee e
    LEFT JOIN role r ON e.role_id = r.id
    LEFT JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON m.id = e.manager_id
ORDER BY d.id;`;
  db.promise()
    .query(sql)
    .then(([row, fields]) => {
      console.table(row);
      main();
    })
    .catch((err) => {
      console.log(err);
    });
}

// Display department employee budget use
function budgetDisplay() {
  const sql = `SELECT d.name AS department, SUM(r.salary) AS "Budget Use"
  FROM employee e
      LEFT JOIN \`role\` r ON e.role_id = r.id
      LEFT JOIN department d ON r.department_id = d.id
  GROUP BY d.id;`;
  db.promise()
    .query(sql)
    .then(([row, fields]) => {
      console.table(row);
      main();
    })
    .catch((err) => {
      console.log(err);
    });
}

function empDisplaySelect() {
  inquirer.prompt(questions[11]).then((data) => {
    switch (data.empDispChoice) {
      case "By ID":
        employeeDisplay();
        break;
      case "By Manager":
        employeeManDisplay();
        break;
      case "By Department":
        employeeDepDisplay();
        break;
      default:
        employeeDisplay();
        break;
    }
  });
}

// Accept user requests at main menu
function main() {
  inquirer.prompt(questions[0]).then((data) => {
    switch (data.mMenuChoice) {
      case "View All Employees":
        empDisplaySelect();
        break;
      case "Add Employee":
        employeeAdd();
        break;
      case "Update Employee":
        employeeUpdate();
        break;
      case "Delete Employee":
        employeeDelete();
        break;
      case "View All Roles":
        roleDisplay();
        break;
      case "Add Role":
        roleAdd();
        break;
      case "Update Role":
        roleUpdate();
        break;
      case "Delete Role":
        roleDelete();
        break;
      case "View All Departments":
        departmentDisplay();
        break;
      case "Add Department":
        departmentAdd();
        break;
      case "Delete Department":
        departmentDelete();
        break;
      case "View Department Salary Budget Use":
        budgetDisplay();
        break;
      default:
        db.end();
        console.log("Goodbye!");
        break;
    }
  });
}

// Function call to initialize app
main();
