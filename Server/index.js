const express = require('express');
const { exec } = require('child_process');
const cors = require('cors')
require('dotenv').config();
const port =  parseInt(process.env.PORT);
const app = express();
const path = require('path');
const nodemon = require('nodemon');
const mongoose = require('mongoose');
const {todoListModel} = require('./db/index')
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');

const todoRoutes = require('./routes/todo');



app.use(express.static(path.join(__dirname ,'..', 'Client', 'public'))) ;

app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:3000",  // Match the frontend port
    credentials: true
  }));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/todo", todoRoutes);

mongoose.connect("mongodb+srv://radadiyaDhruti:as145%40Dh@dhrutin.vced37w.mongodb.net/TodoApp", {
  dbName : "TodoApp",
  }).then(async () => {
    console.log("Database connected");
  
    // 🔧 Drop accidental 'UserId' index if it exists
    try {
      const indexes = await todoListModel.collection.indexes();
      const hasWrongIndex = indexes.some(index => index.name === 'UserId_1');
  
      if (hasWrongIndex) {
        await todoListModel.collection.dropIndex('UserId_1');
        console.log("✅ Dropped invalid index: UserId_1");
      } else {
        console.log("✅ No invalid index found (UserId_1)");
      }
    } catch (err) {
      console.error("❌ Error checking/dropping index:", err);
    }
  
  }).catch(err => console.error("connection error", err));

  app.listen(port,() =>
    {
        console.log(`listening at port : ${port}`);
        exec(`start http://localhost:${port}/AuthPage.html`);
    })

    
// const authenticateJWT = (req, res, next) =>{
//     const token = req.cookies.token;

//     if(token){
//      jwt_token.verify(token, Secret_Key, (err, user) => 
//     {
//         if(err){
//             return res.status(403).json({message : "Forbidden"});
//         }
//         console.log(user);
//         if(!user.userId) return res.status(403).json({message : "Invalid token"});
        
//         req.userId = user.userId;
//        next();
//     });
//     }
//     else{
//         return res.status(401).json({message : "Unauthorised"});
//     }
// }

// const userSchema = new mongoose.Schema({
//     userIdentifier : {
//         require : true,
//         type : String,
//         unique : true
//     } ,
//     password : {
//         type : String,
//         require : true,
//     }
// });


// const User =  mongoose.model('User', userSchema);

// const TodoSchema = new mongoose.Schema({
//     title :{
//         type : String,
//         require : true
//     },
//     description : {
//         type : String
//     },
//     createdDate : {
//         type : Date,
//         default : Date.now()
//     },
//     Progress : {
//         type : String, enum : ['NotStarted', 'InProgress', 'Done'],
//         default : 'pending'
//     }, 
//     id : {
//         type : String,
//         unique :true,
//         require : true
//     }
// })
// const TodoListSchema = new mongoose.Schema({
//     userId : {
//         require : true,
//         unique : true,
//         type : mongoose.Schema.Types.ObjectId,
//         ref : 'User'
//     },
//     todoList : {
//         type : [TodoSchema]
//     }
// })

// const todoListModel = new mongoose.model('TodoList', TodoListSchema);


// app.post("/signUp", async(req, res) =>{
//     const userName = req.body.identifier;
//     const password = req.body.password;

//     const IsUser = await User.findOne({
//         userIdentifier : userName,
//     });

//     if(IsUser !== null){
//         return res.send({message : "User already present"});
//     }
//     else{
//         if(password === '') return res.send({message : "Password reqired"});
//         let userData = new User({userIdentifier : userName, password : password});
//         await userData.save();
//         setAuthCookie(res, userData._id);
//        return res.send({message : "User created successfully", todos : []});
//     }
// })

// app.post("/logIn", async(req, res)=>
//     {
//     const userName = req.body.identifier;
//     const password = req.body.password;
    
//     const IsUser = await User.findOne({userIdentifier : userName});

//     if(!IsUser){
//         res.send({message : "User not found"});
//     }

//     if (IsUser.password === password) {
//         setAuthCookie(res, IsUser._id);
//         const todos = await todoListModel.findOne({userId : IsUser._id});
//         return res.send({ message: "Logged in successfully" ,
//             todos : todos?. todoList || []});
//       } else {
//         return res.send({ message: "Incorrect password" });
//       }
// })

// function to get todo with lable if present
// function FindTodo(lable,  todos)
// { 
//     console.log(Array.isArray(todos));
//     console.log(todos.length);
//     if(Array.isArray(todos)){
//     for(var i=0; i < todos.length; i++){
//         if(todos[i].title == lable)
//         {
//             return todos[i];
//         }
//     }
//     }
// }


//function to read data from files

// async function readFileData(filePath)
// {
//     var fileData;
//     try
//     {
//         fileData = await fs.readFile(filePath, "utf8");
//     }
//     catch(error)
//     {
//         console.error("Error reading file", error);
//     }
//     return fileData;
// }


// // function to writedata to file

// async function writeDataToFile(filePath, content)
// {
//      return await fs.writeFile(filePath, JSON.stringify(content));
// }

