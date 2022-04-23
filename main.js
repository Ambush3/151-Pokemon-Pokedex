const charactersList = document.getElementById('pokedex');
const searchBar = document.getElementById('search-pokemon');
cachedPokemon = {};
let pokemonCharacters = [];


searchBar.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();

    const filteredCharacters = pokemonCharacters.filter((pokemon) => { // filter through the pokemonCharacters array
        return (
            pokemon.name.toLowerCase().includes(searchString) || // if the pokemon name includes the searchString
            pokemon.type.toLowerCase().includes(searchString) // or if the pokemon type includes the searchString
        );
    });
    displayPokemon(filteredCharacters); // display the filtered pokemonCharacters
});



const fetchPokemon = () => {
    const promises = []; // create an empty array
    for (let i = 1; i <= 151; i++) { // loop through the pokemon
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`; // grab the url
        promises.push(fetch(url).then((res) => res.json())); // push the promise into the array
    }
    Promise.all(promises).then((results) => { // when all promises are resolved
        pokemonCharacters = results.map((result) => ({ // map through the results
            name: result.name, // grab the name
            image: result.sprites['front_default'], // grab the image
            type: result.types.map((type) => type.type.name).join(', '), // grab the type
            id: result.id // grab the id
        }));
        displayPokemon(pokemonCharacters); // display the pokemonCharacters
    });
};

const displayPokemon = (pokemons) => {
    const pokemonHTMLString = pokemons // create a variable that holds the pokemonHTMLString
        .map(
            (pokemon) => `
        <li class="card" onClick="selectPokemon(${pokemon.id})">
            <img class="card-image" src="${pokemon.image}"/>
            <h2 class="card-title">${pokemon.id}. ${pokemon.name}</h2>
        </li>
    `
        )
        .join('');
    pokedex.innerHTML = pokemonHTMLString;
};

const selectPokemon = async (id) => {
    if (!cachedPokemon[id]) { // if the pokemon is not in the cache
        const url = `https://pokeapi.co/api/v2/pokemon/${id}`; // grab the url
        const res = await fetch(url); // fetch the url
        const pokemon = await res.json(); // grab the json
        cachedPokemon[id] = pokemon; // add the pokemon to the cache
        displayPokemonPopup(pokemon); // display the pokemon
    } else { // if the pokemon is in the cache
        displayPokemonPopup(cachedPokemon[id]); // display the pokemon
    }
};

const displayPokemonPopup = (pokemon) => { // display the pokemon
    const type = pokemon.types.map((type) => type.type.name).join(', ');
    const htmlString = `
        <div class="popup">
            <button id="closeBtn" onclick="closePopup()">Close</button>
            <div class="card">
                <img class="card-image" src="${pokemon.sprites['front_default']
        }"/>
                <h2 class="card-title">${pokemon.name}</h2>
                <p><small>Type: ${type} | Height:</small> ${pokemon.height} | Weight: ${pokemon.weight
        }</p>
        <p>Abilities: ${pokemon.abilities.map((ability) => ability.ability.name).join(', ')}</p>
            </div>
        </div>
    `;
    pokedex.innerHTML = htmlString;
};

const closePopup = () => {
    const popup = document.querySelector('.popup');
    popup.parentElement.removeChild(popup);
    displayPokemon(pokemonCharacters);
};


fetchPokemon();


// create a drop down menu to choose different pokemon generations 
