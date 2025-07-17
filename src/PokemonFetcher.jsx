import React, { useState } from 'react';
import './PokemonFetcher.css';

const PokemonFetcher = () => {
  const [pokemones, setPokemones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [nombreBusqueda, setNombreBusqueda] = useState(''); // <-- input nombre

  // Buscar 16 Pokémon aleatorios
  const fetchPokemones = async () => {
    try {
      setCargando(true);
      setError(null);
      setPokemones([]);

      const fetchedPokemones = [];
      const pokemonIds = new Set();

      while (pokemonIds.size < 16) {
        const randomId = Math.floor(Math.random() * 898) + 1;
        pokemonIds.add(randomId);
      }

      for (const id of Array.from(pokemonIds)) {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!res.ok) throw new Error(`Error al cargar el Pokémon con ID ${id}`);
        const data = await res.json();
        fetchedPokemones.push({
          id: data.id,
          nombre: data.name,
          imagen: data.sprites.front_default,
          tipos: data.types.map(t => t.type.name),
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

  // Buscar por nombre
  const buscarPorNombre = async () => {
    if (!nombreBusqueda) return;
    try {
      setCargando(true);
      setError(null);
      setPokemones([]);

      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombreBusqueda.toLowerCase()}`);
      if (!res.ok) throw new Error(`No se encontró el Pokémon "${nombreBusqueda}"`);
      const data = await res.json();

      setPokemones([{
        id: data.id,
        nombre: data.name,
        imagen: data.sprites.front_default,
        tipos: data.types.map(t => t.type.name),
        nivel: Math.floor(Math.random() * 100) + 1,
      }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const pokemonesFiltrados = tipoFiltro
    ? pokemones.filter(p => p.tipos.includes(tipoFiltro))
    : pokemones;

  return (
    <div className="pokemon-container">
      <h2>Randomizer Legendary Equip</h2>

      <div className="busqueda-container">
        <input
          type="text"
          placeholder="Buscar por nombre (ej: pikachu)"
          value={nombreBusqueda}
          onChange={e => setNombreBusqueda(e.target.value)}
        />
        <button onClick={buscarPorNombre}>Buscar Pokémon</button>
        <button onClick={fetchPokemones}>Randomizar 16 Pokémon</button>
      </div>

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

      {cargando && <div className="loading">Cargando Pokémon...</div>}
      {error && <div className="error">Error: {error}</div>}

      <div className="pokemon-list">
        {pokemonesFiltrados.map(pokemon => (
          <div key={pokemon.id} className="pokemon-card">
            <img src={pokemon.imagen} alt={pokemon.nombre} className="pokemon-img" />
            <div className="pokemon-card-content">
              <h3>{pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1)}</h3>
              <p><strong>Tipo:</strong> {pokemon.tipos.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')}</p>
              <p><strong>Nivel:</strong> {pokemon.nivel}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonFetcher;
