/**
 * Returns a promise that resolves after a specified number of milliseconds.
 *
 * @param {number} ms - The number of milliseconds to sleep.
 * @returns {Promise<void>} A promise that resolves after the specified delay.
 */
export const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
