<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-text-field
          v-model="search"
          :label="label"
          @input="filterPokemons"
          solo
          placeholder="Pokemon"
          clearable
          clear-icon="mdi-close-circle-outline"
          append-icon="mdi-magnify"
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
            destroyChart();
            $nextTick(() => createChart());
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

          <div class="chart-container">
            <svg id="chart" v-once></svg>
          </div>
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
import * as d3 from "d3";

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
  VTextField,
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
    VTextField,
  },
  data() {
    return {
      search: "",
      showModal: false,
      pokemons: [],
      selectedPokemon: null,
      selectedStats: [],
      filteredPokemons: [],
      offset: 0,
      limit: 300,
      isLoading: false,
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
            stats: pokemonResponse.data.stats.map((s) => {
              return {
                name: s.stat.name,
                value: s.base_stat,
              };
            }),
          };
          this.pokemons.push(pokemon);
        }
        this.filteredPokemons = this.pokemons;
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
        // Increment the limit to load more pokemons  this.limit += 20;
        this.loadPokemons();
      }
    },
    filterPokemons() {
      this.filteredPokemons = this.pokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },

    createChart() {
      const data = this.selectedStats.map((stat) => ({
        name: stat.name,
        value: stat.value,
      }));
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = 700 - margin.left - margin.right;
      const height = 300 - margin.top - margin.bottom;
      const svg = d3
        .select("#chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      const x = d3.scaleBand().rangeRound([0, width]).padding(0.2);
      const y = d3.scaleLinear().rangeRound([height, 0]);

      x.domain(data.map((d) => d.name));
      y.domain([0, d3.max(data, (d) => d.value)]);

      svg
        .append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("class", "axis");
      svg
        .append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(10));
      svg.selectAll(".axis").style("font-size", "14px").attr("class", "axis");

      const colorScale = d3.scaleOrdinal(d3.schemeSet3);

      svg
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => x(d.name))
        .attr("y", (d) => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d.value))
        .style("fill", (d) => colorScale(d.name));
    },
    destroyChart() {
      d3.select("#chart").selectAll("*").remove();
    },
  },
};
</script>


<style scoped>
@import url("https://fonts.googleapis.com/css?family=Roboto&display=swap");

.v-card-title{
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

.v-chip{
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