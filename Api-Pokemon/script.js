async function BuscarPokemon() {
    // Obtiene el texto que se escribiste en la caja
    const input = document.getElementById('pokemon-input').value.toLowerCase();
    if (!input) return; // Si no se escribe nada, no hace nada

    try {
        // Hace la peticion a la API de Pokemon
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
        if (!response.ok) {
            Swal.fire({
                title: "Good job!",
                text: "You clicked the button!",
                icon: "success"
            });
        }
        // Convierte la respuesta en datos 
        const data = await response.json();
        // Muestra el Pokemon en la pantalla
        displayPokemon(data);
    } catch (error) {
        // Si hay un error (como Pokemon no existe), muestra un mensaje de error
        Swal.fire({
            title: "Error",
            text: "Pokemon no encontrado!",
            icon: "error"
        });
        console.error("Error:", error);
    }
}

function displayPokemon(pokemon) {
    // Muestra el contenedor donde va la informacion
    const container = document.querySelector('.pokemon-container');
    container.style.display = 'block';

    // Muestra el nombre y nemero del Pokemon (ej: "#025 Pikachu")
    document.getElementById('pokemon-nombre').textContent =
        `#${pokemon.id} ${capitalizeFirstLetter(pokemon.name)}`;

    // Muestra la imagen oficial del Pokemon (o una alternativa si no tiene)
    const imgElement = document.getElementById('pokemon-image');
    imgElement.src = pokemon.sprites.other['official-artwork'].front_default ||
        pokemon.sprites.front_default;
    imgElement.alt = pokemon.name;

    // Muestra los tipos del Pokemon (ej: "Electrico") con colores segen el tipo que este tenga
    const typesContainer = document.getElementById('pokemon-types');
    typesContainer.innerHTML = '';
    pokemon.types.forEach(type => {
        const typeElement = document.createElement('span');
        typeElement.className = 'type-badge';
        typeElement.style.backgroundColor = getTypeColor(type.type.name);
        typeElement.textContent = capitalizeFirstLetter(type.type.name);
        typesContainer.appendChild(typeElement);
    });

    // Muestra las estadisticas principales (HP, Ataque, Defensa)
    const statsContainer = document.getElementById('pokemon-stats');
    statsContainer.innerHTML = ''; // Limpiar las estadisticas anteriores

    const importantStats = [
        { name: 'HP', value: pokemon.stats[0].base_stat },
        { name: 'Ataque', value: pokemon.stats[1].base_stat },
        { name: 'Defensa', value: pokemon.stats[2].base_stat }
    ];

    // Crea una barra de progreso para cada estadistica
    importantStats.forEach(stat => {
        const statElement = document.createElement('div');
        statElement.innerHTML = `
            <p>${stat.name}: ${stat.value}</p>
            <div class="stats-bar">
                <div class="stats-fill" style="width: ${Math.min(stat.value, 100)}%"></div>
            </div>
        `;
        statsContainer.appendChild(statElement);
    });
}

// Cache para almacenar nombres de Pokémon (mejora rendimiento)
let allPokemonNames = [];

// Al cargar la página, obtenemos todos los nombres de Pokémon
window.onload = async function () {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
    const data = await response.json();
    allPokemonNames = data.results.map(pokemon => pokemon.name);
};

// Evento para mostrar sugerencias al escribir
document.getElementById('pokemon-input').addEventListener('input', async function (e) {
    const input = e.target.value.toLowerCase();
    const suggestionsContainer = document.getElementById('suggestions-container');
    suggestionsContainer.innerHTML = '';

    if (input.length === 0) return;

    // Filtramos coincidencias
    const matches = allPokemonNames.filter(name =>
        name.includes(input)
    ).slice(0, 5); // Mostrar máximo 5 sugerencias

    // Crear elementos de sugerencia
    matches.forEach(name => {
        const suggestionElement = document.createElement('div');
        suggestionElement.className = 'suggestion-item';
        suggestionElement.textContent = capitalizeFirstLetter(name);

        suggestionElement.addEventListener('click', () => {
            document.getElementById('pokemon-input').value = capitalizeFirstLetter(name);
            suggestionsContainer.innerHTML = '';
            BuscarPokemon(); // Opcional: Buscar automáticamente al seleccionar
        });

        suggestionsContainer.appendChild(suggestionElement);
    });
});

// Ocultar sugerencias al hacer clic fuera
document.addEventListener('click', function (e) {
    if (e.target.id !== 'pokemon-input') {
        document.getElementById('suggestions-container').innerHTML = '';
    }
});

// Pone la primera letra en mayuscula
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Devuelve un color segun el tipo de Pokemon
function getTypeColor(type) {
    const colors = {
        normal: '#A8A878',
        fire: '#F08030',
        water: '#6890F0',
        electric: '#F8D030',
        grass: '#78C850',
        ice: '#98D8D8',
        fighting: '#C03028',
        poison: '#A040A0',
        ground: '#E0C068',
        flying: '#A890F0',
        psychic: '#F85888',
        bug: '#A8B820',
        rock: '#B8A038',
        ghost: '#705898',
        dragon: '#7038F8',
        dark: '#705848',
        steel: '#B8B8D0',
        fairy: '#EE99AC'
    };
    return colors[type] || '#777'; // Si el tipo no esta en la lista, usa gris
}


