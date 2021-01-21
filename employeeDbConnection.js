const mysql = require('mysql');
const inquirer = require('inquirer');
var util = require("util");


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
                "Update an employee's role"
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
            default:
                connection.end();

        }
    } catch (err) {
        console.log(err);
        startQuestion();
    }
}

var addDepartment = async () => {
    try {
        var answer = await inquirer.prompt([{
            name: "departments",
            type: "input",
            message: "What department would you like to add?",
            validate: (value) => {
                if (isNaN(value) === false) {
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
    console.lot(answer.departments)
    startQuestion();
    }
    catch (err){
        console.log(err);
        startQuestion();
    }
}