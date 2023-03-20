<template>
  <div class="pokemon-stats-chart">
    <bar-chart :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    chartOptions: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      defaultOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    };
  },
  mounted() {
    this.renderChart(this.chartData, { ...this.defaultOptions, ...this.chartOptions });
  },
  watch: {
    chartData() {
      this.renderChart(this.chartData, { ...this.defaultOptions, ...this.chartOptions });
    },
    chartOptions() {
      this.renderChart(this.chartData, { ...this.defaultOptions, ...this.chartOptions });
    },
  },
};
</script>

<style scoped>
.pokemon-stats-chart {
  max-width: 600px;
}
</style>