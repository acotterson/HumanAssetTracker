// Include packages needed for this application
const inquirer = require("inquirer");
// const db = require("./db");
// const queries = require("./queries");

// Options lists
const mMenu = [
    "View All Employees",
    "Add Employee",
    "Update Employee Role",
    "View All Roles",
    "Add Role",
    "View All Departments",
    "Add Department",
    "Quit",
  ]
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

// Accept user requests at main menu
function main() {
  inquirer.prompt(questions[0]).then((data) => {
    console.log(data.mMenuChoice);
    if (data.mMenuChoice === mMenu[0]) {
      console.log(0);
    } else if (data.mMenuChoice === mMenu[1]) {
        console.log(1);
    } else if (data.mMenuChoice === mMenu[2]) {
        console.log(2);
    } else if (data.mMenuChoice === mMenu[3]) {
        console.log(3);
    } else if (data.mMenuChoice === mMenu[4]) {
        console.log(4);
    } else if (data.mMenuChoice === mMenu[5]) {
        console.log(5);
    } else if (data.mMenuChoice === mMenu[6]) {
        console.log(6);
    } else if (data.mMenuChoice === mMenu[7]) {
        console.log(7);
    } else {
        console.log("Error.");
    }
    
    // fulfillReq(team, data.teamAdd);
  });
}

// Function call to initialize app
main();