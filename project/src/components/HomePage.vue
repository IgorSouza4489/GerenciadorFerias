<template>
  <div id="" style="background-color: #fafafa">
    <header-comp :notificacoes="notificacoes" @logout="logout"></header-comp>

    <div v-if="user.tipo === 'Colaborador'">
      <div id="container">
        <h2>
          Seja bem-vindo <i>{{ user.nome }}</i
          >!
        </h2>
        <accordion-cl></accordion-cl>
        <router-link class="" :to="{ name: 'SolicitarFerias' }"
          ><botao-pagina
            classe="botao-paginas"
            label="Solicitar Férias"
          ></botao-pagina
        ></router-link>
      </div>
    </div>
    <div id="dashboard" v-else-if="user.tipo === 'Gestor'">
      <div id="containerChart">
        <div id="barChart">
          <h2>Cenário de Férias</h2>
          <p id="subtitulo">
            Esse gráfico mostra o número de funcionários que iniciam férias em
            cada mês
          </p>
          <BarChart :id="id" />
        </div>
        <hr />

        <div class="chart-container flex">
          <div id="chart">
            <h2>Solicitações</h2>
            <p id="subtitulo">
              Esse gráfico evidencia a resposta de suas solicitações este ano
            </p>
            <PieChart :id="id" />
          </div>
          <div id="chart">
            <h2>Funcionários</h2>
            <p id="subtitulo">
              Esse gráfico evidencia os funcionários ativos e ociosos
            </p>
            <PieChartFunc :id="id" />
          </div>
        </div>
        <hr />

        <div class="dropdown">
          <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            id="exportButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Relatórios
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li>
              <a class="dropdown-item" @click="pythonFerias">CSV Férias</a>
            </li>
            <li>
              <a class="dropdown-item" @click="pythonSolicitacao"
                >CSV Solicitações</a
              >
            </li>
            <li>
              <a class="dropdown-item" @click="pythonSolicitacaoMes"
                >CSV Férias Mensal</a
              >
            </li>
          </ul>
        </div>

        <!---
        <button id="exportButton" @click="pythonFerias">CSV Férias</button>
        <button id="exportButton" @click="pythonSolicitacao">
          CSV Solicitações
        </button>
        <button id="exportButton" @click="pythonSolicitacao">
          CSV Férias Mensal
        </button>-->

        <router-link class="" :to="{ name: 'SolicitarFerias' }"
          ><botao-pagina
            classe="botao-paginas"
            label="Solicitar Férias "
          ></botao-pagina
        ></router-link>
        <router-link class="" :to="{ name: 'SolicitacaoEquipe' }"
          ><botao-pagina
            classe="botao-paginas2"
            label="Solicitação Equipe"
          ></botao-pagina
        ></router-link>
      </div>
    </div>

    <div v-else-if="user.tipo === 'RH'">
      <router-link class="" :to="{ name: 'RegisterPage' }"
        ><button class="botao-paginas">
          Cadastrar Funcionário
        </button></router-link
      >
    </div>
  </div>
</template>

