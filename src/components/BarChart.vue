<template>
  <div><canvas ref="chart"></canvas></div>
</template><script>
import { Bar } from "chart.js";
export default {
  props: {
    chartData: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      new Bar(this.$refs.chart, {
        data: this.chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    },
  },
};
</script>