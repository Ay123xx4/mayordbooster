const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const USERS_FILE = "users.json";

// create file if not exists
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

// get users
function getUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

// save users
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// SIGNUP
app.post("/signup", (req, res) => {
  const { email, password } = req.body;

  let users = getUsers();

  const exist = users.find((u) => u.email === email);

  if (exist) {
    return res.json({ success: false, message: "User already exists" });
  }

  users.push({ email, password });

  saveUsers(users);

  res.json({ success: true, message: "Registration successful" });
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  let users = getUsers();

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.json({ success: false, message: "Invalid credentials" });
  }

  res.json({ success: true, message: "Login successful" });
});

// ✅ REQUIRED FOR RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});