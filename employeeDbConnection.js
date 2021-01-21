const mysql = require('mysql');
const inquirer = require('inquirer');


const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee_tracker_db',
});

// connection.query = util.promisify(connection.query);

connection.connect((err) => {
    if (err) throw err;
    startQuestion();
});

var startQuestion = async () => {
    try {
        var answer = await inquirer.prompt({
            type: 'list',
            name: 'task',
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