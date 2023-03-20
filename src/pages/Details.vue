<template>
  <div id="pokemon-details" class="container">
    <img :src="pokemon.image" :alt="pokemon.name" />
    <div id="chart-container">
      <svg id="chart"></svg>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: "PokemonDetails",
  data() {
    return {
      pokemon: {},
    };
  },
  created() {
    const id = this.$route.params.id;
    this.getPokemonDetails(id);
  },
  methods: {
    async getPokemonDetails(id) {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const pokemonData = await response.json();

      this.pokemon = {
        name: pokemonData.name,
        image: pokemonData.sprites.other["official-artwork"].front_default,
        stats: pokemonData.stats.map(stat => ({
          name: stat.stat.name,
          base_stat: stat.base_stat
        }))
      };

      // Cria o gráfico D3.js
      this.$nextTick(() => {
        this.createChart();
      });
    },
    createChart() {
      const labels = this.pokemon.stats.map(stat => stat.name);
      const data = this.pokemon.stats.map(stat => stat.base_stat);

      const svg = d3.select("#chart")
        .attr("width", 900)
        .attr("height", 700);

      const xScale = d3.scaleBand()
        .range([0, 600])
        .domain(labels);

      const yScale = d3.scaleLinear()
        .range([250, 0])
        .domain([0, d3.max(data)]);

      const chart = svg.append('g')
        .attr('transform', 'translate(50, 20)');

      chart.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d, i) => xScale(labels[i]))
        .attr('y', (d) => yScale(d))
        .attr('height', (d) => 250 - yScale(d))
        .attr('width', xScale.bandwidth() - 10)
        .attr('fill', '#36A2EB');

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      chart.append('g')
        .attr('transform', 'translate(0, 250)')
        .call(xAxis);

      chart.append('g')
        .call(yAxis);

        chart.append('text')
        .attr('x', -(350 / 2))
        .attr('y', -70)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .attr('class', 'axis-title')
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>






