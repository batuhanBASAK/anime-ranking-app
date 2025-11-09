const Log = require("../models/Log");

async function saveLog(header, content) {
  try {
    const newLog = new Log({ header, content });
    await newLog.save();
  } catch (err) {
    console.error(err.message);
  }
}

/**
 * Fetch logs sorted by creation date (newest → oldest)
 * and return logs between startIndex and endIndex (inclusive).
 *
 * @param {number} startIndex - Starting index (0-based)
 * @param {number} endIndex - Ending index (exclusive)
 * @returns {Promise<Array>} - Array of log documents
 */
async function getLogsInRange(startIndex, endIndex) {
  if (startIndex < 0 || endIndex <= startIndex) {
    throw new Error(
      "Invalid range: endIndex must be greater than startIndex and both must be non-negative."
    );
  }

  const limit = endIndex - startIndex;

  const logs = await Log.find({})
    .sort({ createdAt: -1 }) // newest → oldest
    .skip(startIndex)
    .limit(limit)
    .exec();

  return logs;
}

module.exports = {
  saveLog,
  getLogsInRange,
};
