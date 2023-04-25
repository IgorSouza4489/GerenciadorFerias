<template>
  <div id="">
    <Pie
      v-if="chartData.datasets[0].data.length"
      :options="chartOptions"
      :data="chartData"
      ref="chart"
    />
    <div v-else>Carregando...</div>
  </div>
</template>

<script>
import { Pie } from "vue-chartjs";
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";
import api from "../api";
ChartJS.register(ArcElement, Tooltip, Legend);

export default {
  name: "PieChart",
  components: { Pie },
  props: ["id"],
  data() {
    return {
      chartData: {
        labels: ["Aprovadas", "Pendentes", "Recusadas"],
        datasets: [
          {
            backgroundColor: ["#41B883", "#E46651", "#ff0000"],
            data: [],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  mounted() {
    api
      .get(`ferias/solicitacoes-numero/${this.id}`)
      .then((response) => {
        this.aprovadas = response.data.totalAprovadas;
        this.pendentes = response.data.totalPendentes;
        this.recusadas = response.data.totalReprovadas;
        this.chartData.datasets[0].data = [
          this.aprovadas,
          this.pendentes,
          this.recusadas,
        ];
      })
  },
};
</script>