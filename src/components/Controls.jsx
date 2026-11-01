import React from 'react';
import { TYPE_COLORS } from '../utils/typeColors';

export const Controls = ({
  busqueda,
  setBusqueda,
  tipoElegido,
  setTipoElegido,
  onBuscarGlobal
}) => {
  const listaTipos = ['all', ...Object.keys(TYPE_COLORS)];

  return (
    <section className="controls-card">
      <div className="search-box-wrapper">
        <svg
          className="search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Buscar Pokémon por nombre o número (ej: Pikachu, 150 Mewtwo)..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onBuscarGlobal) {
              onBuscarGlobal(busqueda);
            }
          }}
        />
      </div>

      <div className="type-filter-chips">
        <span className="chip-label">Filtrar por tipo:</span>
        {listaTipos.map((tipo) => {
          const seleccionado = tipoElegido === tipo;
          const label = tipo === 'all' ? 'Todos' : TYPE_COLORS[tipo]?.es || tipo;

          return (
            <button
              key={tipo}
              type="button"
              className={`type-chip ${seleccionado ? 'active' : ''}`}
              onClick={() => setTipoElegido(tipo)}
            >
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
};
