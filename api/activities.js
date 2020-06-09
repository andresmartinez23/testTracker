const express = require("express");
const activitiesRouter = express.Router();
const { getAllActivities, updateActivities } = require("../db");

activitiesRouter.use((req, res, next) => {
  console.log("Request being made to /activities");

  next();
});

activitiesRouter.patch("/:activityId", async (req, res) => {
  const { activityId } = req.params;
  const { name, description } = req.body;

  try {
    const updatedActivities = updateActivities(activityId, {
      name,
      description,
    });
    res.send(updatedActivities);
  } catch (error) {
    console.error(error);
    throw error;
  }
});

activitiesRouter.get("/", async (req, res) => {
  const activities = await getAllActivities();

  res.send({
    activities,
  });
});

module.exports = activitiesRouter;

// curl http://localhost:3000/api/activities/1/ -H "Content-Type: application/json" -X PATCH -d '{"name": "Sprinting", "description": "running but faster"}'
 