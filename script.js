const searchInput = document.getElementById('search');
const pokemonList = document.getElementById('pokemon-list');
const loader = document.getElementById('loader');

const defaultPokemonNames = [
  "pikachu", "bulbasaur", "charmander", "squirtle", "eevee",
  "jigglypuff", "mew", "mewtwo", "gengar", "snorlax",
  "dragonite", "lucario", "garchomp", "scizor", "lapras",
  "magikarp", "gyarados", "tyranitar", "charizard", "blastoise"
];

const showLoader = () => loader.classList.remove('hidden');
const hideLoader = () => loader.classList.add('hidden');

const fetchPokemon = async (name) => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
  if (!res.ok) throw new Error("Not found");
  return await res.json();
};

const createPokemonCard = (pokemon) => {
  const card = document.createElement('div');
  card.className = "pokemon-card transform hover:scale-105 hover:shadow-lg bg-gray-800 rounded-lg shadow p-4 text-center";

  card.innerHTML = `
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="w-24 h-24 mx-auto mb-2">
    <h2 class="text-xl font-bold capitalize">${pokemon.name}</h2>
    <div class="flex justify-center gap-2 flex-wrap mt-2 mb-2">
      ${pokemon.types.map(t => `<span class="bg-yellow-700 text-sm rounded px-2 py-1">${t.type.name}</span>`).join('')}
    </div>
    <p class="text-sm">Height: ${pokemon.height / 10} m</p>
    <p class="text-sm">Weight: ${pokemon.weight / 10} kg</p>
    <p class="text-sm">Abilities: ${pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
    <a href="https://pokemondb.net/pokedex/${pokemon.name}" target="_blank" class="text-yellow-400 underline text-sm block mt-2">Learn more</a>
  `;

  pokemonList.appendChild(card);
};

const loadPokemons = async (names) => {
  showLoader();
  pokemonList.innerHTML = '';
  for (const name of names) {
    try {
      const pokemon = await fetchPokemon(name);
      createPokemonCard(pokemon);
    } catch (err) {
      console.error(`Error loading ${name}:`, err);
    }
  }
  hideLoader();
};

searchInput.addEventListener('input', async () => {
  const name = searchInput.value.trim().toLowerCase();
  pokemonList.innerHTML = '';

  if (!name) {
    loadPokemons(defaultPokemonNames);
    return;
  }

  showLoader();
  try {
    const pokemon = await fetchPokemon(name);
    createPokemonCard(pokemon);
  } catch {
    pokemonList.innerHTML = `<p class="text-red-400 text-center col-span-full">⚠️ Pokémon not found!</p>`;
  }
  hideLoader();
});

// Load default Pokémon
loadPokemons(defaultPokemonNames);
