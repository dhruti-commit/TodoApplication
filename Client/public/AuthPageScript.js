
       function ShowForm(type){
             var logInForm = document.getElementById("LogInForm");
             var signUpForm = document.getElementById("SignUpForm");

             switch(type){
                case "Login" :
                logInForm.classList.add('active');
                signUpForm.classList.remove('active');
                break;
                case "Signup" :
                    logInForm.classList.remove('active');
                    signUpForm.classList.add('active');
                break;
             }

       }

       function getAuthValues(){
        let authDetails = {};
          const logInForm = document.getElementById("LogInForm");
          const signUpForm = document.getElementById("SignUpForm");

          if(logInForm.classList.contains('active')){
              const identifier = document.getElementById("logIn_Identifier").value;
              const password = document.getElementById("logIn_Password").value;

              authDetails.identifier = identifier;
              authDetails.password = password;

              return{type : 'logIn', authDetails};
          }
          else if(signUpForm.classList.contains('active')){
              const identifier = document.getElementById("signUp_Identifier").value;
              const password = document.getElementById("signUp_Password").value;

              authDetails.identifier = identifier;
              authDetails.password = password;

              return {type : 'signUp', authDetails};
          }

   }

       function LogIn_click(){
        const authdata = getAuthValues();


        fetch("http://localhost:3000/auth/logIn" , {
            method : "POST",
            headers :{
            "content-type" : "application/json"
        },
        body : JSON.stringify({
            identifier : authdata.authDetails.identifier,
            password : authdata.authDetails.password
        }),
        credentials : "include"
        }).then(res => res.json())
        .then((data) => {
            console.log(data);
            if(data.message === "Logged in successfully"){
                localStorage.setItem("todos", JSON.stringify(data.todos) || []);
                window.location.href = "/todo.html";
            }
            else{ alert(data.message);}
           })
        .catch(err => console.error("authentication error", err))
       }

       function Signup_click(){
        let authdata = getAuthValues();

        fetch("http://localhost:3000/auth/SignUp", {
            method : "POST",
            headers :{
            "content-type" : "application/json"
        },
            body : JSON.stringify({
                identifier : authdata.authDetails.identifier,
                password : authdata.authDetails.password
            })
        }).then(res => res.json())
        .then((data) => {
            if(data.message === "User created successfully"){
                localStorage.setItem("todos", JSON.stringify(data.todos));
                window.location.href = "/todo.html";
            }else{
                alert(data.message);
            }
        })
        .catch(err => console.error("authentication error", err))
       }