let login = true

function toggle(){

login = !login

document.getElementById("title").innerText = login ? "Login" : "Signup"

}

async function submitForm(){

const email = document.getElementById("email").value
const password = document.getElementById("password").value

const url = login ? "/login" : "/signup"

const res = await fetch(url,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({email,password})
})

const data = await res.json()

if(data.token){

localStorage.setItem("token",data.token)

window.location="dashboard.html"

}else{

alert(data.message)

}

}