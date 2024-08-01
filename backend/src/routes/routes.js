const express = require("express");
const {
  registerUser,
  loginUser,
  addTodoItem,
  getTodoItem,
  updateTodoItem,
  deleteTodoItem,
} = require("../controllers/controllers");
const router = express.Router();

router.post("/register", registerUser);
router.get("/login", loginUser);
router.post("/user/:user_id/todos", addTodoItem);
router.get("/user/:user_id/todos", getTodoItem);
router.put("/user/:user_id/todos", updateTodoItem);
router.delete("/user/:user_id/todos", deleteTodoItem);

module.exports = router;