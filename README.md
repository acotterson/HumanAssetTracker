# Human Asset Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description

This application will allow the user to build out their work team and have a visual representation with links and information via HTML.

## Table of Contents

- [Human Asset Tracker](#human-asset-tracker)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Questions](#questions)
  - [License](#license)

## Installation

Download the files. Open a bash terminal in the main directory. Run "npm install". You will need mySQL installed and the connection details will need to be updated in the "index.js" file according to your database.

## Usage

Run "node index.js" or "npm start". Select what you want to do from the the provided list and it shall be done.

You may view a table of departments, roles, or employees. Employees can be sorted by id, manager, or department. Departments can be displayed with personnel budget usage for all employees in the department.

You may add departments, roles, and employees by following the given prompts. You may also delete all three, but when deleting a role or department you will need to first reassign any dependent employees/roles. You may also update the salary for a given role, and the role or manager for a given employee. When deleting an employee or updating their role, their subordinates will automatically transfer to the manager of the employee in question to not leave them without leadership.

[Video Link of Usage](https://drive.google.com/file/d/1x4Gf5DlQOY4okppMlyFFFLgsNuLeLjIk/view)

[HumanAssetTrackerResized.webm](https://user-images.githubusercontent.com/35825121/190838260-7d947901-e43d-4bf8-ac8d-39311aa89681.webm)


## Questions

Github Profile: [acotterson](https://github.com/acotterson)

If you have any additional questions, I can be reached at [acotterson@gmail.com](mailto:acotterson@gmail.com).

## License

Licensed under the MIT License: [MIT](https://opensource.org/licenses/MIT)
