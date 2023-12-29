const chroma = require('chroma-js');

function transform(value, limit) {
  const [min, max] = Array.isArray(limit) ? limit :
    typeof limit === 'number' ? [0, limit] : [0, 1];
  return ((value / 255) * (max - min) + min) * 255;
}

// Función para generar colores aleatorios no repetidos
export default function randomColors(count, {
  format = 'hex',
  threshold = 20,
  bounds = 1,
  distribute = true
} = {}) {
  const uniqueColors = new Set();

  if (distribute) {
    const step = Math.floor(0xFFFFFF / count);
    for (let i = 0; i < count; i++) {
      const colorValue = i * step;
      const colorHex = '#' + colorValue.toString(16).padStart(6, '0');
      const color = chroma(colorHex);
      uniqueColors.add(color);
    }
  } else while (uniqueColors.size < count) {
    const prevColor = chroma.random(); // Generamos un color aleatorio

    // Comprobamos si es lo suficientemente diferente de los colores existentes
    let isUnique = true;
    for (const existingColor of uniqueColors) {
      if (chroma.distance(prevColor, existingColor) < threshold) {
        isUnique = false;
        break;
      }
    }

    if (isUnique) {
      uniqueColors.add(prevColor); // Lo agregamos al conjunto si es único
    }
  }

  const formattedColors = Array.from(uniqueColors).map(prevColor => {
    // Ajustamos los componentes del color según el valor máximo especificado
    const [rcolor, gcolor, bcolor] = prevColor.rgb();

    const adjustedColor = typeof bounds === 'number' || Array.isArray(bounds)
      ? prevColor.rgb().map(c => transform(c, bounds))
      : [
        transform(rcolor, bounds.r),
        transform(gcolor, bounds.g),
        transform(bcolor, bounds.b)
      ];
    return chroma(...adjustedColor);
  })
    .sort((color1, color2) => {
      const [r1, g1, b1] = color1.rgb();
      const [r2, g2, b2] = color2.rgb();

      const c1Max = Math.max(r1, g1, b1);
      const c2Max = Math.max(r2, g2, b2);

      return c2Max - c1Max;
    });

  // Convertir los colores al formato especificado
  return formattedColors.map((color) => {
    if (format === 'hex') {
      return color.hex();
    } else if (format === 'rgb') {
      return color.rgb();
    } else if (format === 'nrgb')
      return color.rgb().map(c => c / 255);
  });
}
