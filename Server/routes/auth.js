const express = require('express');
const {User} = require('../db/index');
const {todoListModel} = require("../db/index")

const {setAuthCookie, clearAuthCookies} = require('../utils/auth')

const router = express.Router();

router.post("/signUp", async(req, res) =>{
    const userName = req.body.identifier;
    const password = req.body.password;

    const IsUser = await User.findOne({
        userIdentifier : userName,
    });

    if(IsUser !== null){
        return res.send({message : "User already present"});
    }
    else{
        if(password === '') return res.send({message : "Password reqired"});
        let userData = new User({userIdentifier : userName, password : password});
        await userData.save();
        setAuthCookie(res, userData._id);
       return res.send({message : "User created successfully", todos : []});
    }
})

router.post("/logIn", async(req, res)=>
    {
    const userName = req.body.identifier;
    const password = req.body.password;
    
    const IsUser = await User.findOne({userIdentifier : userName});

    if(!IsUser){
        res.send({message : "User not found"});
    }

    if (IsUser.password === password) {
        setAuthCookie(res, IsUser._id);
        const todos = await todoListModel.findOne({userId : IsUser._id});
        return res.send({ message: "Logged in successfully" ,
            todos : todos?. todoList || []});
      } else {
        return res.send({ message: "Incorrect password" });
      }
})

router.post('logout', (req, res) => {
    clearAuthCookies(res);
    return res.send({message : "logged out successfully"});
})

module.exports = router;