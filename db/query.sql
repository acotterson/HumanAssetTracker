SELECT d.name AS Department,
    r.title AS Title,
    r.salary AS Salary,
    CONCAT(e.first_name, ' ', e.last_name) AS `Name`,
    CONCAT(m.first_name, ' ', m.last_name) AS 'Manager'
FROM employee e
    LEFT JOIN `role` r ON e.role_id = r.id
    LEFT JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON m.id = e.manager_id
ORDER BY r.salary