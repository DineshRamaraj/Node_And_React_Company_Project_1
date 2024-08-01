const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Todo } = require("../models/models");

const registerUser = async (req, res, next) => {
  const { username, email, mobileNumber, password } = req.body;

  const selectUser = await User.findOne({ email: email });
  //   console.log(selectUser);

  if (selectUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await User.create({
      username: username,
      email: email,
      mobileNumber: Number(mobileNumber),
      password: hashedPassword,
    });

    res.status(201).json({ message: "Inserted Successfully...", data: result });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    // console.log(user);
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    // console.log(isPasswordMatched);
    if (isPasswordMatched === true) {
      const payload = { username: user.username };
      const jwtToken = jwt.sign(payload, "MY_SECRET_KEY");
      res.status(200);
      res.send({ jwtToken, message: "Login Successfully..." });
    }
  } catch (err) {
    res.status(500);
    res.json({ message: "Internal Server Error" });
  }
};

// Add Todo Item

const addTodoItem = async (req, res) => {
    const { user_id} = req.params;
  const {description, status } = req.body;
  try {
    await Todo.create({
      user_id: user_id,
      description: description,
      status: status,
    });
    res.status(201);
    res.json({ message: "Successfully Add Todo Item..." });
  } catch (err) {
    res.status(500);
    res.json({ message: "Internal Server Error" });
  }
};

// get Todo Item

const getTodoItem = async (req, res) => {
  const { user_id } = req.params;
  try {
    const todoList = await Todo.find({ user_id: user_id });
    res.status(200);
    res.json({ data: todoList });
  } catch (err) {
    res.status(500);
    res.json({ message: "Internal Server Error" });
  }
};

// Updated Todo Item

const updateTodoItem = async (req, res) => {
  const { user_id } = req.params;
  const { id, description, status } = req.body;
  try {
    const checkItem = await Todo.findOne({ _id: id, user_id: user_id });
    if (!checkItem) {
      res.status(404);
      return res.json({ message: "Invalid Todo Item" });
    }

    const updateItem = await Todo.updateOne({
      _id: id,
      description: description || selectedItem.description,
      status: status || selectedItem.status,
    });
    res.status(200);
    res.json({ message: "Updated Successfully", data: updateItem });
  } catch (err) {
    res.status(500);
    res.json({ message: "Internal Server Error" });
  }
};

// Delete Todo Item

const deleteTodoItem = async (req, res) => {
  const { user_id } = req.params;
  const { id } = req.body;
  try {
    const checkItem = await Todo.findOne({ _id: id, user_id: user_id });
    if (!checkItem) {
      res.status(404);
      res.send({ message: "Not Found" });
    }
    await Todo.deleteOne({ _id: id, user_id: user_id });
    res.status(200);
    res.send({ message: "Delete Successfully" });
  } catch (err) {
    res.status(500);
    res.json({ message: "Internal Server Error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  addTodoItem,
  getTodoItem,
  updateTodoItem,
  deleteTodoItem,
};
