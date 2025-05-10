const express = require('express');
const {authenticateJWT} = require('../middleware/index');

const {todoListModel} = require('../db/index');

const router = express.Router();

//API to get all todos
router.get('/todos', authenticateJWT, async(req,res) => 
    {
         //var todoList = await readFileData("todos.json");
         try{
            var todos = await todoListModel.findOne({userId : req.userId});
            res.status(200).json(todos ?. todoList || []);
         }catch(err){
            res.status(500).send({message : "Error to ferch Todos"});
         }
       
    })


// API to add todos into the list
 router.post('/addTodo', authenticateJWT, async(req, res)=>{
    const {title, description, Progress, createdDate} = req.body;
    if(!title || !Progress) return res.status(400).json({message : "Missing required field"});

    const newTodo = {
    title,
    description,
    Progress,
    createdDate : new Date(createdDate),
    id: new Date().getTime().toString() // unique ID
    };

    try{
        let todoDoc = await todoListModel.findOne({userId : req.userId});

        if(!todoDoc){
            todoDoc = new todoListModel({
                userId : req.userId,
                todoList : [newTodo]
            })
        }
        else{
            todoDoc.todoList.push(newTodo);
        }
        console.log(todoDoc);
        await todoDoc.save();

        return res.status(201).json({message : "todo added successfully"});

    }catch(err){
        console.log(err);
        return res.status(500).json({message : "Internal server error"});
    }
    
 })

//API to update exisiting todo

router.put("/updateTodo", authenticateJWT,  async(req, res) =>
{
    const {title, description, Progress, createdDate, id} = req.body;
    if(!title || !Progress || !description || !id) return res.status(400).json({message : "Missing required field"});

    try{
        let todoDoc = await todoListModel.findOne({userId : req.userId});

        if(!todoDoc){
            return res.status(404).json({message : "Todo list not found"});
        }
        
        const index = todoDoc.todoList.findIndex(todo => todo.id === id);

        if(index === -1) {return res.status(404).json({message : "Todo not found"});}

        todoDoc.todoList[index] = {title, description, Progress, createdDate, id };

        await todoDoc.save();

        return res.status(201).json({message : "todo updated successfully"});

    }catch(err){
        console.log(err);
        return res.status(500).json({message : "Internal server error"});
    }
    
 })
//API to delete todo after completion
router.delete("/deleteTodo",authenticateJWT, async(req, res) =>
    {
        var idToDeleteTodo = req.headers.id;

        try{
            const result = await todoListModel.updateOne(
                {userId : req.userId},
                {$pull : {todoList : {id : idToDeleteTodo}}
            });
            if(result.modifiedCount === 0){
                return res.status(404).json({message: " Todo not found or already deleted"});
            }

            res.status(200).json({message : "Todo deleted successfully"});
        }
        catch(err){
        console.log(err);
        res.status(500).json({message : "Internal server error"});
        }
        
    })

    module.exports = router;