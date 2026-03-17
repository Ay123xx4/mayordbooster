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

async function submitForm(){

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

const url = isLogin ? "/login" : "/signup";

const res = await fetch(url,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email,
password
})
});

const data = await res.json();

alert(data.message);

if(data.success && isLogin){
window.location.href = "dashboard.html";
}

}