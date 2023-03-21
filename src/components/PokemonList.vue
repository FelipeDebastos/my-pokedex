<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <SearchPokemon
          :label="label"
          :value="search"
          @input="
            search = $event.target.value;
            filterPokemons();
          "
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="(pokemon, index) in filteredPokemons"
        :key="index"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card
          class="pokemon-card"
          max-width="344"
          outlined
          :class="{ 'elevation-12': selectedPokemon === pokemon }"
          @mouseenter="selectedPokemon = pokemon"
          @mouseleave="selectedPokemon = null"
          @click="
            showModal = true;
            selectedImage = pokemon.image;
            selectedName = pokemon.name;
            selectedStats = pokemon.stats;
          "
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
        </v-card>
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
    <v-dialog v-model="showModal" max-width="900" max-height="1200">
      <v-card>
        <div class="dialog-card">
          <v-img :src="selectedImage" height="200" width="200" />
          <div class="pokemon-title">
            <span>{{ selectedName }}</span>
          </div>

          <stats-chart :stats="selectedStats" />
          <div class="stats-container">
            <div
              class="stat"
              v-for="stat in selectedStats"
              :key="stat.name"
              v-bind:class="stat.type"
            >
              <span>{{ stat.name }}: {{ stat.value }}</span>
            </div>
          </div>
        </div></v-card
      ></v-dialog
    >
  </v-container>
</template>

<script>
import axios from "axios";

import SearchPokemon from "./SearchPokemon.vue";
import StatsChart from "./StatsChart.vue";

import {
  VContainer,
  VRow,
  VCol,
  VCard,
  VCardTitle,
  VImg,
  VProgressCircular,
  VChip,
  VDialog,
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
    VDialog,
    SearchPokemon,
    StatsChart,
  },
  data() {
    return {
      label: "Pokemon",
      search: "",
      showModal: false,
      pokemons: [],
      selectedPokemon: null,
      selectedStats: [],
      filteredPokemons: [],
      offset: 0,
      limit: 10,
      isLoading: false,
      allPokemonsLoaded: false,
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

  methods: {
    handleScroll() {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (
        scrollTop + clientHeight >= 0.9 * scrollHeight &&
        !this.allPokemonsLoaded
      ) {
        this.offset += this.limit;
        this.loadPokemons();
      }
    },

    async loadPokemons() {
      try {
        const API_URL = "https://pokeapi.co/api/v2/pokemon/";

        this.isLoading = true;
        const response = await axios.get(
          `${API_URL}?offset=${this.offset}&limit=${this.limit}`
        );

        const pokemons = response.data.results;
        if (pokemons.length === 0) {
          this.allPokemonsLoaded = true;
          return;
        }
        for (let i = 0; i < pokemons.length; i++) {
          const { data: pokemonResponse } = await axios.get(
            `${pokemons[i].url}`
          );
          const pokemon = {
            id: pokemonResponse.id,
            name: pokemonResponse.name,
            image:
              pokemonResponse.sprites.other["official-artwork"].front_default,
            type: pokemonResponse.types.map((t) => t.type.name).join(", "),
            stats: pokemonResponse.stats.map((s) => ({
              name: s.stat.name,
              value: s.base_stat,
            })),
          };
          this.pokemons.push(pokemon);
        }
        this.filterPokemons();
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    getTypeColor(type) {
      return this.typeColors[type] || "";
    },
    filterPokemons() {
      const filter = this.search.toLowerCase();
      this.filteredPokemons = this.pokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(filter)
      );
    },
  },
};
</script>


<style scoped>
@import url("https://fonts.googleapis.com/css?family=Roboto&display=swap");

.v-card-title {
  display: flex;
  justify-content: center;
  text-transform: capitalize;
  font-size: 30px;
  font-family: "Roboto", sans-serif;
}
.dialog-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.v-chip {
  margin: 5px;
}

.axis text {
  font-size: 24px;
}
.pokemon-title {
  font-size: 24px;
  font-weight: bold;
  margin-top: -10px;
  margin-bottom: 10px;
  font-family: "Roboto", sans-serif;
  text-transform: capitalize;
}
.stats-container {
  margin-top: 15px;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  font-family: Arial, sans-serif;
  font-size: 1.2rem;
}
.stat {
  margin: 0.5rem;
  font-size: 18px;
}
.chart-container {
  display: flex;
  justify-content: center;
}

.pokemon-card {
  border-radius: 15px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.9);
}
.pokemon-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
  transform: translateY(-10px);
}
.pokemon-card.elevation-12 {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
}
.pokemon-card:hover > v-img {
  transform: scale(2.5);
  transition: transform 0.3s ease-in-out;
}
</style>