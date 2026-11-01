import React from 'react';
import { getTypeInfo, getEvolutionBackgrounds } from '../utils/typeColors';

export const PokemonCard = ({ poke, abrirModal }) => {
  const foto =
    poke.sprites?.other?.['official-artwork']?.front_default ||
    poke.sprites?.front_default ||
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';

  const num = `#${String(poke.id).padStart(3, '0')}`;
  const altu = (poke.height / 10).toFixed(1);
  const pesito = (poke.weight / 10).toFixed(1);

  // Tipo principal del Pokémon (ej: fire, water, grass, poison, etc.)
  const tipoPrincipal = poke.types?.[0]?.type?.name || 'normal';

  // Si es Legendario o Mítico, tiene etiqueta y fondo tornasol especial
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

  // Fondos dinámicos según el tipo principal, etapa evolutiva o si es Legendario
  const { cardBg, imgWrapperBg, circleBg } = getEvolutionBackgrounds(
    tipoPrincipal,
    badgeEvo,
    esLegendario
  );

  // Rompimiento de simetría con patrones orgánicos alternantes según el ID
  const varianteAsimetrica = `asym-${poke.id % 3}`;

  return (
    <article
      className={`pokemon-card card-${nivelEvo} ${varianteAsimetrica}`}
      style={{ background: cardBg }}
      onClick={() => abrirModal(poke)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          abrirModal(poke);
        }
      }}
    >
      {badgeEvo && (
        <span className={`badge-evolucion badge-${nivelEvo}`}>
          {badgeEvo}
        </span>
      )}

      <div
        className={`card-image-wrapper img-wrapper-${nivelEvo}`}
        style={{ background: imgWrapperBg }}
      >
        <span className="card-id">{num}</span>
        <div
          className={`card-bg-circle circle-${nivelEvo}`}
          style={{ background: circleBg }}
        ></div>
        <img
          src={foto}
          alt={poke.name}
          className={`card-pokemon-img img-${nivelEvo}`}
          loading="lazy"
        />
      </div>

      <div className="card-body">
        <h2 className="card-title">{poke.name}</h2>

        <div className="card-types">
          {poke.types?.map((item) => {
            const dataTipo = getTypeInfo(item.type.name);
            return (
              <span
                key={item.type.name}
                className="type-badge"
                style={{
                  backgroundColor: dataTipo.bg,
                  color: dataTipo.text
                }}
              >
                {dataTipo.es}
              </span>
            );
          })}
        </div>

        <div className="card-specs">
          <div className="spec-item">
            <span className="spec-label">Altura</span>
            <span className="spec-value">{altu} m</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Peso</span>
            <span className="spec-value">{pesito} kg</span>
          </div>
        </div>

        <div className="card-action-hint">Ver más info &rarr;</div>
      </div>
    </article>
  );
};
