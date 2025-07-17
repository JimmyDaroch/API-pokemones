import React, { useState, useEffect } from 'react';
import './PokemonFetcher.css';

const PokemonFetcher = () => {
  const [pokemones, setPokemones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [tipoFiltro, setTipoFiltro] = useState('');

  useEffect(() => {
    const fetchPokemones = async () => {
      try {
        setCargando(true);
        setError(null);
        const fetchedPokemones = [];
        const pokemonIds = new Set();

        while (pokemonIds.size < 16) {
          const randomId = Math.floor(Math.random() * 898) + 1;
          pokemonIds.add(randomId);
        }

        const idsArray = Array.from(pokemonIds);

        for (const id of idsArray) {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
          if (!response.ok) {
            throw new Error(`Error al cargar el Pokémon con ID ${id}: ${response.statusText}`);
          }
          const data = await response.json();
          fetchedPokemones.push({
            id: data.id,
            nombre: data.name,
            imagen: data.sprites.front_default,
            tipos: data.types.map(typeInfo => typeInfo.type.name),
            nivel: Math.floor(Math.random() * 100) + 1,
          });
        }

        setPokemones(fetchedPokemones);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    fetchPokemones();
  }, []);

  const pokemonesFiltrados = tipoFiltro
    ? pokemones.filter(pokemon => pokemon.tipos.includes(tipoFiltro))
    : pokemones;

  if (cargando) {
    return <div className="pokemon-container">Cargando Pokémon...</div>;
  }

  if (error) {
    return <div className="pokemon-container error">Error: {error}</div>;
  }

  return (
    <div className="pokemon-container">
      <h2>Randomizer Legendary Equip</h2>
      <div className="filtro-container">
        <label htmlFor="tipo-select">Filtrar por tipo: </label>
        <select
          id="tipo-select"
          value={tipoFiltro}
          onChange={e => setTipoFiltro(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="fire">Fuego</option>
          <option value="water">Agua</option>
          <option value="grass">Planta</option>
          <option value="electric">Eléctrico</option>
          <option value="rock">Roca</option>
          <option value="ground">Tierra</option>
          <option value="poison">Veneno</option>
          <option value="flying">Volador</option>
          <option value="psychic">Psíquico</option>
          <option value="dragon">Dragón</option>
          <option value="ghost">Fantasma</option>
          <option value="bug">Bicho</option>
          <option value="dark">Siniestro</option>
          <option value="steel">Acero</option>
          <option value="ice">Hielo</option>
          <option value="fighting">Lucha</option>
          <option value="fairy">Hada</option>
          <option value="normal">Normal</option>
        </select>
      </div>

      <button className="random-button" onClick={() => window.location.reload()}>
        Randomizar Nuevamente
      </button>

      <div className="pokemon-list">
        {pokemonesFiltrados.map(pokemon => (
          <div key={pokemon.id} className="pokemon-card">
            <img src={pokemon.imagen} alt={pokemon.nombre} className="pokemon-img" />
            <div className="pokemon-card-content">
              <h3>{pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1)}</h3>
              <p><strong>Tipo:</strong> {pokemon.tipos.map(type => type.charAt(0).toUpperCase() + type.slice(1)).join(', ')}</p>
              <p><strong>Nivel:</strong> {pokemon.nivel}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonFetcher;