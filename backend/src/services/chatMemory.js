const conversations = {};

function getConversation(userId) {
  if (!conversations[userId]) {
    conversations[userId] = [];
  }
  return conversations[userId];
}

function addMessage(userId, role, content) {
  const convo = getConversation(userId);
  convo.push({ role, content });

  // Limitar memoria a últimos 20 mensajes
  if (convo.length > 20) {
    conversations[userId] = convo.slice(-20);
  }
}

module.exports = {
  getConversation,
  addMessage
};