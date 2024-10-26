const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Todo } = require("../models/models");

const registerUser = async (req, res, next) => {
  const { username, email, mobilenumber, password } = req.body;
  // console.log("enter register DB");
  // console.log(req.body);
  const selectUser = await User.findOne({ email: email });
  // console.log(selectUser);

  if (selectUser !== null) {
    res.status(409);
    res.json({ message: "User already exists" });
    return;
  }
  console.log(1);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(2);

    await User.create({
      username: username,
      email: email,
      mobileNumber: Number(mobilenumber),
      password: hashedPassword,
    });
    console.log(3);

    res.status(201);
    res.json({ message: "Inserted Successfully..." });
  } catch (err) {
    res.status(500);
    res.json({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // console.log("This is DB message. It is working");
    const user = await User.findOne({ email: email });
    // console.log(user);
    if(user === null){
      res.status(404);
      res.json({error_msg: "User not found"});
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    // console.log(isPasswordMatched);
    if (isPasswordMatched === true) {
      const payload = { username: user.username };
      const jwtToken = jwt.sign(payload, "MY_SECRET_KEY");
      res.status(200);
      res.json({
        jwt_token: jwtToken,
        user_id: user._id,
        message: "Login Successfully...",
      });
    } else {
      res.status(404);
      res.json({ error_msg: "Invalid Password" });
    }
  } catch (err) {
    res.status(500);
    res.json({ error_msg: "Internal Server Error" });
  }
};

// const authenticateToken = (request, response, next) => {
//   console.log("Authenticate Token");
//   let jwtToken;

//   console.log(request.headers);
//   const authHeader = request.headers["authorization"];
//   console.log(authHeader);
//   if (authHeader !== undefined) {
//     jwtToken = authHeader.split(" ")[1];
//   }
//   if (jwtToken === undefined) {
//     response.status(401);
//     response.send("Invalid Access Token");
//   } else {
//     jwt.verify(jwtToken, "MY_SECRET_KEY", async (error, payload) => {
//       if (error) {
//         response.send("Invalid Access Token");
//       } else {
//         // console.log(payload);
//         request.username = payload.username;
//         next();
//       }
//     });
//   }
// };

// Add Todo Item

const addTodoItem = async (req, res) => {
  const { user_id } = req.params;
  const { description, status } = req.body;
  try {
    if (!description || !status) {
      res.status(404);
      res.json({ error_msg: "Fill the Both Fields" });
      return;
    }

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
  // console.log(user_id);
  try {
    const todoList = await Todo.find({ user_id: user_id });
    res.status(200);
    res.json({ todo_list: todoList });
  } catch (err) {
    res.status(500);
    res.json({ error_msg: "Internal Server Error" });
  }
};

// Updated Todo Item

const updateTodoItem = async (req, res) => {
  const { user_id, id } = req.params;
  const { description, status } = req.body;
  try {
    const checkItem = await Todo.findOne({ _id: id, user_id: user_id });
    if (!checkItem) {
      res.status(404);
      return res.json({ message: "Invalid Todo Item" });
    }

    const updateFields = {};
    if (description) updateFields.description = description;
    if (status) updateFields.status = status;

    const updateItem = await Todo.updateOne(
      { _id: id, user_id: user_id },
      {
        $set: {
          description: description || checkItem.description,
          status: status || checkItem.status,
        },
      }
    );

    if (updateItem.nModified === 0) {
      return res.status(400).json({ message: "No changes made to the item" });
    }

    res.status(200);
    res.json({ message: "Updated Successfully", data: updateItem });
  } catch (err) {
    res.status(500);
    res.json({ message: "Internal Server Error" });
  }
};

// Delete Todo Item

const deleteTodoItem = async (req, res) => {
  const { user_id, id } = req.params;
  // console.log(req.params);
  try {
    const checkItem = await Todo.findOne({ _id: id, user_id: user_id });
    // console.log(checkItem);
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
