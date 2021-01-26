USE employee_tracker_db;

INSERT INTO departments (department_name) 
VALUES
("Human Relations"),
("Sales"),
("Legal"),
("Finance"),
("Engineer");

INSERT INTO roles (title, salary)
VALUES 
    ("Sales Lead", 100000),
    ("Salesperson", 80000),
    ("Lead Engineer", 130000),
    ("Engineer", 100000),
    ("Lawyer", 150000),
    ("Legal Team Lead", 180000),
    ("Accountant", 100000),
    ("Manager", 200000),

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES 
    ("Bob", "Dylan", ""),
    ("Keith", "Richards", ""),
    ("Bruce", "Springsteen", ""),
    ("Sturgal", "Simpson", "")