const express = require("express");
const apiRouter = express.Router();

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

const routinesRouter = require("./routines");
apiRouter.use("/routines", routinesRouter);

const activitiesRouter = require("./activities");
apiRouter.use("/activities", activitiesRouter);

const routineActivitiesRouter = require("./routineActivities");
apiRouter.use("/routineactivities", routineActivitiesRouter);

apiRouter.get("/", (req, res) => {
  res.send("Test");
});

apiRouter.use((error, req, res, next) => {
  res.send(error);
});

module.exports = apiRouter;
