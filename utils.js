// setup utils
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//ecret for securing json web tokens
const JWT_SECRET = "himitsu";

//hash password

module.exports.hashPassword = (password) => {
	const hashValue = bcrypt.hashSync(password, 10);
	return hashValue;
};

//Compare hashed password from db with password from request
module.exports.comparePassword = (password, hash) => {
	const correct = bcrypt.compareSync(password, hash);
	return correct;
};

//create and sign json web token
module.exports.getJWTToken = (account) => {
	const userData = { userId: account.id, username: account.username };
	const accessToken = jwt.sign(userData, JWT_SECRET);
	return accessToken;
};

// Verify signature of json web token
module.exports.verifyJWT = (token) => {
	return jwt.verify(token, JWT_SECRET);
};

// Get data from json web token
module.exports.decodeJWT = (token) => {
	return jwt.decode(token, JWT_SECRET);
};
