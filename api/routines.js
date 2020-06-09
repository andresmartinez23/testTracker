const express = require("express");
const routinesRouter = express.Router();
const { getAllRoutines, updateRoutines } = require("../db");

routinesRouter.use((req, res, next) => {
  console.log("Request made to /routines");

  next();
});

routinesRouter.patch("/:routineId", async (req, res) => {
  const { routineId } = req.params;
  const { public, name, goal } = req.body;

  try {
    const updatedRoutines = updateRoutines(routineId, {
      public,
      name,
      goal,
    });
    res.send(updatedRoutines);
  } catch (error) {
    console.error(error);
    throw error;
  }
});

routinesRouter.get("/", async (req, res) => {
  const routines = await getAllRoutines();

  res.send({
    routines,
  });
});

module.exports = routinesRouter;

// curl http://localhost:3000/api/routines/1/ -H "Content-Type: application/json" -X PATCH -d '{"public": "true", "name": "Routine-1.1", "goal": "Lose 15-20 pounds"}'