<script>
import api from "./api";
import jwt_decode from "jwt-decode";
import HeaderComp from "./header/HeaderComp.vue";
import AccordionCl from "./accordion/AccordionCl.vue";
import BotaoPagina from "./btn/BtnPagina.vue";
import BarChart from "./graphics/BarChart";
import PieChart from "./graphics/PieChart";
import PieChartFunc from "./graphics/PieChartFunc";
import axios from "axios";
import { useToast } from "vue-toastification";
const toast = useToast();
export default {
  components: {
    HeaderComp,
    AccordionCl,
    BotaoPagina,
    BarChart,
    PieChart,
    PieChartFunc,
  },
  name: "HomePage",

  data() {
    return {
      user: "",
      id: "",
      periodo: "",
      funcionarios: [],
      funcionarioMes: Array(12).fill(0),
      aprovadas: "",
      pendentes: "",
      recusadas: "",
      notificacoes: [
        { id: 1, mensagem: "Notificação 12" },
        { id: 2, mensagem: "Notificação 2" },
        { id: 3, mensagem: "Notificação 3" },
      ],
      notificacoesPendentes: [], // Notificações pendentes
    };
  },
  async created() {
    const token = localStorage.getItem("token");
    if (!token) {
      this.$router.push("/login");
    } else {
      const decToken = jwt_decode(token);
      this.id = JSON.stringify(decToken.id);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      this.getUserData();
      this.gerarRelatorioSolicitacoes();
      this.gerarRelatorioFerias();
      this.gerarRelatorioMes()
      this.periodoAquisitivo();
      this.checarTime();
    }
  },
  unmounted() {
    if (this.socket) {
      this.socket.disconnect(); // Desconecta-se do servidor WebSocket quando o componente for destruído
    }
  },
  mounted() {},
  methods: {
    async getUserData() {
      try {
        const response = await api.get(`/users/${this.id} `);
        this.user = response.data;
        localStorage.setItem("user", JSON.stringify(this.user));
      } catch (error) {
        console.error(error);
      }
    },

    async gerarRelatorioSolicitacoes() {
      api.get(`ferias/solicitacoes-numero/${this.id}`).then((response) => {
        this.aprovadas = response.data.totalAprovadas;
        this.pendentes = response.data.totalPendentes;
        this.recusadas = response.data.totalReprovadas;
        console.log(response.data);
      });
    },

    async gerarRelatorioMes() {
  try {
    const response = await api.get(`ferias/feriasmes/${this.id}`);
    const dados = response.data;
    this.funcionarioMes = dados.map(dado => dado.qtdFuncionarios);
    console.log(this.funcionarioMes);
  } catch (error) {
    console.error(error);
  }
},

    async gerarRelatorioFerias() {
      api.get(`ferias/funcionarios-status/${this.id}`).then((response) => {
        this.ferias = response.data.numFuncionariosFerias;
        this.ativos = response.data.numFuncionariosAtivos;
        console.log(response.data);
      });
    },

    async pythonFerias() {
      const data = {
        ativos: this.ativos,
        ferias: this.ferias,
        to_email: `${this.user.email}`,
      };

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/enviar_relatorio",
          data
        );
        console.log(response.data);
        toast.success("Relatório enviado para seu email");
      } catch (error) {
        console.log(error);
        toast.error("Erro ao enviar relatório, tente novamente mais tarde");
      }
    },

    async pythonSolicitacaoMes() {
      const data = {
        janeiro: this.funcionarioMes[0],
        fevereiro: this.funcionarioMes[1],
        março: this.funcionarioMes[2],
        abril: this.funcionarioMes[3],
        maio: this.funcionarioMes[4],
        junho: this.funcionarioMes[5],
        julho: this.funcionarioMes[6],
        agosto: this.funcionarioMes[7],
        setembro: this.funcionarioMes[8],
        outubro: this.funcionarioMes[9],
        novembro: this.funcionarioMes[10],
        dezembro: this.funcionarioMes[11],
        to_email: `${this.user.email}`,
      };

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/enviar_relatorio_mes",
          data
        );
        console.log(response.data);
        toast.success("Relatório enviado para seu email");
      } catch (error) {
        console.log(error);
        toast.error("Erro ao enviar relatório, tente novamente mais tarde");
      }
    },

    async pythonSolicitacao() {
      const data = {
        aprovadas: this.aprovadas,
        recusadas: this.recusadas,
        pendentes: this.pendentes,
        to_email: `${this.user.email}`,
      };

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/enviar_relatorio_solicitacoes",
          data
        );
        console.log(response.data);
        toast.success("Relatório enviado para seu email");
      } catch (error) {
        console.log(error);
        toast.error("Erro ao enviar relatório, tente novamente mais tarde");
      }
    },

    //checa se ele tirou ferias no periodo aquisitivo atual e se o periodo esta vencendo
    async periodoAquisitivo() {
      try {
        const response = await api.get(
          `/ferias/funcionario-status/${this.id} `
        );
        this.periodo = response.data;

        if (
          this.periodo.periodoVencendo === true &&
          this.periodo.feriasAprovada === false
        ) {
          toast(
            `Olá ${this.periodo.nome} se passaram 11 meses desde o início de seu período aquisitivo e você ainda não tirou férias, verifique seu período em Minhas Solicitações`
          );
        }
      } catch (error) {
        console.error(error);
      }
    },

    async checarTime() {
      try {
        const response = await api.get(
          `/ferias/lista-funcionarios-status/${this.id}`
        );

        const funcionariosFormatados = response.data.listaFuncionarios.map(
          (funcionario) => {
            return {
              nome: funcionario.nome,
              email: funcionario.email,
              ferias: funcionario.ferias,
              periodoVencendo: funcionario.periodoVencendo,
              feriasAprovada: funcionario.feriasAprovada,
            };
          }
        );

        this.funcionarios = funcionariosFormatados;
        this.funcionarios = funcionariosFormatados;
        var funcionarioCheck = false;
        funcionariosFormatados.forEach((funcionario) => {
          if (funcionario.periodoVencendo && !funcionario.feriasAprovada) {
            funcionarioCheck = true;
          }
        });
        if (funcionarioCheck) {
          toast(
            `Existem funcionários que estão com o período de férias vencendo e ainda não tiraram férias.`
          );
        }
      } catch (error) {
        console.error(error);
      }
    },

    async periodoAquisitivoFuncionarios() {},

    logout() {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        this.$router.push("/");
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
h2 {
  color: #00673d;
  font-weight: bold;
}

#dashboard {
  margin-top: 20px;
}

#subtitulo {
  color: #808080;
  font-style: italic;
}

.chart-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

@media only screen and (max-width: 600px) {
  .chart-container {
    flex-direction: column;
  }
}

#chart {
  padding: 20px;
}

#barChart {
  margin-bottom: 80px;
}
</style>


