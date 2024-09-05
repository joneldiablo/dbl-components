import chroma from 'chroma-js';

/**
 * Generates an array of distinct, random, and smooth light colors within a specific hue range.
 * @param {number} count - Number of colors to generate.
 * @param {number} hueStart - Starting hue value.
 * @param {number} hueEnd - Ending hue value.
 * @param {number} lightness - Lightness level (0.0 to 1.0).
 * @returns {string[]} - Array of hex color strings.
 */
const generateColors = (count, hueStart, hueEnd, lightness = 0.71) => {
  const colors = [];
  while (colors.length < count) {
    const color = chroma.hsl(
      hueStart + Math.random() * (hueEnd - hueStart), // Hue range
      0.6 + Math.random() * 0.4, // Saturation: 0.6-1.0 (more intense)
      lightness  // Lightness controlled by parameter
    ).hex();
    colors.push(color);
  }
  return colors;
}

/**
 * Generates an array of distinct, random, and smooth light colors with specified dominant hues.
 * @param {number} count - Number of colors to generate.
 * @returns {string[]} - Array of hex color strings.
 */
const randomColors = (count) => {
  const hues = [
    { name: 'red', start: 0, end: 30 },
    { name: 'yellow', start: 45, end: 75 },
    { name: 'green', start: 90, end: 150 },
    { name: 'blue', start: 210, end: 270 },
    { name: 'violet', start: 270, end: 330 },
    { name: 'orange', start: 30, end: 45 }
  ];

  const colorMap = {};

  hues.forEach(hue => {
    colorMap[hue.name] = generateColors(count, hue.start, hue.end);
  });

  const colorOrder = hues.map(hue => hue.name).sort(() => 0.5 - Math.random());
  const finalColors = [];

  while (finalColors.length < count) {
    for (const color of colorOrder) {
      if (colorMap[color].length > 0) {
        const randomIndex = Math.floor(Math.random() * colorMap[color].length);
        finalColors.push(colorMap[color].splice(randomIndex, 1)[0]);
      }
      if (finalColors.length >= count) break;
    }
  }

  return finalColors;
}

export default randomColors;

