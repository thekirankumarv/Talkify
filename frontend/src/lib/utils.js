/**
 * Formats message timestamp into 24-hour time string
 * @param {Date|string} date - Raw date from message data
 * @returns {string} Formatted time string (HH:MM)
 */
export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",   // 2-digit hour (01-23)
    minute: "2-digit", // 2-digit minute (00-59)
    hour12: false,     // Use 24-hour format
  });
}