const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

const USERS_FILE = "users.json";

// create users file if not exists
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

// REGISTER
app.post("/signup", (req, res) => {

    const { email, password } = req.body;

    let users = JSON.parse(fs.readFileSync(USERS_FILE));

    const userExists = users.find(user => user.email === email);

    if (userExists) {
        return res.json({ success: false, message: "User already exists" });
    }

    users.push({ email, password });

    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    res.json({ success: true, message: "Registration successful" });

});

// LOGIN
app.post("/login", (req, res) => {

    const { email, password } = req.body;

    let users = JSON.parse(fs.readFileSync(USERS_FILE));

    const user = users.find(
        u => u.email === email && u.password === password
    );

    if (!user) {
        return res.json({ success: false, message: "Invalid credentials" });
    }

    res.json({ success: true, message: "Login successful" });

});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});