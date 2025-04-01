const express = require('express');
require('dotenv').config();
const port =  parseInt(process.env.PORT);
const fs = require('fs').promises;
const bodyparser = require('body-parser');
const app = express();
const nodemon = require('nodemon');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true })); 


// function to get todo with lable if present
function FindTodo(lable,  todos)
{ 
    console.log(Array.isArray(todos));
    console.log(todos.length);
    if(Array.isArray(todos)){
    for(var i=0; i < todos.length; i++){
        if(todos[i].label == lable)
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
    //console.log(req.body);
    var label1 = req.body.label;
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
                res.send("Todo with same label already exists");
            }
            else{
                var newTodo = 
                {
                   "label" : req.body.label,
                   "description" : req.body.description,
                   "type" : req.body.type
                }
                todoList.push(newTodo)
                await writeDataToFile("todos.json", todoList);
                res.send("Todo added successfully.")
            }
        }
        else
        {
            res.send("file data is undefined");
        }
    } 
    else
    {
        res.send("array is not found");
    }
   
})

//API to update exisiting todo

app.put("/updateTodo", async(req, res) =>
{
    var label = req.body.label;
    var fileData = await readFileData("todos.json");

    if(fileData != undefined){
        if(fileData != "" || fileData != [])
        {
            var todoList = JSON.parse(fileData);
            if(Array.isArray(todoList))
            {
                var getTodo = todoList.findIndex((todo) => todo.label === label)
                if(getTodo != -1)
                {
                    todoList.splice(getTodo);
                    var updatedTodo = {
                   "label" : req.body.label,
                   "description" : req.body.description,
                   "type" : req.body.type
                    }
                   todoList.push(updatedTodo);
                   writeDataToFile("todos.json", todoList);
                   res.send("Update todo successfully");
                }
                else
                {
                    res.send("No such todo found");
                }
                
            }
            else
            {
                res.send("Todo array is not available");
            }
        }
        else
        {
            res.send("empty file data");
        }
    }
    else{
        res.send("file data is undefined");
    }
})

//API to delete todo after completion
app.delete("/deleteTodo", async(req, res) =>
    {
        var label = req.body.label;
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
                var getTodo = todoList.findIndex((todo) => todo.label === label);
                if(getTodo != -1)
                {
                    todoList.splice(getTodo);
                    await writeDataToFile("todos.json", todoList);
                    res.send("Todo deleted successfully");
                }
                else
                {
                    res.send("No such todod available to delete");
                }
            }
            else
            {
               res.send("No array found");
            }

        }
    })

app.listen(port,() =>
    {
        console.log(`listening at port : ${port}`);
    })
