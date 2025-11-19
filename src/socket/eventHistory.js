const MAX_EVENTS = 500;
const eventHistory = [];

function pushEvent(type, payload) {
  eventHistory.push({ type, payload, timestamp: Date.now() });
  if (eventHistory.length > MAX_EVENTS) eventHistory.shift();
}

function getEventsSince(timestamp) {
  return eventHistory.filter(e => e.timestamp > timestamp);
}

module.exports = { pushEvent, getEventsSince };
