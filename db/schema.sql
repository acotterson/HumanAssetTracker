-- make sure we have the correct database by replacing a possible existing/duplicate
Drop DATABASE IF EXISTS grunts_db;
CREATE DATABASE grunts_db;

-- use our database
USE grunts_db;

-- department table
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

-- (job) role table (roles are connected to departments)
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMET PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECJMAL NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE
    SET NULL;
);

-- employee table (employees are connected to roles and manager ids are connected to employees)
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE
    SET NULL,
        FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE
    SET NULL
);