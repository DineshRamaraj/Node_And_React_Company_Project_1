const express = require("express");
const {
  registerUser,
  loginUser,
  authenticateToken,
  addTodoItem,
  getTodoItem,
  updateTodoItem,
  deleteTodoItem,
} = require("../controllers/controllers");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/user/:user_id/todos", addTodoItem);
router.get("/user/:user_id/todos", getTodoItem);
router.put("/user/:user_id/todos/:id", updateTodoItem);
router.delete("/user/:user_id/todos/:id", deleteTodoItem);
// router.post("/user/:user_id/todos", authenticateToken, addTodoItem);
// router.get("/user/:user_id/todos", authenticateToken, getTodoItem);
// router.put("/user/:user_id/todos/:id", authenticateToken, updateTodoItem);
// router.delete("/user/:user_id/todos/:id", authenticateToken, deleteTodoItem);

module.exports = router;
