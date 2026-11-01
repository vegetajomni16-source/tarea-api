import React from 'react';

export const Header = () => {
  return (
    <header className="app-header">
      <h1 className="app-title">
        Pokédex{' '}
        <span className="title-purple">
          todas las regiones
          <svg
            className="title-pokedex-icon"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Cuerpo de la Pokédex en morado */}
            <path
              d="M5 4C3.89543 4 3 4.89543 3 6V26C3 27.1046 3.89543 28 5 28H27C28.1046 28 29 27.1046 29 26V11.5L21.5 4H5Z"
              fill="#581c87"
            />
            {/* Borde / corte superior */}
            <path
              d="M3 11.5H16.5L22 5H28.5"
              stroke="#3b0764"
              strokeWidth="1.5"
            />
            {/* Lente principal */}
            <circle cx="8.5" cy="7.8" r="3.2" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.2" />
            <circle cx="7.5" cy="6.8" r="1" fill="#ffffff" />
            {/* LEDs indicadores */}
            <circle cx="14" cy="7.8" r="1.1" fill="#ef4444" />
            <circle cx="17" cy="7.8" r="1.1" fill="#eab308" />
            <circle cx="20" cy="7.8" r="1.1" fill="#22c55e" />
            {/* Pantalla interior */}
            <rect
              x="6"
              y="14"
              width="20"
              height="11"
              rx="2"
              fill="#f3e8ff"
              stroke="#3b0764"
              strokeWidth="1.2"
            />
            <rect x="8" y="16" width="16" height="5" rx="1" fill="#c084fc" opacity="0.5" />
            <circle cx="9.5" cy="23" r="1" fill="#ef4444" />
            <line x1="13" y1="23" x2="23" y2="23" stroke="#7e22ce" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </h1>
      <p className="app-subtitle">
        Lista de Pokémon traídos desde la PokéAPI.
      </p>
    </header>
  );
};
