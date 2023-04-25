<template>
  <div id="body">
    <header-comp :notificacoes="notificacoes" @logout="logout"></header-comp>
    <h3 id="tituloSolicitacao">Suas Solicitações</h3>

    <div
      id="informacoes"
      style="display: flex; justify-content: center; padding: 20px"
      v-if="periodo"
    >
      <div class="inf" id="inicioEmpresa">
        <h4>Data início empresa</h4>
        <p>{{ periodo.periodoEmpresa.datainicio }}</p>
      </div>
      <div class="inf" id="periodoAtual">
        <h4>Período Aquisitivo</h4>
        <p>Início: {{ periodo.periodoAtual.inicio }}</p>
        <p>Fim: {{ periodo.periodoAtual.fim }}</p>
      </div>
      <div class="inf" id="proxPeriodo">
        <h4>Próximo Período</h4>
        <p>Início: {{ periodo.proximoPeriodo.inicio }}</p>
        <p>Fim: {{ periodo.proximoPeriodo.fim }}</p>
      </div>
    </div>

    <div v-else-if="!periodo">
      <p>Você não completou um ano de empresa.</p>
    </div>
    <div v-else>
      <p>Carregando...</p>
    </div>
    <button id="filterButton" @click="mostrarTodas">Todas</button>
    <button id="filterButton" @click="mostrarAprovadas">Aprovadas</button>
    <button id="filterButton" @click="mostrarPendentes">Pendentes</button>
    <button id="filterButton" @click="mostrarRecusadas">Recusadas</button>
    <div v-if="feriasatual" id="saldoFerias">
      Seu saldo de férias é de
      <b
        ><i>{{ feriasatual }} dias</i></b
      >
    </div>

    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th class="col-sm-2">Início</th>
            <!--Esconde em mobile-->
            <th class="col-sm-2">Fim</th>

            <th class="d-none d-sm-table-cell col-sm-2">Data Solicitação</th>
            <!--Esconde em mobile-->
            <th class="col-sm-2">Resposta</th>
            <th class="col-sm-2"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(solicitacao, idsolicitacao) in solicitacoesFiltradas"
            :key="idsolicitacao"
          >
            <td class="col-sm-2">{{ solicitacao.datainicio }}</td>
            <!--Esconde em mobile-->
            <td class="col-sm-2">{{ solicitacao.datafim }}</td>
            <!--Esconde em mobile-->
            <td class="d-none d-sm-table-cell col-sm-2">
              {{ solicitacao.datasolicitacao }}
            </td>

            <td
              style="font-weight: bold"
              :class="{
                'text-danger': solicitacao.statussolicitacao === 'Reprovada',
                'text-success': solicitacao.statussolicitacao === 'Aprovada',
                textoPendente: solicitacao.statussolicitacao === 'Pendente',
              }"
              class="col-sm-2"
            >
              {{ solicitacao.statussolicitacao }}
            </td>
            <td class="col-sm-2">
              <button id="btndetalhes" @click="verDetalhes(idsolicitacao)">
                Ver Detalhes
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="solicitacaoSelecionada !== null">
      <detalhes-modal
        v-show="mostrarModal"
        :solicitacaoSelecionada="solicitacaoSelecionada"
        @close="mostrarModal = false"
      ></detalhes-modal>
    </div>
  </div>
</template>

<script>
import api from "./api";
import jwt_decode from "jwt-decode";
import HeaderComp from "./header/HeaderComp.vue";
import DetalhesModal from "./modal/DetalhesModal.vue";

export default {
  components: {
    HeaderComp,
    DetalhesModal,
  },
  name: "HomePage",
  data() {
    return {
      mostrarModal: false,
      user: "",
      id: "",
      periodo: "",
      feriasatual: null,
      notificacoes: [
        { id: 1, mensagem: "Notificação 12" },
        { id: 2, mensagem: "Notificação 2" },
        { id: 3, mensagem: "Notificação 3" },
      ],
      saldoFerias: "",

      solicitacoes: [],

      solicitacaoSelecionada: null,
      solicitacoesFiltradas: null,
    };
  },
  created() {
    //pegar id user
    var user = JSON.parse(localStorage.getItem("user"));
    this.idfuncionario = user.idfuncionario;
    const token = localStorage.getItem("token");
    if (!token) {
      this.$router.push("/login");
    } else {
      const decToken = jwt_decode(token);
      this.id = JSON.stringify(decToken.id);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      //alert(token)
    }
  },

  mounted() {
    this.getPeriodo();
    this.getSolicitacoes();
    this.getFeriasAtual();
  },
  methods: {
    logout() {
      try {
        localStorage.removeItem("token");
        this.$router.push("/");
      } catch (error) {
        console.log(error);
      }
    },
    verDetalhes(index) {
      this.mostrarModal = true;
      this.solicitacaoSelecionada = this.solicitacoesFiltradas[index];
    },

    async getSolicitacoes() {
      try {
        const response = await api.get(
          `/ferias/solicitacoes/${this.idfuncionario} `
        );
        this.solicitacoes = response.data;

        this.mostrarTodas();
        this.solicitacoes.forEach((solicitacao) => {
          //codigo pronto para mudar de formato postgre para pt-br sem usar newDate
          solicitacao.datainicio = solicitacao.datainicio.replace(
            /(\d{4})-(\d{2})-(\d{2})/,
            "$3/$2/$1"
          );
          solicitacao.datafim = solicitacao.datafim.replace(
            /(\d{4})-(\d{2})-(\d{2})/,
            "$3/$2/$1"
          );
          solicitacao.datasolicitacao = solicitacao.datasolicitacao.replace(
            /(\d{4})-(\d{2})-(\d{2})/,
            "$3/$2/$1"
          );
        });
      } catch (error) {
        console.error(error);
      }
    },

    async getFeriasAtual() {
      try {
        const response = await api.get(
          `ferias/ferias-atual/${this.idfuncionario}`
        );

        this.feriasatual = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async getPeriodo() {
      try {
        const response = await api.get(
          `ferias/periodo-aquisitivo/${this.idfuncionario}`
        );

        this.periodo = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    mostrarAprovadas() {
      this.solicitacoesFiltradas = this.solicitacoes.filter(
        (solicitacao) => solicitacao.statussolicitacao === "Aprovada"
      );
    },
    mostrarPendentes() {
      this.solicitacoesFiltradas = this.solicitacoes.filter(
        (solicitacao) => solicitacao.statussolicitacao === "Pendente"
      );
    },
    //mostra por ordem de datasolicitacao da mais recente para mais antiga
    mostrarTodas() {
      this.solicitacoesFiltradas = this.solicitacoes.slice().sort((a, b) => {
        const dateA = new Date(
          a.datasolicitacao.split("/").reverse().join("/")
        );
        const dateB = new Date(
          b.datasolicitacao.split("/").reverse().join("/")
        );
        return dateA - dateB;
      });
    },
    mostrarRecusadas() {
      this.solicitacoesFiltradas = this.solicitacoes.filter(
        (solicitacao) => solicitacao.statussolicitacao === "Reprovada"
      );
    },
  },
};
</script>

<style scoped>
.inf {
  padding: 20px;
}

#body {
  position: relative;
}

#saldoFerias {
  padding: 20px;
  font-size: 20px;
  color: #f9ec00;
  background-color: #198754;
}
</style>
