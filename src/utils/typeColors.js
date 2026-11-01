// Mapeo de colores y nombres en español para los tipos de Pokémon
export const TYPE_COLORS = {
  normal: { bg: '#A8A77A', text: '#FFFFFF', es: 'Normal' },
  fire: { bg: '#EE8130', text: '#FFFFFF', es: 'Fuego' },
  water: { bg: '#6390F0', text: '#FFFFFF', es: 'Agua' },
  electric: { bg: '#F7D02C', text: '#1E293B', es: 'Eléctrico' },
  grass: { bg: '#7AC74C', text: '#FFFFFF', es: 'Planta' },
  ice: { bg: '#96D9D6', text: '#1E293B', es: 'Hielo' },
  fighting: { bg: '#C22E28', text: '#FFFFFF', es: 'Lucha' },
  poison: { bg: '#A33EA1', text: '#FFFFFF', es: 'Veneno' },
  ground: { bg: '#E2BF65', text: '#1E293B', es: 'Tierra' },
  flying: { bg: '#A98FF3', text: '#FFFFFF', es: 'Volador' },
  psychic: { bg: '#F95587', text: '#FFFFFF', es: 'Psíquico' },
  bug: { bg: '#A6B91A', text: '#FFFFFF', es: 'Bicho' },
  rock: { bg: '#B6A136', text: '#FFFFFF', es: 'Roca' },
  ghost: { bg: '#70559B', text: '#FFFFFF', es: 'Fantasma' },
  dragon: { bg: '#6F35FC', text: '#FFFFFF', es: 'Dragón' },
  dark: { bg: '#705746', text: '#FFFFFF', es: 'Siniestro' },
  steel: { bg: '#B7B7CE', text: '#1E293B', es: 'Acero' },
  fairy: { bg: '#D685AD', text: '#FFFFFF', es: 'Hada' }
};

export const getTypeInfo = (typeName) => {
  return TYPE_COLORS[typeName?.toLowerCase()] || { bg: '#777777', text: '#FFFFFF', es: typeName };
};

// Convierte un color HEX (#RRGGBB) a formato RGBA con opacidad
export const hexToRgba = (hex, alpha) => {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map((x) => x + x).join('');
  }
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Genera los fondos según el tipo principal, etapa evolutiva o si es Legendario
export const getEvolutionBackgrounds = (tipoPrincipal, evoStatus, esLegendario) => {
  // 1. Caso especial: Pokémon LEGENDARIO o MÍTICO => Fondo tornasol / iridiscente
  if (esLegendario) {
    return {
      cardBg:
        'linear-gradient(135deg, rgba(254, 205, 222, 0.82) 0%, rgba(224, 231, 255, 0.82) 25%, rgba(254, 243, 199, 0.85) 50%, rgba(207, 250, 254, 0.82) 75%, rgba(243, 232, 255, 0.85) 100%)',
      imgWrapperBg:
        'radial-gradient(circle at 50% 35%, rgba(255, 255, 255, 0.95) 0%, rgba(216, 180, 254, 0.65) 35%, rgba(125, 211, 252, 0.6) 70%, rgba(253, 230, 138, 0.65) 100%)',
      circleBg: 'rgba(255, 255, 255, 0.85)'
    };
  }

  const info = getTypeInfo(tipoPrincipal);
  const base = info.bg;

  if (evoStatus === 'Evolucionado') {
    // Fase desarrollada / final: color establecido y potente
    return {
      cardBg: `linear-gradient(180deg, ${hexToRgba(base, 0.40)} 0%, ${hexToRgba(base, 0.16)} 55%, #ffffff 100%)`,
      imgWrapperBg: `radial-gradient(circle at 50% 38%, #ffffff 15%, ${hexToRgba(base, 0.52)} 100%)`,
      circleBg: hexToRgba(base, 0.35)
    };
  }

  if (evoStatus === 'Fase media') {
    // Fase media: color un poco más fuerte
    return {
      cardBg: `linear-gradient(180deg, ${hexToRgba(base, 0.24)} 0%, ${hexToRgba(base, 0.08)} 60%, #ffffff 100%)`,
      imgWrapperBg: `radial-gradient(circle at 50% 45%, #ffffff 20%, ${hexToRgba(base, 0.32)} 100%)`,
      circleBg: hexToRgba(base, 0.22)
    };
  }

  // Primera fase / básica: color muy muy leve y delicado
  return {
    cardBg: `linear-gradient(180deg, ${hexToRgba(base, 0.12)} 0%, #ffffff 75%)`,
    imgWrapperBg: `radial-gradient(circle at 50% 50%, #ffffff 30%, ${hexToRgba(base, 0.18)} 100%)`,
    circleBg: hexToRgba(base, 0.14)
  };
};
