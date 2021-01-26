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
                updateEmployeeRole();
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

        console.log(`The department ${answer.departments} has been added successfully!`);

        startQuestion();
    }
    catch (err) {
        console.log(err);
        startQuestion();
    }
}

//////////////function to add role////////////////
var addRole = async () => {
    var deptRow = await connection.query("SELECT * FROM departments");
    var choicesArr = deptRow.map((deptID) => {
        return {
            name: deptID.dept_name,
            value: deptID.id,
        };
    });

    try {
        var answer = await inquirer.prompt([{
            name: "roles",
            type: "input",
            message: "What role would you like to add?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary for this role?"
        },
        {
            name: "department",
            type: "list",
            message: "Which department does this role belong in?",
            choices: choicesArr
        }
        ]);
        var result = await connection.query("INSERT INTO roles SET ?", {
            title: answer.roles,
            salary: answer.salary,
            department_id: answer.department
        });

        console.log(`The role ${answer.roles} has been added successfully!`);
        // console.log(answer.roles)
        startQuestion();
    }
    catch (err) {
        console.log(err);
        startQuestion();
    }
}

//////////////function to add an employee////////////////

// var empRow = await connection.query("SELECT * FROM employees");
// var choicesArr = empRow.map((empName) => {
//     return {
//         name: empName.first_name + " " + empName.last_name,
//         value: empName.id
//     }
// })
/////////////////////

var addEmployee = async () => {
    try {
        var roleRow = await connection.query("SELECT * FROM roles");
        var choicesArr = roleRow.map((employeeRole) => {
            return {
                name: employeeRole.title,
                value: employeeRole.id,
            };
        });

        var managerInfo = await connection.query("SELECT * FROM employees");
        var managerArr = managerInfo.map((manager) => {
            return {
                name: manager.first_name + " " + manager.last_name,
                value: manager.id
            };
        });

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
            name: "role",
            type: "list",
            message: "What role does the employee hold?",
            choices: choicesArr
        },
        {
            name: "manager_id",
            type: "list",
            message: "Who is the manager of this employee?",
            choices: managerArr
        }
        ]);
        var result = await connection.query("INSERT INTO employees SET ?", {
            id: answer.id,
            first_name: answer.first,
            last_name: answer.last,
            role_id: answer.role,
            manager_id: answer.manager_id
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
        var viewTable = await connection.query("SELECT * FROM roles");
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
        var viewTable = await connection.query("SELECT * FROM employees");
        console.table(viewTable);

        startQuestion();
    }
    catch (err) {
        console.log(err);
        startQuestion();
    }
}
///////UPDATING DATA///////////
///////updating employee roles/////////
updateEmployeeRole = async () => {
    try {
        var empRow = await connection.query("SELECT * FROM employees");
        var choicesArr = empRow.map((empName) => {
            return {
                name: empName.first_name + " " + empName.last_name,
                value: empName.id,
            }
        })

        var empAnswer = await inquirer.prompt([
            {
                name: "name",
                type: "list",
                message: "Please choose an employee",
                choices: choicesArr,
            },
        ]);
        var roleRow = await connection.query("SELECT * FROM roles");
        var roleChoicesArr = roleRow.map((employeeRole) => {
            return {
                name: employeeRole.title,
                value: employeeRole.id,
            }
        });

        var roleAnswer = await inquirer.prompt([
            {
                name: "role_id",
                type: "list",
                choices: roleChoicesArr,
                message: "Please choose a new role"
            }
        ])

        var result = await connection.query(`UPDATE employees SET ? WHERE ?`, [{ role_id: roleAnswer.role_id }, { id: empAnswer.employee_id }]);
        console.log("The role has been updated!");
        startQuestion();

    }
    catch (err) {
        console.log(err);
        startQuestion();
    }
};

var exitApp = async () => {
    connection.end();
}