// //API to get all todos
// app.get('/todos', authenticateJWT, async(req,res) => 
//     {
//          //var todoList = await readFileData("todos.json");
//          try{
//             var todos = await todoListModel.findOne({userId : req.userId});
//             res.status(200).json(todos ?. todoList || []);
//          }catch(err){
//             res.status(500).send({message : "Error to ferch Todos"});
//          }
       
//     })


// // API to add todos into the list
// // app.post('/addTodo', async(req, res)=>
// //     {
// //     console.log(req.body);
// //     var newTaskId = req.body.id;
// //     var fileData = await readFileData("todos.json");
// //     if(fileData != undefined)
// //     {
// //         //handle the edge case if data is empty array or empty string
// //         if(fileData == "")
// //         {
// //             await writeDataToFile("todos.json", []);
// //             fileData = await readFileData("todos.json");
// //         }
// //         var todoList = JSON.parse(fileData);
// //         if(Array.isArray(todoList))
// //         {
// //             var IsTask = todoList.findIndex((task) => task.id === newTaskId);
           
// //             if(IsTask != -1)
// //             {

// //                 res.send({message : "Id already present"});

// //             }
// //             else{
// //                 const { title, description, Progress ,createdDate, id} = req.body; // Extract values

// //                 if (!title || !description || !Progress || !createdDate) {
// //                     return res.status(400).json({ message: "Missing required fields" });
// //                 }
            
// //                 // Simulate saving data (Replace this with your DB logic)
// //                 const newTodo = { title, description, Progress, createdDate, id};
// //                 newTodo.id = new Date().toISOString().split("T")[0];
// //                 todoList.push(newTodo);
// //                 await writeDataToFile("todos.json", todoList);
// //                 res.send({message :"Todo added successfully."})
// //             }
// //         }
// //         else
// //         {
// //             res.send({message : "file data is undefined"});
// //         }
// //     } 
// //     else
// //     {
// //         res.send({message :"array is not found"});
// //     }
   
// // })

// // API to add todos into the list
//  app.post('/addTodo', authenticateJWT, async(req, res)=>{
//     const {title, description, Progress, createdDate} = req.body;
//     if(!title || !Progress) return res.status(400).json({message : "Missing required field"});

//     const newTodo = {
//     title,
//     description,
//     Progress,
//     createdDate : new Date(createdDate),
//     id: new Date().getTime().toString() // unique ID
//     };

//     try{
//         let todoDoc = await todoListModel.findOne({userId : req.userId});

//         if(!todoDoc){
//             todoDoc = new todoListModel({
//                 userId : req.userId,
//                 todoList : [newTodo]
//             })
//         }
//         else{
//             todoDoc.todoList.push(newTodo);
//         }
//         console.log(todoDoc);
//         await todoDoc.save();

//         return res.status(201).json({message : "todo added successfully"});

//     }catch(err){
//         console.log(err);
//         return res.status(500).json({message : "Internal server error"});
//     }
    
//  })

// //API to update exisiting todo

// app.put("/updateTodo", authenticateJWT,  async(req, res) =>
// {
//     var idToupdate = req.body.id;
//     var fileData = await readFileData("todos.json");

//     if(fileData != undefined){
//         if(fileData != "" || fileData != [])
//         {
//             var todoList = JSON.parse(fileData);
//             if(Array.isArray(todoList))
//             {
//                 var getTodo = todoList.findIndex((todo) => todo.id === idToupdate)
//                 if(getTodo != -1)
//                 {
//                     todoList.splice(getTodo, 1);
//                     const { title, description, Progress , createdDate, id} = req.body; // Extract values

//                     if (!title || !description || !Progress) {
//                         return res.status(400).json({ error: "Missing required fields" });
//                     }
                
//                     // Simulate saving data (Replace this with your DB logic)
//                     const updatedTodo = { title, description, Progress, createdDate, id};
//                     todoList.push(updatedTodo);
//                    writeDataToFile("todos.json", todoList);
//                    res.send({message :"Update todo successfully"});
//                 }
//                 else
//                 {
//                     res.send({message :"No such todo found"});
//                 }
                
//             }
//             else
//             {
//                 res.send({message :"Todo array is not available"});
//             }
//         }
//         else
//         {
//             res.send({message :"empty file data"});
//         }
//     }
//     else{
//         res.send({message :"file data is undefined"});
//     }
// })

// //API to delete todo after completion
// app.delete("/deleteTodo",authenticateJWT, async(req, res) =>
//     {
//         var idToDeleteTodo = req.headers.id;
//         var fileData =  await readFileData("todos.json");
//         if(fileData != undefined)
//         {
//             if(fileData == "" || fileData == [])
//             {
//                 writeDataToFile("todos.json", "[]").then(fileData = readFileData("todos.json"));
//             }
//              var todoList = JSON.parse(fileData);
//              if(Array.isArray(todoList))
//              {
//                 var getTodo = todoList.findIndex((todo) => todo.id === idToDeleteTodo);
//                 if(getTodo != -1)
//                 {
//                     todoList.splice(getTodo, 1);
//                     await writeDataToFile("todos.json", todoList);
//                     res.send({message :"Todo deleted successfully"});
//                 }
//                 else
//                 {
//                     res.send({message :"No such todod available to delete"});
//                 }
//             }
//             else
//             {
//                res.send({message :"No array found"});
//             }

//         }
//     })




