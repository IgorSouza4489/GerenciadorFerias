<template>
  <div id="">
    <Bar
      v-if="chartData.datasets[0].data.length"
      :options="chartOptions"
      :data="chartData"
      ref="chart"
    />
    <div v-else>Carregando...</div>
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import api from "../api";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
    props: ["id"],

  data() {
    return {
      chartData: {
        labels: [ 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro' ],
        datasets: [ { 
          label: 'Funcionários',
          backgroundColor: '#f87979',

          data: []
            } ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },
   mounted() {
    api
      .get(`ferias/feriasmes/${this.id}`)
      .then((response) => {
        for(let i = 0; i < response.data.length; i++){
          let mes = response.data[i].mes;
          let qtd = response.data[i].qtdFuncionarios;

          switch (mes) {
            case 'janeiro':
              this.chartData.datasets[0].data[0] = qtd;
              break;
            case 'fevereiro':
              this.chartData.datasets[0].data[1] = qtd;
              break;
            case 'março':
              this.chartData.datasets[0].data[2] = qtd;
              break;
            case 'abril':
              this.chartData.datasets[0].data[3] = qtd;
              break;
            case 'maio':
              this.chartData.datasets[0].data[4] = qtd;
              break;
            case 'junho':
              this.chartData.datasets[0].data[5] = qtd;
              break;
            case 'julho':
              this.chartData.datasets[0].data[6] = qtd;
              break;
            case 'agosto':
              this.chartData.datasets[0].data[7] = qtd;
              break;
            case 'setembro':
              this.chartData.datasets[0].data[8] = qtd;
              break;
            case 'outubro':
              this.chartData.datasets[0].data[9] = qtd;
              break;
            case 'novembro':
              this.chartData.datasets[0].data[10] = qtd;
              break;
            case 'dezembro':
              this.chartData.datasets[0].data[11] = qtd;
              break;
          }
        }
      })
  },
}
</script>