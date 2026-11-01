import React, { useEffect } from 'react';
import { getTypeInfo, getEvolutionBackgrounds } from '../utils/typeColors';

export const PokemonModal = ({ poke, cerrar }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') cerrar();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cerrar]);

  if (!poke) return null;

  const imgPoke =
    poke.sprites?.other?.['official-artwork']?.front_default ||
    poke.sprites?.front_default;

  const num = `#${String(poke.id).padStart(3, '0')}`;
  const altura = (poke.height / 10).toFixed(1);
  const peso = (poke.weight / 10).toFixed(1);

  // Tipo principal y detección de legendario
  const tipoPrincipal = poke.types?.[0]?.type?.name || 'normal';
  const esLegendario = poke.esLegendario;

  let badgeEvo = poke.evoStatus;
  let nivelEvo = 'basico';

  if (esLegendario) {
    badgeEvo = 'LEGENDARIO';
    nivelEvo = 'legendario';
  } else if (badgeEvo === 'Evolucionado') {
    nivelEvo = 'final';
  } else if (badgeEvo === 'Fase media') {
    nivelEvo = 'intermedio';
  }

  // Fondos graduados según tipo principal o efecto tornasol si es legendario
  const { cardBg, imgWrapperBg, circleBg } = getEvolutionBackgrounds(
    tipoPrincipal,
    badgeEvo,
    esLegendario
  );

  const nombresStats = {
    hp: 'PS (HP)',
    attack: 'Ataque',
    defense: 'Defensa',
    'special-attack': 'Atq. Esp.',
    'special-defense': 'Def. Esp.',
    speed: 'Velocidad'
  };

  const statsPokemones = poke.stats || [];

  return (
    <div
      className="modal-overlay"
      onClick={cerrar}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`modal-content modal-${nivelEvo}`}
        style={{ background: cardBg }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="modal-id">{num}</span>
            {badgeEvo && (
              <span
                className={`badge-evolucion badge-${nivelEvo}`}
                style={{ position: 'static', transform: 'none' }}
              >
                {badgeEvo}
              </span>
            )}
          </div>
          <button
            className="modal-close-btn"
            onClick={cerrar}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div
          className="modal-img-container"
          style={{ background: imgWrapperBg }}
        >
          <div
            className={`card-bg-circle circle-${nivelEvo}`}
            style={{ background: circleBg, width: '180px', height: '180px' }}
          ></div>
          <img
            src={imgPoke}
            alt={poke.name}
            className={`modal-img img-${nivelEvo}`}
          />
        </div>

        <div className="modal-body">
          <div className="modal-title-row">
            <h2 className="modal-title">{poke.name}</h2>
            <div className="card-types">
              {poke.types?.map((item) => {
                const info = getTypeInfo(item.type.name);
                return (
                  <span
                    key={item.type.name}
                    className="type-badge"
                    style={{ backgroundColor: info.bg, color: info.text }}
                  >
                    {info.es}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="card-specs" style={{ marginBottom: '16px' }}>
            <div className="spec-item">
              <span className="spec-label">Altura</span>
              <span className="spec-value">{altura} m</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Peso</span>
              <span className="spec-value">{peso} kg</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Exp</span>
              <span className="spec-value">{poke.base_experience ?? 'N/A'} XP</span>
            </div>
          </div>

          <div className="modal-stats-section">
            <h3 className="modal-section-title">Estadísticas</h3>
            <div className="modal-stats-grid">
              {statsPokemones.map((s) => {
                const nombre = nombresStats[s.stat.name] || s.stat.name;
                const porcentaje = Math.min(100, (s.base_stat / 200) * 100);

                return (
                  <div key={s.stat.name} className="stat-row">
                    <span className="stat-name">{nombre}</span>
                    <span className="stat-num">{s.base_stat}</span>
                    <div className="stat-bar-bg">
                      <div
                        className="stat-bar-fill"
                        style={{ width: `${porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="modal-abilities">
            <h3 className="modal-section-title">Habilidades</h3>
            <div className="abilities-tags">
              {poke.abilities?.map((a) => (
                <span key={a.ability.name} className="ability-tag">
                  {a.ability.name.replace('-', ' ')}
                  {a.is_hidden && ' (Oculta)'}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
