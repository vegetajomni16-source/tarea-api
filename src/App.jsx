import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { PokemonCard } from './components/PokemonCard';
import { PokemonModal } from './components/PokemonModal';
import { Loader, SkeletonGrid } from './components/Loader';

const PAGE_SIZE = 24;

// Cache en memoria para no repetir llamadas a las cadenas de evolución
const cacheEvoluciones = {};

// Calcula directamente desde la cadena de evolución de PokéAPI
// si un Pokémon es 'Fase media', 'Evolucionado' (total) o básico (null)
function calcularEvolucion(nombreEspecie, chain) {
  function buscar(nodo, profundidad) {
    if (nodo.species.name === nombreEspecie) {
      const tieneEvolucion = nodo.evolves_to && nodo.evolves_to.length > 0;
      const vieneDeEvolucion = profundidad > 0;

      // Si viene de una evolución y aún evoluciona más => Fase media (ej: Ivysaur)
      if (vieneDeEvolucion && tieneEvolucion) {
        return 'Fase media';
      }
      // Si viene de una evolución y ya no evoluciona más => Evolucionado total (ej: Arbok, Venusaur)
      if (vieneDeEvolucion && !tieneEvolucion) {
        return 'Evolucionado';
      }
      // Básico o especie sin evolución => null
      return null;
    }

    for (const hijo of nodo.evolves_to) {
      const res = buscar(hijo, profundidad + 1);
      if (res !== undefined) return res;
    }
    return undefined;
  }

  return buscar(chain, 0) || null;
}

