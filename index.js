//Setup
const express = require("express");

const db = require("./db.js");
const utils = require("./utils.js");

const app = express();

app.use(express.json());

//get user from token if logged in
app.use((req, res, next) => {
	const token = req.headers.authorization;

	if (token && utils.verifyJWT(token)) {
		const tokenData = utils.decodeJWT(token);
		req.user = tokenData;
		req.user.isLoggedIn = true;
	} else {
		req.user = { isLoggedIn: false };
	}

	next();
});

// force login middleware
const forceAuthorize = (req, res, next) => {
	if (req.user.isLoggedIn) {
		next();
	} else {
		res.sendStatus(401);
	}
};

// Get start page
app.get("/", (req, res) => {
	res.send(req.user);
});

// Register a new user
app.post("/register", (req, res) => {
	const { username, password } = req.body;

	const hashedPassword = utils.hashPassword(password);

	db.registerUser(username, hashedPassword, (error) => {
		if (error) {
			console.log(error);
			res.status(500).send(error);
		} else {
			res.sendStatus(200);
		}
	});
});

//Log in a user

app.post("/login", (req, res) => {
	const { username, password } = req.body;

	db.getAccountByUsername(username, (error, account) => {
		if (error) {
			res.status(500).send(error);
		} else if (account) {
			const hashedPassword = account.hashedPassword;
			const correctPassword = utils.comparePassword(password, hashedPassword);

			if (correctPassword) {
				const jwToken = utils.getJWTToken(account);
				res.send(jwToken);
			} else {
				res.sendStatus(404);
			}
		} else {
			res.sendStatus(404);
		}
	});
});

// Force Login to get secrets

app.get("/secrets", forceAuthorize, (req, res) => {
	res.send({
		secret1: "I'll never tell",
		secret2: "You'll never know",
		secret3: "About the thrill of the hunt",
	});
});

// create account

app.listen(8000, () => {
	console.log("http://localhost:8000");
});
