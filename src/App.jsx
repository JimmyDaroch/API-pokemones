// src/App.jsx
import React, { useEffect, useRef, useState } from 'react'; // Importa los hooks necesarios
import PokemonFetcher from './PokemonFetcher';
import './App.css';

function App() {
  // 1. Crear una referencia para el elemento de audio HTML
  const audioRef = useRef(null); 
  // 2. Estado para controlar si la música está reproduciéndose con sonido
  const [isPlaying, setIsPlaying] = useState(false); 

  // 3. useEffect para manejar la reproducción inicial y los eventos del audio
  useEffect(() => {
    const audio = audioRef.current; // Accede al elemento <audio> del DOM
    if (audio) {
      // Intenta reproducir el audio. Inicialmente estará silenciado debido al 'muted' en index.html.
      audio.play().catch(error => {
        console.log("Autoplay bloqueado. Se necesita interacción del usuario para reproducir el sonido.", error);
      });

      // Añadir escuchadores para actualizar el estado 'isPlaying'
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);

      // Función de limpieza: Se ejecuta cuando el componente se desmonta
      return () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
      };
    }
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez al montar el componente

  // 4. Función para alternar la reproducción/pausa y el silencio/sonido
  const toggleMusic = () => {
    const audio = audioRef.current;
    if (audio) {
      if (audio.paused) {
        audio.muted = false; // Desactiva el silencio
        audio.play().then(() => {
          setIsPlaying(true); // Actualiza el estado a 'reproduciendo'
        }).catch(error => {
          console.error("Error al intentar reproducir el audio:", error);
        });
      } else {
        audio.pause(); // Pausa la música
        audio.muted = true; // (Opcional) Vuelve a silenciar al pausar
        setIsPlaying(false); // Actualiza el estado a 'pausado'
      }
    }
  };

  return (
    <div className="app-container"> {/* Envuelve todo en un div para el contenedor */}
      <h2>¡Conoce a tus Pokémon!</h2>
      <PokemonFetcher />

      {/* 5. Vincula la referencia de React con el elemento <audio> en el DOM */}
      {/* El 'src' debe apuntar a la ubicación de tu archivo de música en la carpeta 'public' */}
      <audio ref={audioRef} src="/assets/music/pokemon-theme.mp3" loop muted></audio>

      {/* 6. Botón de control para la música */}
      <button 
        style={{ 
          position: 'fixed', 
          bottom: '20px', 
          right: '20px', 
          zIndex: 1000, 
          padding: '10px 20px',
          backgroundColor: '#333',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }} 
        onClick={toggleMusic} // Llama a la función toggleMusic al hacer clic
      >
        {isPlaying ? 'Pausar Música ⏸' : 'Reproducir Música ▶️'}
      </button>
    </div>
  );
}

export default App;