const express = require("express");
const usersRouter = express.Router();
const { getAllUsers, userSQL, getUserByUsername } = require("../db");
usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next();
});

// curl http://localhost:3000/users

usersRouter.get("/", async (req, res) => {

  const users = await getAllUsers();

  res.send({
    users,
  });
});



// curl http://localhost:3000/users/register -H "Content-Type: application/json" -X POST -d '{"username": "albert", "password": "bertie99", "name": "bert"}'
// curl http://localhost:3000/users/register -H "Content-Type: application/json" -X POST -d '{"username": "Hanz", "password": "Hanzy99", "name": "Andres"}'
// curl -X POST http://localhost:3000/users/register -d '{"username": "Hanz", "password": "Hanzy99"}'

usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      next({
        name: "User_Exists_Error",
        message: "A user by that username already exists",
      });
    }

    console.log(username, password);
    const user = await userSQL({
      username,
      password,
    });

    // const token = jwt.sign(
    //   {
    //     id: user.id,
    //     username,
    //   },
    //   process.env.JWT_SECRET,
    //   {
    //     expiresIn: "1w",
    //   }
    // );

    res.send({
      message: "thank you for signing up",
      //token,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if(!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and a password",
    });
  }

  try {
    const user = await getUserByUsername(username);

    if (user && user.password == password) {
      res.send({
        message: "you're logged in!", /* token */
      })
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
})

module.exports = usersRouter;

// curl -X POST http://localhost:3000/api/users/register -d '{"username": "b-rye", "password": "bDaKing"}' -H "Content-Type: application/json"

// curl http://localhost:3000/api/users/login -H "Content-Type: application/json" -X POST -d '{"username": "Hanz", "password": "Hanzy99"}'