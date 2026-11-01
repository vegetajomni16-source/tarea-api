import React from 'react';

export const Loader = ({ message = 'Cargando Pokémon desde PokeAPI...' }) => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{message}</p>
    </div>
  );
};

export const SkeletonGrid = ({ count = 8 }) => {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-card"></div>
      ))}
    </div>
  );
};

