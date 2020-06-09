const { client } = require("./client");

async function getAllRoutine_Activities() {
  try {
    const { rows: routine_activities } = await client.query(
      `SELECT * FROM routine_activities`
    );

    return routine_activities;
  } catch (error) {
    throw error;
  }
}

async function routineActivitiesSQL({
  id,
  routineId,
  activityId,
  duration,
  count,
}) {
  try {
    await client.query(
      `
        INSERT INTO routine_activities(id, "routineId", "activityId", duration, count)
        VALUES($1, $2, $3, $4, $5)
        RETURNING *;
        `,
      [id, routineId, activityId, duration, count]
    );
  } catch (error) {
    throw error;
  }
}

async function updateRoutine_Activities(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}=$${index + 1}`)
    .join(", ");
  if (setString.length === 0) {
    return;
  }

  try {
    const { rows } = await client.query(
      `
      UPDATE routine_activities
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

async function deleteRoutineActivity(id) {
  try {
    await client.query(
      `
            DELETE FROM routine_activities
            WHERE id = ${id}
            `
    );
  } catch (error) {
    throw error;
  }
}

module.exports = {
  routineActivitiesSQL,
  getAllRoutine_Activities,
  updateRoutine_Activities,
  deleteRoutineActivity,
};
