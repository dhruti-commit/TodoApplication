
// if one checkbox is selected then ither will be disabled to edit firstly unchecked to check one the proceed
document.addEventListener("DOMContentLoaded", function () {
    clearFormInputs();
    const checkboxes = document.querySelectorAll(".progress-checkbox");

    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
            if (this.checked) {
                // Uncheck other checkboxes
                checkboxes.forEach((other) => {
                    if (other !== this) {
                        other.checked = false;
                        other.disabled = true; // Disable other checkboxes
                    }
                });
            } else {
                // If no checkboxes are checked, re-enable all of them
                let anyChecked = Array.from(checkboxes).some(cb => cb.checked);
                if (!anyChecked) {
                    checkboxes.forEach(cb => cb.disabled = false);
                }
            }
        });
    });
        console.log("control reach here");
        getTodoList();
    });

    //function to clear Form inputs after refresh
    function clearFormInputs() {
        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("date").value = "";
        document.getElementById("todoId").value = "";
    
        // Uncheck all progress checkboxes
        const checkboxes = document.querySelectorAll(".progress-checkbox");
        checkboxes.forEach(cb => {
            cb.checked = false;
            cb.disabled = false; // Also re-enable them if disabled
        });
    }

    

//function to get all todos inside DOM
function createTodoElement(data){
    //var parentElement = document.getElementById(parent);
    
    var childElement = document.createElement("div");
    childElement.setAttribute("id", data.id);
    childElement.style.cssText = "border: 1px solid black; padding: 5px; margin: 5px;";
    console.log(document.getElementById(data.id));
    childElement.innerHTML = `
    <span>Title : </span><span> ${data.title} </span><br>
    <span>Description : </span><span> ${data.description}</span><br>
    <span>Date : </span><span> ${data.createdDate} </span>
    `
console.log("control reaches here", document.getElementById(data.id));
     childElement.addEventListener("click", function(){
        document.getElementById("title").value = data.title;
        document.getElementById("description").value = data.description;
        document.getElementById("date").value = data.createdDate.split("T")[0];;
        document.getElementById("todoId").value = data.id;

        let progressDiv = document.getElementById("Progress-section");
        let checkboxes = progressDiv.querySelectorAll(".progress-checkbox");

        checkboxes.forEach(checkbox =>{
            let label = progressDiv.querySelector(`label[for="${checkbox.id}"]`);

            checkbox.checked = label?.textContent.trim() === data.Progress;
        })
     })

    return childElement;
       
}

//function to get values from input boxes
function getValues(){
    let todoData = {}; // Object to store form data

    // Get the value from the textbox
    const taskTitle = document.getElementById("title").value;
    const taskDescription = document.getElementById("description").value;
    const taskCreationDate = document.getElementById("date").value;
    const taskID = document.getElementById("todoId").value;

    if (taskTitle && taskDescription && taskCreationDate) {
        todoData.title = taskTitle;
        todoData.description = taskDescription;
        todoData.createdDate = taskCreationDate;
    }

    if (taskID) todoData.id = taskID;

    if (!todoData.id) {
        todoData.id = Date.now().toString(); // Ensures unique id
        todoData.createdDate = new Date().toISOString().split("T")[0];
    }

    const progressCheckbox = document.querySelector(".progress-checkbox:checked");

    if(progressCheckbox){
        let label = document.querySelector(`label[for = "${progressCheckbox.id}"]`);
        todoData.Progress = label.textContent.trim();
    }
    return todoData;
}

// adding data into file appropriately
function addTodo() {

    const todoData = getValues();

    fetch("/addTodo", {
        method : "POST",
        headers :{
            "content-type" : "application/json"
        },
        body : JSON.stringify(todoData)
    }).then(response => response.json())
    .then((data) => {
        alert(data.message);
        getTodoList();})
    .catch(error => console.error("Error", error));
    

}

//delete data from file if exist
function deleteTodo(){

    const deleteTodo = getValues();
    fetch("/deleteTodo", {
        method : "DELETE", 
        headers :{
            "content-type" : "application/json",
            "id" : deleteTodo.id
        }
    }).then(response => response.json())
    .then((data) => {
        alert(data.message);
        getTodoList();})
}

// Edit data into file if exist
function EditTodo(){

    const updatedTodoData = getValues();

    fetch("/updateTodo", {
        method : "PUT",
        headers :{
            "content-type" : "application/json"
        },
        body : JSON.stringify(updatedTodoData)
    }).then(response => response.json())
    .then((data) =>{
        alert(data.message);
        getTodoList();
    } )
}

// function to clear DOM 
function clearTodoList() {
    ["pending", "inProgress", "completed"].forEach(sectionId => {
        let section = document.getElementById(sectionId);

        if (section) {
            // Remove only dynamically added todos, keeping <label> and <hr>
            Array.from(section.children).forEach(child => {
                if (!(child.tagName === "LABEL" || child.tagName === "HR")) { 
                    child.remove();
                }
            });
        }
    });
}

// Get file data into DOM
function getTodoList(){
    clearFormInputs();
    clearTodoList();

    function parsedResponse(getData){
        if(getData.message == 'Empty File') return;
    
        clearTodoList();

        const fragments = {
            NotStarted : document.createDocumentFragment(),
            InProgress : document.createDocumentFragment(),
            Done : document.createDocumentFragment()
        };

    
    getData.forEach((todo) => {
       const element = createTodoElement(todo);
       fragments[todo.Progress]?.appendChild(element);
    });

    document.getElementById("pending").appendChild(fragments.NotStarted);
    document.getElementById("inProgress").appendChild(fragments.InProgress);
    document.getElementById("completed").appendChild(fragments.Done);
   
}

   function editDataCalback(response){
        response.json().then(parsedResponse)
   }

    fetch("http://localhost:3000/todos", {
        method : "GET"
    }).then(editDataCalback)

    
}
