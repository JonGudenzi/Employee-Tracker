const mysql = require('mysql');
const enquirer = require('enquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee_tracker_db',
});

connection.connect((err) => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
    connection.end();
});


const startQuestion = [
    {
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
    }
]