export default function App() {
  const [listaPokemones, setListaPokemones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoMas, setCargandoMas] = useState(false);
  const [error, setError] = useState(null);
  const [posicion, setPosicion] = useState(0);

  const [busqueda, setBusqueda] = useState('');
  const [tipoElegido, setTipoElegido] = useState('all');
  const [pokeSeleccionado, setPokeSeleccionado] = useState(null);

  // Función auxiliar para traer detalles, etapa evolutiva y si es legendario
  const procesarPokemones = async (results) => {
    const promesas = results.map(async (item) => {
      const resDetalle = await fetch(item.url);
      if (!resDetalle.ok) {
        throw new Error('error al traer bicho');
      }
      const pokeData = await resDetalle.json();

      let evoStatus = null;
      let esLegendario = false;
      try {
        if (pokeData.species?.url) {
          const resEspecie = await fetch(pokeData.species.url);
          const dataEspecie = await resEspecie.json();

          // Detección oficial de Pokémon Legendario o Mítico
          esLegendario = Boolean(dataEspecie.is_legendary || dataEspecie.is_mythical);

          const urlChain = dataEspecie.evolution_chain?.url;

          if (urlChain) {
            if (!cacheEvoluciones[urlChain]) {
              const resChain = await fetch(urlChain);
              cacheEvoluciones[urlChain] = await resChain.json();
            }
            evoStatus = calcularEvolucion(
              dataEspecie.name,
              cacheEvoluciones[urlChain].chain
            );
          }
        }
      } catch (e) {
        // En caso de cualquier detalle de red opcional, continua con los datos del bicho
      }

      return {
        ...pokeData,
        evoStatus,
        esLegendario
      };
    });

    return await Promise.all(promesas);
  };

  useEffect(() => {
    const getCartas = async () => {
      try {
        setCargando(true);
        setError(null);

        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=0`
        );

        if (!res.ok) {
          throw new Error('error en la llamada');
        }

        const data = await res.json();
        const datosListos = await procesarPokemones(data.results);

        setListaPokemones(datosListos);
        setPosicion(PAGE_SIZE);
      } catch (err) {
        console.error('se cayo la pag xddd', err);
        setError('se cayo la pag xddd');
      } finally {
        setCargando(false);
      }
    };

    getCartas();
  }, []);

  const cargarMas = async () => {
    try {
      setCargandoMas(true);

      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${posicion}`
      );
      if (!res.ok) throw new Error('fallo al pedir mas');

      const data = await res.json();
      const nuevos = await procesarPokemones(data.results);

      setListaPokemones((prev) => [...prev, ...nuevos]);
      setPosicion((p) => p + PAGE_SIZE);
    } catch (err) {
      console.error('se cayo la pag xddd', err);
      alert('se cayo la pag xddd');
    } finally {
      setCargandoMas(false);
    }
  };

  // Buscar un Pokémon específico directamente en la PokéAPI si aún no está en la lista cargada
  const buscarGlobal = async (termino) => {
    const query = termino.toLowerCase().trim();
    if (!query) return;

    try {
      setCargando(true);
      setError(null);

      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
      if (!res.ok) {
        throw new Error(`No se encontró "${query}"`);
      }

      const data = await res.json();
      const [pokemonEncontrado] = await procesarPokemones([
        { url: `https://pokeapi.co/api/v2/pokemon/${data.id}` }
      ]);

      if (pokemonEncontrado) {
        setListaPokemones((prev) => {
          if (prev.some((p) => p.id === pokemonEncontrado.id)) return prev;
          return [pokemonEncontrado, ...prev];
        });
      }
    } catch (err) {
      alert(`No se encontró ningún Pokémon con el nombre o ID "${query}" en PokéAPI.`);
    } finally {
      setCargando(false);
    }
  };

  const pokemonesFiltrados = listaPokemones.filter((poke) => {
    const texto = busqueda.toLowerCase().trim();
    const coincide =
      poke.name.toLowerCase().includes(texto) ||
      String(poke.id).includes(texto);

    const tipoOk =
      tipoElegido === 'all' ||
      poke.types.some((t) => t.type.name === tipoElegido);

    return coincide && tipoOk;
  });

  return (
    <div className="app-container">
      <Header />

      <Controls
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        tipoElegido={tipoElegido}
        setTipoElegido={setTipoElegido}
        onBuscarGlobal={buscarGlobal}
      />

      {error && (
        <div className="error-box">
          <h3>se cayo la pag xddd</h3>
          <p>{error}</p>
          <button
            className="btn-primary"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      )}

      {cargando && (
        <>
          <Loader message="Cargando Pokémon desde PokéAPI..." />
          <SkeletonGrid count={8} />
        </>
      )}

      {!cargando && !error && (
        <>
          <div className="results-summary">
            <span>
              Mostrando <strong>{pokemonesFiltrados.length}</strong> de{' '}
              <strong>{listaPokemones.length}</strong> Pokémon
            </span>
            {tipoElegido !== 'all' && (
              <span>Filtro: <em>{tipoElegido}</em></span>
            )}
          </div>

          {pokemonesFiltrados.length === 0 ? (
            <div className="empty-box">
              <div className="empty-box-icon">🔍</div>
              <h3>No se encontró en los {listaPokemones.length} Pokémon cargados</h3>
              <p>¿Quieres buscar "{busqueda}" en toda la base de datos de PokéAPI?</p>
              <button
                className="btn-primary"
                style={{ marginTop: '14px' }}
                onClick={() => buscarGlobal(busqueda)}
              >
                Buscar "{busqueda}" en PokéAPI
              </button>
            </div>
          ) : (
            <main className="pokemon-grid">
              {pokemonesFiltrados.map((poke) => (
                <PokemonCard
                  key={poke.id}
                  poke={poke}
                  abrirModal={setPokeSeleccionado}
                />
              ))}
            </main>
          )}

          {busqueda === '' && tipoElegido === 'all' && (
            <div className="load-more-section">
              <button
                className="btn-primary"
                onClick={cargarMas}
                disabled={cargandoMas}
              >
                {cargandoMas ? 'Cargando más...' : 'Cargar más Pokémon (+24)'}
              </button>
            </div>
          )}
        </>
      )}

      {pokeSeleccionado && (
        <PokemonModal
          poke={pokeSeleccionado}
          cerrar={() => setPokeSeleccionado(null)}
        />
      )}

      <footer className="app-footer">
        <p>Jomni Ruiz. Ing. Civil Informática.</p>
        <p>
          Datos de{' '}
          <a
            href="https://pokeapi.co/"
            target="_blank"
            rel="noopener noreferrer"
          >
            PokéAPI v2
          </a>
        </p>
      </footer>
    </div>
  );
}
