-- To avoid reference errors before referenced items are populated
SET FOREIGN_KEY_CHECKS = 0;

-- seed our tables
INSERT INTO department (`name`)
VALUES ("Brick Making"),
("Installation"),
("Moral"),
("Executive Team")
;

INSERT INTO `role` (title, salary, department_id)
VALUES ("Mud Dancer", 5.00, 1),
("Brick Shaper", 5.00, 1),
("Straw Gatherer", 1.00, 1),
("Water Gatherer", 3.00, 1),
("Clay Gatherer", 3.00, 1),
("Mason", 10.00, 2),
("Lubrication Specialist", 5.00, 2),
("Rope Crewman", 6.00, 2),
("Water Girl", 8.00, 3),
("Team Motivation Specialist", 50000.00, 3),
("Union Busting Czar", 30000.00, 3),
("Master Builder", 130000.00, 3),
("Chief Architect", 1100000.00, 4),
("Corruption Lead Investigator", 900000.00, 4),
("Board Member", 700000.00, 4),
("CEO", 1000000000.00, 4)
;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Judah", "ben Jonah", 1, 13),
("Jonah", "ben Judah", 2, 13),
("Jacob", "ben Jethro", 3, 13),
("Levi", "ben Lehi", 4, 13),
("Dan", "ben Joseph", 1, 13),
("Methuselah", "ben Jericho", 8, 14),
("Enoch", "ben Enos", 8, 14),
("David", "ben Saul", 8, 14),
("Isaiah", "ben Isaac", 5, 13),
("Jeremiah", "ben Isaachar", 8, 14),
("Joshua", "ben Nun", 6, 14),
("Dathan", "Weasel Eyes", 11, 15),
("Taskmaster", "Number 1", 2, 15),
("Taskmaster", "Number 2", 10, 15),
("Baka", "Master Butcher", 12, 16),
("Moses", "Prince of Egypt", 13, 19),
("Nefertari", "Princess of Egypt", 15, 19),
("Rameses", "Prince of Egypt", 14, 19),
("Seti I", "Morning and Evening Star", 16, NULL),
("Aaron", "ben Amram", 3, 13),
("Miriam", "ben Amram", 2, 13),
("Yochabel", "ben Levi", 7, 14),
("Judah", "ben Hur", 1, 13),
("Lilia", "ben Jonah", 9, 15)
;

-- Referencing should work now
SET FOREIGN_KEY_CHECKS = 1;