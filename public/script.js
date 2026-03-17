let isLogin = true;

function toggleForm(){

const title = document.getElementById("formTitle");
const toggle = document.querySelector(".toggle");

isLogin = !isLogin;

if(isLogin){
title.innerText = "Login";
toggle.innerText = "Don't have account? Sign up";
}else{
title.innerText = "Sign Up";
toggle.innerText = "Already have account? Login";
}

}


function toggle(){
login = !login;
document.getElementById("title").innerText = login ? "Login" : "Signup";
}

async function submitForm(){

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

const API = "https://YOUR-RENDER-LINK.onrender.com";

const url = login ? API + "/login" : API + "/signup";

const res = await fetch(url,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({email,password})
});

const data = await res.json();

alert(data.message);
}