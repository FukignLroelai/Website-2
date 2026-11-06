// Required Packages.
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// The port
const PORT = 3000;

// In-memory user storage.
const users = [];

// Parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Session Config
app.use(
    session({
        secret: "mySecretKey",
        resave: false,
        saveUninitialized: false
    })
);

// Serve files from public folder
app.use(express.static(path.join(__dirname, "public")));

//Start of the register
app.post("/register", (req, res) => {

    const { username, email, password } = req.body;

    users.push({
        username,
        email,
        password
    });

    res.send(`
        <h1>You have successfully registered</h1>

        <a href="/login.html">
            Go to Login Page
        </a>
    `);
});

// The login
app.post("/login", (req, res) => {

    const { username, password } = req.body;

    const user = users.find(
        u =>
            u.username === username &&
            u.password === password
    );

    if (user) {

        // Save username to session
        req.session.username = username;

        res.send(`
            <h1>You have logged in successfully</h1>

            <a href="/profile">
                View Profile
            </a>
        `);

    } else {

        res.send(`
            <h1>The login credentials were incorrect</h1>

            <a href="/login.html">
                Return to Login Page
            </a>
        `);
    }
});

// The Profile Page
app.get("/profile", (req, res) => {

    if (!req.session.username) {

        return res.send(`
            <h1>You must be logged in first.</h1>

            <a href="/login.html">
                Login
            </a>
        `);
    }

    res.send(`
        <h1>Profile Page</h1>

        <p>
            Welcome,
            <strong>${req.session.username}</strong>
        </p>

        <a href="/logout">
            Logout
        </a>
    `);
});

// The logout
app.get("/logout", (req, res) => {

    req.session.destroy(() => {

        res.send(`
            <h1>You have been logged out.</h1>

            <a href="/login.html">
                Login Again
            </a>
        `);
    });
});

// Actually Starting the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
