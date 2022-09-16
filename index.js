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
let deps = [];
let roles = [];
let emps = [];

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
    type: "input",
    name: "roleSalary",
    message: "What is the salary of the role?",
  },
  {
    type: "list",
    message: "Which department does the role belong to?",
    name: "depChoice",
    choices: deps,
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
    choices: roles,
  },
  {
    type: "list",
    message: "Who is the employees's manager?",
    name: "manChoice",
    choices: [...emps, "None"],
  },
  {
    type: "list",
    message: "Which employee's role do you want to update?",
    name: "empChoice",
    choices: emps,
  },
  {
    type: "list",
    message: "Which role do you want to assign to the selected employee?",
    name: "empChoice",
    choices: roles,
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
    })
}

// Display roles
function roleDisplay() {
  //   SELECT r.id, r.title, d.name AS department, r.salary
  // FROM `role` r
  // LEFT JOIN department d ON r.department_id = d.id;
  main();
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
    })
}

// Display employees by manager
function employeeManDisplay() {
  // SELECT e.id,
  //   CONCAT(m.first_name, ' ', m.last_name) AS 'manager',
  //   e.first_name,
  //   e.last_name,
  //   r.title,
  //   d.name AS department,
  //   r.salary
  // FROM employee e
  //   LEFT JOIN `role` r ON e.role_id = r.id
  //   LEFT JOIN department d ON r.department_id = d.id
  //   LEFT JOIN employee m ON m.id = e.manager_id
  // ORDER BY m.id;
  main();
}

// Display employees by department
function employeeDepDisplay() {
  //   SELECT e.id,
  //     d.name AS department,
  //     CONCAT(m.first_name, ' ', m.last_name) AS 'manager',
  //     e.first_name,
  //     e.last_name,
  //     r.title,
  //     r.salary
  // FROM employee e
  //     LEFT JOIN `role` r ON e.role_id = r.id
  //     LEFT JOIN department d ON r.department_id = d.id
  //     LEFT JOIN employee m ON m.id = e.manager_id
  // ORDER BY d.id;
  main();
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
    })
}

// Accept user requests at main menu
function main() {
  inquirer.prompt(questions[0]).then((data) => {
    console.log(data.mMenuChoice);
    switch (data.mMenuChoice) {
      case "View All Employees":
        employeeDisplay();
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
        return true;
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
        return false;
    }
    // if (data.mMenuChoice === mMenu[0]) {
    //   console.log(0);
    //   employeeDisplay();
    // } else if (data.mMenuChoice === mMenu[1]) {
    //   console.log(1);
    // } else if (data.mMenuChoice === mMenu[2]) {
    //   console.log(2);
    // } else if (data.mMenuChoice === mMenu[3]) {
    //   console.log(3);
    // } else if (data.mMenuChoice === mMenu[4]) {
    //   console.log(4);
    // } else if (data.mMenuChoice === mMenu[5]) {
    //   console.log(5);
    //   departmentDisplay();
    // } else if (data.mMenuChoice === mMenu[6]) {
    //   console.log(6);
    // } else if (data.mMenuChoice === mMenu[7]) {
    //   console.log(7);
    //   budgetDisplay();
    // } else {
    //   console.log("Error.");
    // }

    // fulfillReq(team, data.teamAdd);
  });
}

// Function call to initialize app
main();
