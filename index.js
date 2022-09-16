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
  "Update Role Salary",
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
function employeeAdd() {
  const params = [];
  // get first name of employee
  inquirer.prompt(questions[5]).then((fNameData) => {
    params.push(fNameData.empFName);
    // get last name of employee
    inquirer.prompt(questions[6]).then((lNameData) => {
      params.push(lNameData.empLName);
      // query db to get role options
      const sql1 = `SELECT r.id, r.title FROM role r`;
      db.promise()
        .query(sql1)
        .then(([row1, fields]) => {
          // modify question based on available roles and to ask the correct question
          questions[4].choices = row1.map((x) => x.title);
          questions[4].message = "What is the employee's role?";
          // get role of employee
          inquirer.prompt(questions[4]).then((roleData) => {
            // match role name to role id from last query
            params.push(
              row1.filter((el) => el.title === roleData.choice)[0].id
            );
            // query db to get manager options
            const sql2 = `SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) as name FROM employee e`;
            db.promise()
              .query(sql2)
              .then(([row2, fields]) => {
                // modify question based on available managers and to ask the correct question
                questions[4].choices = row2.map((x) => x.name);
                questions[4].message = "Who is the employee's manager?";
                // get manager of employee
                inquirer.prompt(questions[4]).then((manData) => {
                  const sql3 = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
                  // match manager name to manager id from last query
                  params.push(
                    row2.filter((el) => el.name === manData.choice)[0].id
                  );
                  // add the new employee
                  db.promise()
                    .query(sql3, params)
                    .then(([row2, fields]) => {
                      if (!row2.affectedRows) {
                        console.log("Employee not added.");
                      } else {
                        console.log(
                          params[0] +
                            " " +
                            params[1] +
                            " added to the database."
                        );
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
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
}

// Update employee role
function employeeUpdate() {
  const params = [];
  // get list of available employees
  const sqlEmp = `SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) as name FROM employee e`;
  db.promise()
    .query(sqlEmp)
    .then(([row1, fields]) => {
      // modify question based on available employees and to indicate update
      questions[4].choices = row1.map((x) => x.name);
      questions[4].message = "Which employee do you want to update?";
      // ask which employee to update
      inquirer.prompt(questions[4]).then((empData) => {
        questions[4].choices = ["Role", "Manager"];
        questions[4].message = "What do you want to update?";
        inquirer.prompt(questions[4]).then((updateChoice) => {
          if (updateChoice.choice === "Role") {
            const sqlUpdate = `UPDATE employee SET role_id = ? WHERE id = ?`;
            // query db to get role options
            const sqlRole = `SELECT r.id, r.title FROM role r`;
            db.promise()
              .query(sqlRole)
              .then(([row2, fields]) => {
                // modify question based on available roles and to ask the correct question
                questions[4].choices = row2.map((x) => x.title);
                questions[4].message = "What is the employee's new title?";
                // get new role of employee
                inquirer
                  .prompt(questions[4])
                  .then((roleData) => {
                    // match role name to role id from last query
                    params.push(
                      row2.filter((el) => el.title === roleData.choice)[0].id
                    );
                    // employee name
                    params.push(
                      row1.filter((el) => el.name === empData.choice)[0].id
                    );
                    // update the employee
                    db.promise()
                      .query(sqlUpdate, params)
                      .then(([row3, fields]) => {
                        if (!row3.affectedRows) {
                          console.log("Employee not updated.");
                        } else {
                          console.log(empData.choice + " updated.");
                        }
                        main();
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });
          } else {
            const sqlUpdate = `UPDATE employee SET manager_id = ? WHERE id = ?`;
            // query db to get manager options
            const sqlMan = `SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) as name FROM employee e`;
            db.promise()
              .query(sqlMan)
              .then(([row2, fields]) => {
                // modify question based on available managers and to ask the correct question
                questions[4].choices = row2.map((x) => x.name);
                questions[4].message = "Who is the employee's new manager?";
                // get manager of employee
                inquirer
                  .prompt(questions[4])
                  .then((manData) => {
                    // match manager name to manager id from last query
                    params.push(
                      row2.filter((el) => el.name === manData.choice)[0].id
                    );
                    // employee name
                    params.push(
                      row1.filter((el) => el.name === empData.choice)[0].id
                    );
                    // update the employee
                    db.promise()
                      .query(sqlUpdate, params)
                      .then(([row3, fields]) => {
                        if (!row3.affectedRows) {
                          console.log("Employee not updated.");
                        } else {
                          console.log(empData.choice + " updated.");
                        }
                        main();
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });
          }
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

// Update role salary
function roleUpdate() {
  const params = [];
  const sqlUpdate = `UPDATE role SET salary = ? WHERE id = ?`;
  // query db to get role options
  const sqlRole = `SELECT r.id, r.title FROM role r`;
  db.promise()
    .query(sqlRole)
    .then(([row1, fields]) => {
      // modify question based on available roles and to ask the correct question
      questions[4].choices = row1.map((x) => x.title);
      questions[4].message = "Which role do you want to update?";
      // get role to update
      inquirer
        .prompt(questions[4])
        .then((roleData) => {
          // get role new salary
          inquirer.prompt(questions[3]).then((salData) => {
            // match role name to role id from last query
            params.push(salData.roleSalary);
            // employee name
            params.push(
              row1.filter((el) => el.title === roleData.choice)[0].id
            );
            // update the employee
            db.promise()
              .query(sqlUpdate, params)
              .then(([row2, fields]) => {
                if (!row2.affectedRows) {
                  console.log("Role not updated.");
                } else {
                  console.log(roleData.choice + " updated.");
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
}

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
        const params = row.filter((el) => el.name === data.choice)[0].id;
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
    params.push(nameData.roleName);
    // get salary of role
    inquirer.prompt(questions[3]).then((salData) => {
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
            params.push(row1.filter((el) => el.name === depData.choice)[0].id);
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

// Delete role
function roleDelete() {
  // get list of available roles
  const sql = `SELECT r.id, r.title FROM role r`;
  db.promise()
    .query(sql)
    .then(([row, fields]) => {
      // modify question based on available roles and to indicate deletion
      questions[4].choices = row.map((x) => x.title);
      questions[4].message = "Which role do you want to delete?";
      // ask which role to delete
      inquirer.prompt(questions[4]).then((data) => {
        // use query to delete selected role using title selected
        const sql = `DELETE FROM role WHERE id = ?`;
        const params = row.filter((el) => el.title === data.choice)[0].id;
        db.promise()
          .query(sql, params)
          .then(([row, fields]) => {
            if (!row.affectedRows) {
              console.log("Role not found");
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
  inquirer.prompt(questions[7]).then((data) => {
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
      case "Update Role Salary":
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
