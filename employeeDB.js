const mysql = require('mysql');
const inquirer = require('inquirer');
const util = require("util");
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee_tracker_db',
});

connection.connect((err) => {
    if (err) throw err;
    startQuestion();
    console.log("SQL connected");
});

connection.query = util.promisify(connection.query);

var startQuestion = async () => {
    try {
        var answer = await inquirer.prompt({
            name: 'task',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'Add a department',
                'Add a role',
                'Add an employee',
                'View departments',
                'View roles',
                'View employees',
                "Update an employee's role",
                "Exit"
            ]
        });

        switch (answer.task) {
            case "Add a department":
                addDepartment();
                break;
            case "Add a role":
                addRole();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "View departments":
                viewDepartments();
                break;
            case "View roles":
                viewRoles();
                break;
            case "View employees":
                viewEmployee();
                break;
            case "Update an employee's role":
                addEmployeeRole();
                break;
            case "Exit":
                exitApp();
                break;
            default:
                connection.end();

        }
    } catch (err) {
        console.log(err);
        startQuestion();
    }
}
           //////ADD FUNCTIONS///////
///////////funciton to add department/////////////
var addDepartment = async () => {
    try {
        var answer = await inquirer.prompt([{
            name: "departments",
            type: "input",
            message: "What department would you like to add?",
            validate: (value) => {
                if ((value > 30) === false) {
                    return true;
                }
                return false;
            },
        },

        ]);
        var result = await connection.query("INSERT INTO departments SET ?", {
            dept_name: answer.departments
        });

        console.log("Your department has been added successfully!");
        console.log(answer.departments)
        startQuestion();
    }
    catch (err) {
        console.log(err);
        startQuestion();
    }
}

//////////////function to add role////////////////
var addRole = async () => {
    try {
        var answer = await inquirer.prompt([{
            name: "role",
            type: "input",
            message: "What role would you like to add?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary for this role?"
        },
        {
            name: "id",
            type: "input",
            message: "What is the department ID for this role?"
        }
        ]);
        var result = await connection.query("INSERT INTO role SET ?", {
            title: answer.role,
            salary: answer.salary,
            department_id: answer.id
        });

        console.log("Your role has been added successfully!");
        // console.log(answer.role)
        startQuestion();
    }
    catch (err) {
        console.log(err);
        startQuestion();
    }
}

//////////////function to add an employee////////////////
var addEmployee = async () => {
    try {
        var answer = await inquirer.prompt([{
            name: "first",
            type: "input",
            message: "What is the employee's FIRST name?"
        },
        {
            name: "last",
            type: "input",
            message: "What is the employee's LAST name?"
        },
        {
            name: "id",
            type: "input",
            message: "What is the manager ID for this employee?",
            validate: (value) => {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            },
        }
        ]);
        var result = await connection.query("INSERT INTO employee SET ?", {
            first_name: answer.first,
            last_name: answer.last,
            role_id: answer.id,
            manager_id: answer.id
        });

        console.log("Your employee has been added successfully!");

        startQuestion();
    }
    catch (err) {
        console.log(err);
        startQuestion();
    }
}

        //////VIEW FUNCTIONS///////
//////function to view departments//////////
var viewDepartments = async () => {
    try {
        var viewTable = await connection.query("SELECT * FROM departments");
        console.table(viewTable);

        startQuestion();
    }
    catch (err) {
        console.log(err);
        startQuestion();
    }
}

//////function to view roles//////

var viewRoles = async () => {
    try {
        var viewTable = await connection.query("SELECT * FROM role");
        console.table(viewTable);

        startQuestion();
    }
    catch (err) {
        console.log(err);
        startQuestion();
    }
}

//////////function to view the employee table/////////

var viewEmployee = async () => {
    try {
        var viewTable = await connection.query("SELECT * FROM employee");
        console.table(viewTable);

        startQuestion();
    }
    catch (err) {
        console.log(err);
        startQuestion();
    }
}