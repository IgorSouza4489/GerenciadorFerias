<template>
  <div id="">
    <Pie
      v-if="chartData.datasets[0].data.length"
      :options="chartOptions"
      :data="chartData"
    />
    <div v-else>Carregando...</div>
  </div>
  
</template>

<script>
import { Pie } from "vue-chartjs";
import api from "../api";
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

export default {
  name: "PieChart",
  components: { Pie },
  props: ["id"],
  data() {
    return {
      chartData: {
        labels: ["Ativos", "Férias"],
        datasets: [
          {
            backgroundColor: ["#41B883", "#ff0000"],
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
    api.get(`ferias/funcionarios-status/${this.id}`).then((response) => {
      this.ferias = response.data.numFuncionariosFerias
      this.ativos = response.data.numFuncionariosAtivos;
      this.chartData.datasets[0].data = [
        this.ativos,
        this.ferias,
      ];
    })
  },
};
</script>