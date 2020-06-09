const { client } = require("./client");

const {
  activitiesSQL,
  routinesSQL,
  routineActivitiesSQL,
  updateActivities,
  userSQL,
  getPublicRoutines,
  getAllRoutines,
} = require("./");

async function test() {
  try {
    console.log("All Routines...");
    const test = await getAllRoutines();
    test.forEach((t) => {
      console.log("All Routines", t);
    });

    console.log("All PUBLIC routines...");
    const public = await getPublicRoutines();
    public.forEach((t) => {
      console.log("Public Routines", t);
    });
    // const { rows } = await client.query(`SELECT * FROM users;`);
    // console.log(rows);

    // const { rows: activities } = await client.query(
    //   `SELECT * FROM activities;`
    // );
    // console.log(activities);

    // const { rows: routines } = await client.query(`SELECT * FROM routines;`);
    // console.log(routines);

    // const { rows: routine_activities } = await client.query(
    //   `SELECT * FROM routine_activities;`
    // );
    // console.log(routine_activities);
  } catch (error) {
    console.error(error);
  }
}

async function tables() {
  try {
    console.log("Creating tables now...");

    await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        );
        CREATE TABLE activities (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL,
            description TEXT NOT NULL
        );
        CREATE TABLE routines (
            id SERIAL PRIMARY KEY,
            "creatorId" INTEGER REFERENCES users(id),
            public BOOLEAN DEFAULT false,
            name VARCHAR(255) UNIQUE NOT NULL,
            goal TEXT NOT NULL
        );
        CREATE TABLE routine_activities (
            id SERIAL PRIMARY KEY,
            "routineId" INTEGER REFERENCES routines(id),
            "activityId" INTEGER REFERENCES activities(id),
            duration INTEGER,
            count INTEGER,
            UNIQUE ("routineId", "activityId")
        );
        `);

    console.log("Done creating tables!");
  } catch (error) {
    console.error("Error creating tables!");
    throw error;
  }
}

async function dropTables() {
  try {
    console.log("Dropping tables...");

    await client.query(`
        DROP TABLE IF EXISTS routine_activities;
        DROP TABLE IF EXISTS routines;
        DROP TABLE IF EXISTS activities;
        DROP TABLE IF EXISTS users;
        `);

    console.log("Done dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log("Creating users now...");

    await userSQL({
      username: "Hanz",
      password: "Hanzy99",
    });

    await userSQL({
      username: "YorkStomper",
      password: "Yaaeerr24",
    });

    await userSQL({
      username: "Fonsi",
      password: "PizzaBoi92",
    });
  } catch (error) {
    console.log("Error creating users!");
    throw error;
  }
}

async function createInitialRoutines() {
  try {
    console.log("Creating routines...");

    await routinesSQL({
      id: "1",
      creatorId: "1",
      public: true,
      name: "Routine-1",
      goal: "Lose 10 pounds.",
    });

    await routinesSQL({
      id: "2",
      creatorId: "2",
      public: true,
      name: "Routine-2",
      goal: "Lose 20 Pounds",
    });

    await routinesSQL({
      id: "3",
      creatorId: "3",
      public: false,
      name: "Eat",
      goal: "Gain Weight by eating delicious Pizza",
    });

    await routinesSQL({
      id: "4",
      creatorId: "2",
      public: true,
      name: "Routine-4",
      goal: "Lose 50 Pounds",
    });
  } catch (error) {
    console.log("Error creating routines!");
    throw error;
  }
}

async function createInitialRoutineActivities() {
  try {
    console.log("Creating routine_activities...");

    await routineActivitiesSQL({
      id: "1",
      routineId: 1,
      activityId: 1,
      duration: 20,
      count: 1,
    });

    await routineActivitiesSQL({
      id: "2",
      routineId: 2,
      activityId: 1,
      duration: 50,
      count: 10,
    });

    await routineActivitiesSQL({
      id: "3",
      routineId: 4,
      activityId: 3,
      duration: 400,
      count: 5,
    });
  } catch (error) {
    throw error;
  }
}

async function createInitialActivities() {
  try {
    console.log("Starting activities...");

    await activitiesSQL({
      id: "1",
      name: "Jogging",
      description: "Get outside and move",
    });

    await activitiesSQL({
      id: "2",
      name: "Push-ups",
      description: "Get on the floor and do push-ups",
    });

    await activitiesSQL({
      id: "3",
      name: "Jump Rope",
      description: "Grab a jump rope and get ready!",
    });
  } catch (error) {
    console.error("Erro with activities!");
    throw error;
  }
}

async function rebuild() {
  try {
    client.connect();

    await dropTables();
    await tables();
    await createInitialUsers();
    await createInitialActivities();
    await createInitialRoutines();
    await createInitialRoutineActivities();
  } catch (error) {
    console.log("Error during rebuild stage!");
    throw error;
  }
}

rebuild()
  .then(test)
  .catch(console.error)
  .finally(() => client.end());
