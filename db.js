//setup sqlite
const sqlite = require("sqlite3");
const db = new sqlite.Database("database.db");
const { hashPassword, comparePassword } = require("./utils");

//create the database tables if they don't exist
db.run(`
    CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        hashedPassword TEXT,
        CONSTRAINT uniqueUsername UNIQUE(username)
        )
    `);

//CARS table
db.run(`
    CREATE TABLE IF NOT EXISTS cars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        make TEXT,
        model TEXT
        )`);

//Save cars in database
module.exports.saveCar = (make, model, callback) => {
	const query = `INSERT INTO cars (make, model) 
        VALUES 
        (?, ?)
        `;
	const values = [make, model];

	db.run(query, values, callback);
};

//Get car from database by make and model
module.exports.getCarByMakeAndModel = function (make, model, callback) {
	const query = `SELECT * FROM cars WHERE make = ? AND model = ?`;
	const values = [make, model];
	db.get(query, values, callback);
};

//save user in database
module.exports.registerUser = (username, hashedPassword, callback) => {
	const query = `
            INSERT INTO accounts (username, hashedPassword)
            VALUES (?, ?)
            
            `;
	const values = [username, hashedPassword];

	db.run(query, values, callback);
};

//get user from database
module.exports.getAccountByUsername = function (username, callback) {
	const query = `
    SELECT * FROM accounts WHERE username = ?   
    `;

	const values = [username];
	db.get(query, values, callback);
};
