const { client } = require("./client");

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`SELECT * FROM routines`);

    return await Promise.all(routines.map((all) => getRoutineById(all.id)));
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutines() {
  try {
    const { rows: public } = await client.query(`
    SELECT * FROM routines WHERE public = true;
    `);

    return await Promise.all(public.map((public) => getRoutineById(public.id)));
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getAllRoutinesByuser() {
  try {
    const { rows: allRoutinesByUser } = await client.query(
      `SELECT name FROM routines WHERE ;`
    );

    return allRoutinesByUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(`SELECT * FROM routines WHERE id=${id};`);
    const { rows: activities } = await client.query(
      `SELECT activities.* FROM activities JOIN routine_activities ON "routineId" = ${routine.id} AND "activityId" = activities.id;`
    );

    routine.activities = activities;
    return routine;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getPublicRoutinesByUser() {
  try {
    const { rows: publicRoutines } = await client.query(`
    SELECT 
    `);
  } catch (error) {
    throw error;
  }
}

async function routinesSQL({ id, creatorId, public, name, goal }) {
  try {
    const {
      rows: [routines],
    } = await client.query(
      `
        INSERT INTO routines(id, "creatorId", public, name, goal)
        VALUES($1, $2, $3, $4, $5)
        RETURNING *;
        `,
      [id, creatorId, public, name, goal]
    );

    return routines;
  } catch (error) {
    throw error;
  }
}

async function updateRoutines(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }

  try {
    const { rows } = await client.query(
      `
      UPDATE routines
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
      `,
      Object.values(fields)
    );

    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  routinesSQL,
  getAllRoutines,
  getPublicRoutines,
  updateRoutines,
};
