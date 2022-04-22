const charactersList = document.getElementById('pokedex');
const searchBar = document.getElementById('search-pokemon'); // searchBar.addEventListener('keyup', (e) => {
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
        <li class="card">
            <img class="card-image" src="${pokemon.image}"/>
            <h2 class="card-title">${pokemon.id}. ${pokemon.name}</h2>
            <p class="card-subtitle">Type: ${pokemon.type}</p>
        </li>
    `
        )
        .join('');
    pokedex.innerHTML = pokemonHTMLString;
};

fetchPokemon();
