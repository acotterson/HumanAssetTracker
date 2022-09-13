SELECT department.name AS department, `role`.title, `role`.salary, employee.first_name, employee.last_name
`role`.title, `role`.salary
FROM `role`
LEFT JOIN department
ON role.department_id = department.id
ORDER BY department.name