import numeral from 'numeral';

/**
 * Custom format function to append appropriate suffix for scaling numbers
 * @param {number} num - The number to format.
 * @returns {string} - The formatted number as a string.
 */
export const scaleFormat = (num) => numeral(num).format('0.00a');
