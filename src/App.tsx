import { useState, useEffect } from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";

type Task = {
  id: string;
  text: string;
  completed: boolean;
  priority: string;
  due_date: string | null;
};

type editText = {
  id: string;
  edit: boolean;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [editTextBool, setEditTextBool] = useState<editText | null>();
  const [editText, setEditText] = useState<string>("");
  const [filterTasks, setFilterTasks] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [taskPriority, setTaskPriority] = useState<string>("low");
  const [updatePriority, setUpdatePriority] = useState<string>("");
  const [newDate, setNewDate] = useState<string>("");
  const [editNewDate, setEditNewDate] = useState<string>("");

  useEffect(() => {
    const loadTasks = async () => {
      const response = await fetch("http://localhost:3000/api/tasks");
      const data = await response.json();

      console.log(data);
      setTasks(data);
    };

    loadTasks();
  }, []);

  const createTask = async () => {
    if (newTask === "") return;

    const response = await fetch("http://localhost:3000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newTask,
        priority: taskPriority,
        due_date: newDate,
      }),
    });

    const createdTask = await response.json();

    setTasks((prev) => [...prev, createdTask]);
    setNewTask("");
  };

  // const createTask = () => {
  //   if (newTask === "") return;
  //   const addTask = {
  //     id: uuidv4(),
  //     text: newTask,
  //     completed: false,
  //     priority: taskPriority,
  //   };
  //   setTasks((task) => [...task, addTask]);
  //   setNewTask("");
  // };

  const updateCompletion = async (taskID: string) => {
    const task = tasks.find((task) => task.id === taskID);

    if (!task) return;

    const response = await fetch(
      `http://localhost:3000/api/tasks/${taskID}/completed`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      },
    );

    const updatedTask = await response.json();

    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
  };

  // const updateCompletion = (taskID: string) => {
  //   setTasks((prev) =>
  //     prev.map((currentTask) =>
  //       currentTask.id === taskID
  //         ? { ...currentTask, completed: !currentTask.completed }
  //         : currentTask,
  //     ),
  //   );
  // };

  const deleteTask = async (taskID: string) => {
    const response = await fetch(`http://localhost:3000/api/tasks/${taskID}`, {
      method: "DELETE",
    });

    if (!response.ok) return;

    setTasks((prev) => prev.filter((task) => task.id !== taskID));
  };

  // const deleteTask = (taskID: string) => {
  //   setTasks((prev) => prev.filter((currentTask) => currentTask.id !== taskID));
  // };

  const editTask = async (taskID: string) => {
    if (editText.trim() === "") return;

    const response = await fetch(`http://localhost:3000/api/tasks/${taskID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: editText,
        priority: updatePriority,
        due_date: editNewDate,
      }),
    });

    if (!response.ok) return;

    const updatedTask = await response.json();

    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );

    setEditTextBool(null);
    setEditText("");
    setEditNewDate("");
  };

  // const editTask = (taskID: string) => {
  //   if (editText === undefined) return;
  //   setTasks((prev) =>
  //     prev.map((currentTask) =>
  //       currentTask.id === taskID
  //         ? { ...currentTask, text: editText, priority: updatePriority }
  //         : currentTask,
  //     ),
  //   );
  //   setEditTextBool(null);
  //   setEditText("");
  // };

  const handleTaskPriority = (priority: string) => {
    setTaskPriority(priority);
  };

  // const filteredTasks =
  //   filterTasks === "active"
  //     ? tasks.filter((task) => task.completed !== true)
  //     : filterTasks === "completed"
  //       ? tasks.filter((task) => task.completed === true)
  //       : tasks;

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      filterTasks === "all" ||
      (filterTasks === "active" && !task.completed) ||
      (filterTasks === "completed" && task.completed);

    const matchesPriority =
      filterPriority === "all" || task.priority === filterPriority;

    return matchesStatus && matchesPriority;
  });

  return (
    <>
      <div className="create-task-container">
        <textarea
          id="task-input"
          className="task-input"
          cols={100}
          rows={10}
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        ></textarea>
        <span>
          Priority:
          <select
            name=""
            id=""
            className="priority-selection"
            onChange={(e) => handleTaskPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </span>
        <div>
          <span>Due Date: </span>
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
        </div>
        <button onClick={createTask}>Create Task</button>
      </div>
      <hr />
      <div className="filter-container mt-5">
        <button onClick={() => setFilterTasks("all")}>All</button>
        <button onClick={() => setFilterTasks("active")}>Active</button>
        <button onClick={() => setFilterTasks("completed")}>Completed</button>
        <select
          name=""
          id=""
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="all">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="tasks-container">
        {tasks &&
          filteredTasks.map((task) =>
            editTextBool?.edit && editTextBool.id === task.id ? (
              <div
                className={`task-container ${task.completed === true ? "task-completed" : ""}`}
                key={task.id}
              >
                <input
                  value={editText ?? ""}
                  onChange={(e) => setEditText(e.target.value)}
                  className="bg-amber-50 rounded-sm w-180"
                ></input>
                <div className="task-actions">
                  <div onClick={() => editTask(task.id)}>Save</div>
                  <div
                    onClick={() => {
                      setEditTextBool(null);
                      setEditText("");
                    }}
                  >
                    Cancel
                  </div>
                  <select
                    value={updatePriority}
                    onChange={(e) => setUpdatePriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <input
                    type="date"
                    value={editNewDate}
                    onChange={(e) => setEditNewDate(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div
                className={`task-container ${task.completed === true ? "task-completed" : ""}`}
                key={task.id}
              >
                <div className="items-center">{task.text}</div>
                <div className="task-actions">
                  <img
                    src={
                      task.completed
                        ? "../src/assets/checked.svg"
                        : "../src/assets/unchecked.svg"
                    }
                    className="check-image"
                    onClick={() => updateCompletion(task.id)}
                  ></img>
                  <img
                    src="../src/assets/edit.svg"
                    className="check-image"
                    onClick={() => {
                      (setEditTextBool({ id: task.id, edit: true }),
                        setEditText(task.text),
                        setUpdatePriority(task.priority),
                        setEditNewDate(
                          task.due_date
                            ? new Date(task.due_date)
                                .toISOString()
                                .split("T")[0]
                            : "",
                        ));
                    }}
                  ></img>
                  <img
                    src={"../src/assets/trash.svg"}
                    className="check-image"
                    onClick={() => deleteTask(task.id)}
                  ></img>
                  <div
                    className={`${task.priority === "low" ? "bg-green-400" : task.priority === "medium" ? "bg-yellow-400" : "bg-red-600"} w-20 rounded-2xl font-bold`}
                  >
                    {task.priority}
                  </div>
                  <div className="w-25">
                    {task.due_date
                      ? new Date(task.due_date).toLocaleDateString()
                      : "No due Date"}
                  </div>
                </div>
              </div>
            ),
          )}
      </div>
    </>
  );
}

export default App;
