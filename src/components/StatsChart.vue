<template>
  <div class="chart-container">
    <svg ref="chart"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "StatsChart",
  props: {
  stats: {
    type: Array,
    required: true,
  },},
  mounted() {
    this.createChart();
  },
  methods: {
    createChart() {
      const data = this.stats.map((stat) => ({
      name: stat.name,
      value: stat.value,
    }));
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = 700 - margin.left - margin.right;
      const height = 300 - margin.top - margin.bottom;
      const svg = d3
  .select(this.$refs.chart)
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
  },
};
</script>