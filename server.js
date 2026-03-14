const express = require("express")
const bodyParser = require("body-parser")
const fs = require("fs")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const app = express()

const SECRET = "darklove_secret_key"
const USERS_FILE = "users.json"

app.use(bodyParser.json())
app.use(express.static("public"))

if (!fs.existsSync(USERS_FILE)) {
fs.writeFileSync(USERS_FILE, JSON.stringify([]))
}

function getUsers(){
return JSON.parse(fs.readFileSync(USERS_FILE))
}

function saveUsers(users){
fs.writeFileSync(USERS_FILE, JSON.stringify(users,null,2))
}

app.post("/signup", async (req,res)=>{

const {email,password} = req.body

let users = getUsers()

const exist = users.find(u=>u.email===email)

if(exist){
return res.json({success:false,message:"User already exists"})
}

const hashed = await bcrypt.hash(password,10)

users.push({
email:email,
password:hashed
})

saveUsers(users)

res.json({success:true,message:"Account created successfully"})

})

app.post("/login", async (req,res)=>{

const {email,password} = req.body

let users = getUsers()

const user = users.find(u=>u.email===email)

if(!user){
return res.json({success:false,message:"User not found"})
}

const valid = await bcrypt.compare(password,user.password)

if(!valid){
return res.json({success:false,message:"Wrong password"})
}

const token = jwt.sign({email:user.email},SECRET,{expiresIn:"1h"})

res.json({
success:true,
token:token
})

})

function verifyToken(req,res,next){

const token = req.headers["authorization"]

if(!token){
return res.status(403).send("Access denied")
}

try{

const verified = jwt.verify(token,SECRET)

req.user = verified

next()

}catch{
res.status(401).send("Invalid token")
}

}

app.get("/dashboard",verifyToken,(req,res)=>{

res.json({
message:"Welcome to your dashboard "+req.user.email
})

})

app.listen(3000,()=>{
console.log("Server running http://localhost:3000")
})