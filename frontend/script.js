const inputBox = document.getElementById('taskInput')
const listContainer = document.getElementById('list-container')
// const li = document.createElement("li");


// CREATE TASK
async function addTask() {
  const task = inputBox.value.trim();
  if (task === '') {
    alert('Please enter a task');
    return;
  }

  try {
    let token = localStorage.getItem("token")
    let response = await axios.post("http://localhost:4032/todo/create-tasks",{task: task},
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  )
    inputBox.value=""
    await getTask()
    console.log(response.data)
  } catch (error) {
    console.error(error.message)
    alert("Failed to create a task")
  }
}
// GET TASK
async function getTask() {
  try {
    let token = localStorage.getItem("token")
    let response = await axios.get("http://localhost:4032/todo/get-tasks",
      {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  )

    listContainer.innerHTML = ""
    const tasks = response.data.allTasks
    tasks.forEach(function (taskData) {displayTask(taskData)})

    updateCounters()

  } catch (error) {
    console.error(error.response?.data|| error.message)
    alert("Failed to get task")
  }

}
//update task
async function updateTask(id, status) {
  try {
    let token = localStorage.getItem("token")
    let response = await axios.patch(
      `http://localhost:4032/todo/update-task/${id}`,{status: status},
      {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
    
    );
    console.log(response.data);

  } catch (error) {
    console.error(error.response?.data || error.message);
    alert("Failed to update task")
  }
}

// DELETE TASK
async function deleteTask(id) {
  try {
    let token = localStorage.getItem("token")
    let response = await axios.delete(
      `http://localhost:4032/todo/delete-task/${id}`,
      {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
    );

    console.log(response.data);

  } catch (error) {
    console.error(error.response?.data || error.message);
    alert("Failed to delete task")
    
  }
}


// Display task
function displayTask(taskData) {
  const li = document.createElement("li")

  li.innerHTML = `
   <input type="checkbox" ${taskData.status ? "checked":""}>
  <span class= "task-text">${taskData.task}<span>
  <button class="delete-btn">Delete</button>
  `

  listContainer.appendChild(li)
  const checkBox = li.querySelector("input");
  const taskText = li.querySelector(".task-text")
  const deleteBtn = li.querySelector("button")

taskText.classList.toggle("completed", checkBox.checked)

  // Update task
    checkBox.addEventListener("change", async function () {
    await updateTask(taskData._id, checkBox.checked)
    li.classList.toggle("completed", checkBox.checked);
    updateCounters();
    //delete-task
    deleteBtn.addEventListener("click", async function () {
      if (confirm("Are you sure you want to delete this task?")) {
        await deleteTask(taskData._id)
    
        li.remove();
        updateCounters();
      }
    })

  });
}


// Selecting the counter elements
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");
// function to update the completed and incomplete task
function updateCounters() {
  const completedTasks = document.querySelectorAll(".completed").length;  //Selects all elements having class completed
  const uncompletedTasks = document.querySelectorAll("li:not(.completed)").length; //Select every <li> that does NOT have class "completed"
  completedCounter.textContent = completedTasks;
  uncompletedCounter.textContent = uncompletedTasks;
}


if(listContainer && inputBox){
   getTask()
}


// Login form logic
const loginForm = document.getElementById("loginCredentialsForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value
    const password = document.getElementById("loginPassword").value;


    const loginError = document.getElementById("loginCredentialsError");
    const loginSuccess = document.getElementById("loginSuccess");

    loginError.classList.add("hidden");
    loginSuccess.classList.add("hidden");

    try {
      const response = await axios.post("http://localhost:4032/login/login-user", {
        email,
        password,
      })
      localStorage.setItem("token", response.data.token);
      window.location.href = "todo.html";
      loginSuccess.textContent = response.data.msg;

      loginSuccess.textContent = response.data.msg;
      loginSuccess.classList.remove("hidden");

    } catch (error) {
      loginError.textContent = error.response?.data?.msg || "Login failed";

      loginError.classList.remove("hidden")
    }
  })
}

// Register form logic

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    const registerError = document.getElementById("registerError");
    const registerSuccess = document.getElementById("registerSuccess");

    registerError.classList.add("hidden");
    registerSuccess.classList.add("hidden");

    try {
      const res = await axios.post("http://localhost:4032/register/create-user", {
        email,
        password
      });

      registerSuccess.textContent = res.data.msg;
      registerSuccess.classList.remove("hidden");

      registerForm.reset();

    } catch (err) {
      registerError.textContent = err.response?.data?.msg || "Registration failed";

      registerError.classList.remove("hidden");
    }
  });
}
