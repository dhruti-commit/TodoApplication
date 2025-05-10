const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userIdentifier : {
        require : true,
        type : String,
        unique : true
    } ,
    password : {
        type : String,
        require : true,
    }
});


const User =  mongoose.model('User', userSchema);

const TodoSchema = new mongoose.Schema({
    title :{
        type : String,
        require : true
    },
    description : {
        type : String
    },
    createdDate : {
        type : Date,
        default : Date.now()
    },
    Progress : {
        type : String, enum : ['NotStarted', 'InProgress', 'Done'],
        default : 'pending'
    }, 
    id : {
        type : String,
        unique :true,
        require : true
    }
})
const TodoListSchema = new mongoose.Schema({
    userId : {
        require : true,
        unique : true,
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    todoList : {
        type : [TodoSchema]
    }
})

const todoListModel = new mongoose.model('TodoList', TodoListSchema);

module.exports = {
    User,
    todoListModel
}