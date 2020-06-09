const { client } = require("./client");

async function getAllActivities() {
  try {
    const { rows: activities } = await client.query(
      `SELECT * FROM activities;`
    );

    return activities;
  } catch (error) {
    throw error;
  }
}

async function activitiesSQL({ id, name, description }) {
  try {
    await client.query(
      `
        INSERT INTO activities(id, name, description)
        VALUES ($1, $2, $3)
        RETURNING *;
        `,
      [id, name, description]
    );
  } catch (error) {
    throw error;
  }
}

async function updateActivities(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }

  try {
    const { rows } = await client.query(
      `
      UPDATE activities
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
      `,
      Object.values(fields)
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  activitiesSQL,
  updateActivities,
  getAllActivities,
};
