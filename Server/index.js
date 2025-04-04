const express = require('express');
const cors = require('cors')
require('dotenv').config();
const port =  parseInt(process.env.PORT);
const fs = require('fs').promises;
const bodyparser = require('body-parser');
const app = express();
const nodemon = require('nodemon');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true })); 
app.use(cors());

// function to get todo with lable if present
function FindTodo(lable,  todos)
{ 
    console.log(Array.isArray(todos));
    console.log(todos.length);
    if(Array.isArray(todos)){
    for(var i=0; i < todos.length; i++){
        if(todos[i].title == lable)
        {
            return todos[i];
        }
    }
    }
}


//function to read data from files

async function readFileData(filePath)
{
    var fileData;
    try
    {
        fileData = await fs.readFile(filePath, "utf8");
    }
    catch(error)
    {
        console.error("Error reading file", error);
    }
    return fileData;
}


// function to writedata to file

async function writeDataToFile(filePath, content)
{
     return await fs.writeFile(filePath, JSON.stringify(content));
}

//API to get all todos
app.get('/todos', async(req,res) => 
    {
         var todoList = await readFileData("todos.json");
         res.send(JSON.parse(todoList));
    })


// API to add todos into the list
app.post('/addTodo', async(req, res)=>
    {
    console.log(req.body);
    var label1 = req.body.title;
    var availableTodo;
    var fileData = await readFileData("todos.json");
    if(fileData != undefined)
    {
        //handle the edge case if data is empty array or empty string
        if(fileData == "" || fileData == [])
        {
            await writeDataToFile("todos.json", []);
        }
        var todoList = JSON.parse(fileData);
        if(Array.isArray(todoList))
        {
            availableTodo = FindTodo(label1, todoList);
            if(availableTodo != undefined)
            {
                res.send("Todo with same title already exists");
            }
            else{
                const { title, description, Progress } = req.body; // Extract values

                if (!title || !description || !Progress) {
                    return res.status(400).json({ error: "Missing required fields" });
                }
            
                // Simulate saving data (Replace this with your DB logic)
                const newTodo = { title, description, Progress };
                todoList.push(newTodo);
                await writeDataToFile("todos.json", todoList);
                res.send({message :"Todo added successfully."})
            }
        }
        else
        {
            res.send({message : "file data is undefined"});
        }
    } 
    else
    {
        res.send({message :"array is not found"});
    }
   
})

//API to update exisiting todo

app.put("/updateTodo", async(req, res) =>
{
    var title = req.body.title;
    var fileData = await readFileData("todos.json");

    if(fileData != undefined){
        if(fileData != "" || fileData != [])
        {
            var todoList = JSON.parse(fileData);
            if(Array.isArray(todoList))
            {
                var getTodo = todoList.findIndex((todo) => todo.title === title)
                if(getTodo != -1)
                {
                    todoList.splice(getTodo, 1);
                    const { title, description, Progress } = req.body; // Extract values

                    if (!title || !description || !Progress) {
                        return res.status(400).json({ error: "Missing required fields" });
                    }
                
                    // Simulate saving data (Replace this with your DB logic)
                    const updatedTodo = { title, description, Progress };
                    todoList.push(updatedTodo);
                   writeDataToFile("todos.json", todoList);
                   res.send({message :"Update todo successfully"});
                }
                else
                {
                    res.send({message :"No such todo found"});
                }
                
            }
            else
            {
                res.send({message :"Todo array is not available"});
            }
        }
        else
        {
            res.send({message :"empty file data"});
        }
    }
    else{
        res.send({message :"file data is undefined"});
    }
})

//API to delete todo after completion
app.delete("/deleteTodo", async(req, res) =>
    {
        var title = req.body.title;
        var fileData =  await readFileData("todos.json");
        if(fileData != undefined)
        {
            if(fileData == "" || fileData == [])
            {
                await fs.writeFile("todos.json", JSON.stringify([]));
            }
             var todoList = JSON.parse(fileData);
             if(Array.isArray(todoList))
             {
                var getTodo = todoList.findIndex((todo) => todo.title === title);
                if(getTodo != -1)
                {
                    todoList.splice(getTodo);
                    await writeDataToFile("todos.json", todoList);
                    res.send({message :"Todo deleted successfully"});
                }
                else
                {
                    res.send({message :"No such todod available to delete"});
                }
            }
            else
            {
               res.send({message :"No array found"});
            }

        }
    })

app.listen(port,() =>
    {
        console.log(`listening at port : ${port}`);
    })
