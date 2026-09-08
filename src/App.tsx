import { useState } from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";

type Task = {
  id: string;
  text: string;
  completed: boolean;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");

  const createTask = () => {
    if (newTask === "") return;
    const addTask = {
      id: uuidv4(),
      text: newTask,
      completed: false,
    };
    setTasks((task) => [...task, addTask]);
    setNewTask("");
  };

  const updateCompletion = (taskID) => {
    setTasks((prev) =>
      prev.map((currentTask) =>
        currentTask.id === taskID
          ? { ...currentTask, completed: !currentTask.completed }
          : currentTask,
      ),
    );
  };

  const deleteTask = (taskID) => {
    setTasks((prev) => prev.filter((currentTask) => currentTask.id !== taskID));
  };

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
        <button onClick={createTask}>Create Task</button>
      </div>
      <div className="tasks-container">
        {tasks &&
          tasks.map((task) => (
            <div
              className={`task-container ${task.completed === true ? "task-completed" : ""}`}
              key={task.id}
            >
              <div>{task.text}</div>
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
                  src={"../src/assets/trash.svg"}
                  className="check-image"
                  onClick={() => deleteTask(task.id)}
                ></img>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export default App;
