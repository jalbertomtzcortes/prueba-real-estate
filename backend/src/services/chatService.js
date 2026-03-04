const pool = require("../config/database");

async function saveMessage(userId, role, content) {
  await pool.query(
    "INSERT INTO chat_messages (user_id, role, content) VALUES ($1, $2, $3)",
    [userId, role, content]
  );
}

async function getLastMessages(userId, limit = 20) {
  const result = await pool.query(
    `SELECT role, content 
     FROM chat_messages 
     WHERE user_id = $1 
     ORDER BY created_at DESC 
     LIMIT $2`,
    [userId, limit]
  );

  // invertir orden para que quede cronológico
  return result.rows.reverse();
}

module.exports = {
  saveMessage,
  getLastMessages
};