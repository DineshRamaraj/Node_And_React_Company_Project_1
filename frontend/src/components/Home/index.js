import Cookies from "js-cookie";
import { useEffect, useState, useCallback } from "react";
import { ThreeDots } from "react-loader-spinner";
import { Navigate } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import Failure from "../Failure";
// import Popup from "reactjs-popup";
import "./index.css";
import EmptyList from "../EmptyList";

// const statusListConstants = {
//   not_start: "NOT START",
//   progress: "PROGRESS",
//   done: "DONE",
// };

const apiStatusConstants = {
  initial: "INITIAL",
  in_progress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const Home = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  // const [statusItem, setStatusItem] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [todoDescription, setTodoDescription] = useState("");
  const [todoStatus, setTodoStatus] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateTodoId, setUpdateTodoId] = useState(null);

  const user_id = Cookies.get("user_id");
  const jwtToken = Cookies.get("jwt_token");

  const getTodoList = useCallback(async () => {
    setApiStatus(apiStatusConstants.in_progress);
    const response = await fetch(`http://localhost:5000/user/${user_id}/todos`);
    const data = await response.json();
    const updatedData = data.todo_list.map((eachItem) => ({
      description: eachItem.description,
      status: eachItem.status,
      id: eachItem._id,
    }));
    if (response.ok === true) {
      setTodoList(updatedData);
      setApiStatus(apiStatusConstants.success);
    } else {
      console.log("Failed to Fetch");
      setApiStatus(apiStatusConstants.failure);
    }
  }, [user_id]);

  useEffect(() => {
    getTodoList();
  }, [user_id, jwtToken, getTodoList]);

  if (jwtToken === undefined) {
    return <Navigate to="/login" />;
  }
  // console.log(todoList);

  if (apiStatus === "FAILURE") {
    return <Failure onRetry={getTodoList} />;
  }

  const renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <ThreeDots color="blue" height={50} width={50} />
    </div>
  );

  const clickAddTodo = async (e) => {
    e.preventDefault();
    const todoDetails = {
      description: todoDescription,
      status: todoStatus,
    };

    const apiUrl = isUpdate
      ? `http://localhost:5000/user/${user_id}/todos/${updateTodoId}`
      : `http://localhost:5000/user/${user_id}/todos`;

    const options = {
      method: isUpdate ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(todoDetails),
    };

    try {
      const response = await fetch(apiUrl, options);
      if (response.ok === true) {
        setTodoDescription("");
        setTodoStatus("");
        setIsUpdate(false);
        setUpdateTodoId(null);
        getTodoList();
      } else {
        console.log("Please Try Again...");
      }
    } catch (err) {
      console.log("Internal Server Error");
    }
  };

  const clickDeleteTodo = async (id) => {
    const apiUrl = `http://localhost:5000/user/${user_id}/todos/${id}`;
    const options = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const response = await fetch(apiUrl, options);
    if (response.ok === true) {
      // console.log("Delete Successfully");
      getTodoList();
    } else {
      console.log("Internal Error in the Application");
    }
  };

  const clickUpdateTodo = async (id) => {
    const todoItem = todoList.find((eachItem) => eachItem.id === id);
    setTodoDescription(todoItem.description);
    setTodoStatus(todoItem.status);
    setIsUpdate(true);
    setUpdateTodoId(id);
  };

  const renderTodoList = () => {
    if (todoList.length === 0) {
      return <EmptyList />;
    }
    return (
      <ul className="todo-list-container list-group">
        {todoList.map((eachTodo) => (
          <li
            key={eachTodo.id}
            className="todo-list-item list-group-item list-group-item-secondary"
          >
            <div className="todo-list-item-element">
              <p className="each-todo-description">{eachTodo.description}</p>
              <div className="todo-list-item-status-container">
                <span
                  className="todo-list-status-icon"
                  style={{ backgroundColor: "blue" }}
                ></span>
                <p className="each-todo-status">{eachTodo.status}</p>
              </div>
            </div>
            <div className="todo-list-update-delete-button-container">
              <button
                type="button"
                className="todo-list-update-button"
                onClick={() => clickUpdateTodo(eachTodo.id)}
              >
                <MdEdit className="todo-list-update-icon" />
              </button>
              <button
                type="button"
                className="todo-list-delete-button"
                onClick={() => clickDeleteTodo(eachTodo.id)}
              >
                <MdDelete className="todo-list-delete-icon" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="home-container">
      <h1 className="home-heading">To-do Application</h1>
      <div className="todo-container">
        <form onSubmit={clickAddTodo} className="add-todo-container">
          <input
            type="text"
            name="description"
            id="todoDescription"
            className="todo-description"
            placeholder="Enter your Description"
            value={todoDescription}
            onChange={(e) => setTodoDescription(e.target.value)}
          />
          <input
            type="text"
            name="status"
            id="todoStatus"
            className="todo-status"
            placeholder="Enter your Status"
            value={todoStatus}
            onChange={(e) => setTodoStatus(e.target.value)}
          />
          <div className="todo-addbutton-container">
            <button type="submit" className="btn btn-primary">
              {isUpdate ? "Update" : "Add Todo"}
            </button>
          </div>
        </form>
        <h1 className="todo-list-item-heading">Todo List Items: </h1>
        {apiStatus === "IN_PROGRESS" ? renderLoading() : renderTodoList()}
      </div>
    </div>
  );
};

export default Home;
