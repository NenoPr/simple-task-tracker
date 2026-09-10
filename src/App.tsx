import { useState } from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";

type Task = {
  id: string;
  text: string;
  completed: boolean;
  priority: string;
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

  const createTask = () => {
    if (newTask === "") return;
    const addTask = {
      id: uuidv4(),
      text: newTask,
      completed: false,
      priority: taskPriority,
    };
    setTasks((task) => [...task, addTask]);
    setNewTask("");
  };

  const updateCompletion = (taskID: string) => {
    setTasks((prev) =>
      prev.map((currentTask) =>
        currentTask.id === taskID
          ? { ...currentTask, completed: !currentTask.completed }
          : currentTask,
      ),
    );
  };

  const deleteTask = (taskID: string) => {
    setTasks((prev) => prev.filter((currentTask) => currentTask.id !== taskID));
  };

  const editTask = (taskID: string) => {
    if (editText === undefined) return;
    setTasks((prev) =>
      prev.map((currentTask) =>
        currentTask.id === taskID
          ? { ...currentTask, text: editText, priority: updatePriority }
          : currentTask,
      ),
    );
    setEditTextBool(null);
    setEditText("");
  };

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
        <button onClick={createTask}>Create Task</button>
      </div>
      <div className="filter-container">
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
                        setUpdatePriority(task.priority));
                    }}
                  ></img>
                  <img
                    src={"../src/assets/trash.svg"}
                    className="check-image"
                    onClick={() => deleteTask(task.id)}
                  ></img>
                  <div
                    className={`${task.priority === "low" ? "bg-green-400" : task.priority === "medium" ? "bg-yellow-400" : "bg-red-600"} w-20 rounded-2xl`}
                  >
                    {task.priority}
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
