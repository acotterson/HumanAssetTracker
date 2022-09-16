-- SELECT d.name AS Department,
--     r.title AS Title,
--     r.salary AS Salary,
--     CONCAT(e.first_name, ' ', e.last_name) AS `Name`,
--     CONCAT(m.first_name, ' ', m.last_name) AS 'Manager'
-- FROM employee e
--     LEFT JOIN `role` r ON e.role_id = r.id
--     LEFT JOIN department d ON r.department_id = d.id
--     LEFT JOIN employee m ON m.id = e.manager_id
-- ORDER BY r.salary;

-- employee list by id
SELECT e.id,
    e.first_name,
    e.last_name,
    r.title,
    d.name AS department,
    r.salary,
    CONCAT(m.first_name, ' ', m.last_name) AS 'manager'
FROM employee e
    LEFT JOIN `role` r ON e.role_id = r.id
    LEFT JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON m.id = e.manager_id
ORDER BY e.id;

-- -- department list
-- SELECT * FROM department;

-- -- role list
-- SELECT r.id, r.title, d.name AS department, r.salary
-- FROM `role` r
-- LEFT JOIN department d ON r.department_id = d.id;

-- -- add department
-- INSERT INTO department (name)
-- VALUES
-- ("Coordination Team");

-- SELECT * FROM department;

-- -- add role
-- INSERT INTO `role` (title, salary, department_id)
-- VALUES
-- ("Pennant Bearer", 10000.00, 5);

-- SELECT * FROM `role`;

-- -- add employee
-- INSERT INTO employee (first_name, last_name, role_id, manager_id)
-- VALUES
-- ("Jenny", "Longbottom", 17, 14);

-- SELECT * FROM employee;

-- -- update role
-- UPDATE employee SET role_id = 10 WHERE id = 10;

-- SELECT * FROM employee;

-- -- update manager
-- UPDATE employee SET manager_id = 1 WHERE id = 10;

-- SELECT * FROM employee;

-- -- employee list by manager
-- SELECT e.id,
--     CONCAT(m.first_name, ' ', m.last_name) AS 'manager',
--     e.first_name,
--     e.last_name,
--     r.title,
--     d.name AS department,
--     r.salary
-- FROM employee e
--     LEFT JOIN `role` r ON e.role_id = r.id
--     LEFT JOIN department d ON r.department_id = d.id
--     LEFT JOIN employee m ON m.id = e.manager_id
-- ORDER BY m.id;

-- -- employee list by department
-- SELECT e.id,
--     d.name AS department,
--     CONCAT(m.first_name, ' ', m.last_name) AS 'manager',
--     e.first_name,
--     e.last_name,
--     r.title,
--     r.salary
-- FROM employee e
--     LEFT JOIN `role` r ON e.role_id = r.id
--     LEFT JOIN department d ON r.department_id = d.id
--     LEFT JOIN employee m ON m.id = e.manager_id
-- ORDER BY d.id;

-- -- employee list by department (1 department)
-- SELECT e.id,
--     d.name AS department,
--     CONCAT(m.first_name, ' ', m.last_name) AS 'manager',
--     e.first_name,
--     e.last_name,
--     r.title,
--     r.salary
-- FROM employee e 
--     LEFT JOIN `role` r ON e.role_id = r.id
--     LEFT JOIN department d ON r.department_id = d.id
--     LEFT JOIN employee m ON m.id = e.manager_id    
-- WHERE d.id = 4
-- ORDER BY d.id;

-- -- employee list by manager (1 manager)
-- SELECT e.id,
--     CONCAT(m.first_name, ' ', m.last_name) AS 'manager',
--     e.first_name,
--     e.last_name,
--     r.title,
--     d.name AS department,
--     r.salary
-- FROM employee e
--     LEFT JOIN `role` r ON e.role_id = r.id
--     LEFT JOIN department d ON r.department_id = d.id
--     LEFT JOIN employee m ON m.id = e.manager_id
-- WHERE m.id = 14
-- ORDER BY m.id;

-- -- display department budget use
-- SELECT d.name AS department, SUM(r.salary) AS "Budget Use"
-- FROM employee e
--     LEFT JOIN `role` r ON e.role_id = r.id
--     LEFT JOIN department d ON r.department_id = d.id
-- GROUP BY d.id;

-- -- delete department
-- DELETE FROM department WHERE id = 1;

-- SELECT * FROM department;

-- -- delete role
-- DELETE FROM `role` WHERE id = 10;

-- SELECT * FROM `role`;

-- -- delete employee
-- DELETE FROM employee WHERE id = 16;

-- SELECT * FROM employee;