USE company_db
-- data from https://www.mockaroo.com/

INSERT INTO department (id, name) 
VALUES  (1, 'Administration'),
        (2, 'Engineering'),
        (3, 'Sales'),
        (4, 'Marketing'),
        (5, 'Human Resource');

INSERT INTO role (id, title, salary, department_id) 
VALUES  (1, 'Senior Quality Engineer', '180520', 2),
        (2, 'Software Engineer III', '139843', 2),
        (3, 'Director of Sales', '191432', 3),
        (4, 'Software Engineer I', '82158', 2),
        (5, 'Executive Secretary', '113656', 1),
        (6, 'Human Resource Manager', '106587', 5),
        (7, 'Senior Editor', '142119', 4),
        (8, 'Financial Analyst', '128808', 4),
        (9, 'Sales Representative', '97313', 3),
        (10,'Analyst Programmer', '77126', 2),
        (11,'Human Resources Assistant', '60991', 5);

INSERT INTO employee (id, first_name, last_name, role_id) 
VALUES  (1, 'Una', 'Pfaff', 11),
        (2, 'Berte', 'Petrollo', 3),
        (3, 'Duky', 'Haliday', 6),
        (4, 'Muire', 'Mance', 2),
        (5, 'Moll', 'Tassell', 4),
        (6, 'Aubrey', 'Freiburger', 4),
        (7, 'Izaak', 'Kares', 7),
        (8, 'Egon', 'Springthorp', 9),
        (9, 'Pearce', 'Hallows', 1),
        (10, 'Nickolai', 'Farnin', 5);

UPDATE employee
SET manager_id = 3
WHERE id = 1;

UPDATE employee
Set manager_id = 4
WHERE id = 5;

UPDATE employee
Set manager_id = 4
WHERE id = 6;

UPDATE employee
Set manager_id = 2
WHERE id = 7;

UPDATE employee
Set manager_id = 2
WHERE id = 8;