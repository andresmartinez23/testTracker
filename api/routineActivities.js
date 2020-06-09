const express = require("express");
const routine_Activities = express.Router();
const { getAllRoutine_Activities, updateRoutine_Activities, deleteRoutineActivity } = require("../db");

routine_Activities.use((req, res, next) => {
  console.log("Request being made to /routine_activities");

  next();
});

routine_Activities.patch("/:routineActivityId", async (req, res) => {
  const { routineId } = req.params;
  const { activityId, count, duration } = req.body;

  try {
    const updatedRoutines_Activities = await updateRoutine_Activities(routineId, {
      activityId,
      count,
      duration,
    });
    res.send(updatedRoutines_Activities);
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// routine_Activities.delete('/:routineActivityId', async (req, res) => {

//   try {
//     const 
//   }
// })

routine_Activities.get("/", async (req, res) => {
  const routineActivities = await getAllRoutine_Activities();

  res.send({
    routineActivities,
  });
});

module.exports = routine_Activities;

// curl http://localhost:3000/api/routineActivities/1/ -H "Content-Type: application/json" -X PATCH -d '{"activityId": "3", "count": "3", "duration": "80"}'
