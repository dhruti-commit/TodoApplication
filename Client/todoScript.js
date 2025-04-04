
// if one checkbox is selected then ither will be disabled to edit firstly unchecked to check one the proceed
document.addEventListener("DOMContentLoaded", function () {
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

//function to get all todos inside DOM
function domManipulation(parent, data){
    console.log(parent, data);
    var parentElement = document.getElementById(parent);
    
    var childElement = document.createElement("div");
    childElement.setAttribute("id", data.title);
    childElement.style.border = "1px solid black";
    childElement.style.padding = "5px";
    childElement.style.margin = "5px";

    var grandChildren1 = document.createElement("span");
    grandChildren1.innerHTML = "Title : ";

    var grandChildren2 = document.createElement("span");
    grandChildren2.innerHTML = data.title;
    

    var grandChildren3 = document.createElement("br");

    var grandChildren4 = document.createElement("span");
    grandChildren4.innerHTML = "Description : ";

     var grandChildren5 = document.createElement("span");
     grandChildren5.innerHTML = data.description;
 
     childElement.appendChild(grandChildren1);
     childElement.appendChild(grandChildren2);
     childElement.appendChild(grandChildren3);
     childElement.appendChild(grandChildren4);
     childElement.appendChild(grandChildren5);

     parentElement.appendChild(childElement);

     document.getElementById(data.title).addEventListener("click", function(){
        document.getElementById("title").value = data.title;
        document.getElementById("description").value = data.description;

        let progressDiv = document.getElementById("Progress-section");
        let checkboxes = progressDiv.querySelectorAll(".progress-checkbox");

        checkboxes.forEach(checkbox =>{
            let label = progressDiv.querySelector(`label[for="${checkbox.id}"]`);

            if(label && label.textContent.trim() === data.Progress){
                checkbox.checked = true;
            }else 
            {
                checkbox.checked = false;
            }
            console.log(label);
        })
     })
       
}

//function to get values from input boxes
function getValues(){
    let todoData = {}; // Object to store form data

    // Get the value from the textbox
    const taskTitle = document.getElementById("title").value;
    const taskDescription = document.getElementById("description").value;

    if (taskTitle && taskDescription) {
        todoData.title = taskTitle;
        todoData.description = taskDescription;
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

    fetch("http://localhost:3000/addTodo", {
        method : "POST",
        headers :{
            "content-type" : "application/json"
        },
        body : JSON.stringify(todoData)
    }).then(response => response.json())
    .then(() => getTodoList())
    .catch(error => console.error("Error", error));
    

}

//delete data from file if exist
function deleteTodo(){

    const deleteTodo = getValues();
    fetch("http://localhost:3000/deleteTodo", {
        method : "DELETE", headers :{
            "content-type" : "application/json"
        },
        body : JSON.stringify(deleteTodo)
    }).then(response => response.json())
    .then(() => getTodoList())
}

// Edit data into file if exist
function EditTodo(){

    const updatedTodoData = getValues();

    fetch("http://localhost:3000/updateTodo", {
        method : "PUT",
        headers :{
            "content-type" : "application/json"
        },
        body : JSON.stringify(updatedTodoData)
    }).then(response => response.json())
    .then(() => getTodoList())
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

    clearTodoList();

    function parsedResponse(getData){
    getData.forEach(data => {
        console.log(data.Progress);
        if(data.Progress === "NotStarted"){
            console.log("data added successfully");
            domManipulation("pending", data);
        }
        else if(data.Progress === "InProgress"){
            domManipulation("inProgress", data);
            console.log("data added successfully");
        }
        else if(data.Progress === "Done"){
            domManipulation("completed", data);
            console.log("data added successfully");
        }
    })
   }

   function editDataCalback(response){
        response.json().then(parsedResponse)
   }

    fetch("http://localhost:3000/todos", {
        method : "GET"
    }).then(editDataCalback)

    
}
