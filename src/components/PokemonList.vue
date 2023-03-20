<template>
  <v-container>
    <v-row>
      <v-col
        v-for="(pokemon, index) in pokemons"
        :key="index"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
      <router-link :to="{ name: 'PokemonDetails', params: { id: pokemon.id } }">
        <v-card
          class="mx-auto"
          max-width="344"
          outlined
          :class="{ 'elevation-12': selectedPokemon === pokemon }"
          @mouseenter="selectedPokemon = pokemon"
          @mouseleave="selectedPokemon = null"
        >
          <v-img :src="pokemon.image" height="200"></v-img>
          <v-card-title>
            <h5>{{ pokemon.name }}</h5>
          </v-card-title>

            <v-chip
              v-for="(type, index) in pokemon.type.split(',')"
              :key="index"
              :color="getTypeColor(type.trim())"
            >
              {{ type.trim() }}
            </v-chip>
            <v-btn :to="{ name: 'PokemonDetails', params: { id: pokemon.id } }" text>
              Detalhes
            </v-btn>
         
        </v-card>
      </router-link>
      </v-col>
    </v-row>
    <v-row v-if="isLoading">
      <v-col class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-col>
    </v-row>
  </v-container>
</template>


<style scoped>
.v-card-title {
  font-family: "Flexo-Demi", arial, sans-serif;
  color: #313131;
  text-transform: capitalize;
  font-size: 175%;
  margin-bottom: 5px;
}
.v-card {
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  cursor: pointer;
}
.v-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
}
.v-card:hover .v-img {
  transform: scale(1.1);
}
.v-img {
  transition: transform 0.3s ease-in-out;
}
</style>

<script>
import axios from "axios";
import {
  VContainer,
  VRow,
  VCol,
  VCard,
  VCardTitle,
  VImg,
  VProgressCircular,
  VChip,
  VBtn
  // Adicione aqui outros componentes que utilizar
} from "vuetify/components";

export default {
  components: {
    VContainer,
    VRow,
    VCol,
    VCard,
    VCardTitle,
    VImg,
    VProgressCircular,
    VChip,
    VBtn
    // Adicione aqui outros componentes que utilizar
  },
  data() {
    return {
      pokemons: [],
      offset: 0,
      limit: 300,
      isLoading: false,
      selectedPokemon: null,
      typeColors: {
        normal: "brown lighten-3",
        fire: "red lighten-2 saturate-50",
        water: "blue lighten-2 saturate-50",
        electric: "yellow accent-2 saturate-50",
        grass: "green lighten-2 saturate-50",
        ice: "cyan lighten-3 saturate-50",
        fighting: "deep-orange accent-3 saturate-50",
        poison: "purple lighten-2 saturate-50",
        ground: "amber darken-2 saturate-50",
        flying: "indigo lighten-3 saturate-50",
        psychic: "pink lighten-2 saturate-50",
        bug: "lime accent-3 saturate-50",
      },
    };
  },
  mounted() {
    this.loadPokemons();
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    async loadPokemons() {
      try {
        this.isLoading = true;
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/?offset=${this.offset}&limit=${this.limit}`
        );
        const pokemons = response.data.results;
        for (let i = 0; i < pokemons.length; i++) {
          const pokemonResponse = await axios.get(pokemons[i].url);
          const pokemon = {
            id: pokemonResponse.data.id,
            name: pokemonResponse.data.name,
            image:
              pokemonResponse.data.sprites.other["official-artwork"]
                .front_default,
            type: pokemonResponse.data.types.map((t) => t.type.name).join(", "),
          };
          this.pokemons.push(pokemon);
          console.log("dsfsdffds", pokemon);
        }
        this.offset += this.limit;
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },

    getTypeColor(type) { 
      return this.typeColors[type] || "";
    },
    handleScroll() {
      const scrollPosition = window.innerHeight + window.scrollY;
      const pageHeight = document.body.offsetHeight;
      if (scrollPosition >= pageHeight && !this.isLoading) {
        // Increment the limit to load more pokemons
        this.limit += 20;
        this.loadPokemons();
      }
    },
  },
};
</script>