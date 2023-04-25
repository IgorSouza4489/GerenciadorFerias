<template>
  <div>
    <header-comp :notificacoes="notificacoes"></header-comp>
    <div id="">
      <h3 id="tituloSolicitacao">Seu time</h3>
      <!--
      <div id="filtroNome">
        <label style="padding: 10px" for="filtroNome">Filtrar: </label>
        <input
          type="text"
          id="filtroNome"
          placeholder="Digite um nome"
          v-model="filtroNome"
        />
      </div>-->

      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th class="col-sm-2">Nome</th>
              <th class="d-none d-sm-table-cell col-sm-2">Email</th>
              <th class="col-sm-2">Ferias</th>
              <th class="col-sm-2">Período Aquisitivo Vencendo</th>
              <th class="col-sm-2">Férias no seu período?</th>
              <th class="d-none d-sm-table-cell col-sm-2">Dias disponíveis</th>
            </tr>
          </thead>
          <tbody style="padding: 20px">
            <tr
              id="clickable"
              v-for="(funcionario, index) in funcionarios"
              :key="index" :class="{ 'table-danger': funcionario.periodoVencendo && funcionario.diasDisponiveis > 0 }"
            >
              <td class="col-sm-2">{{ funcionario.nome }}</td>
              <td class="d-none d-sm-table-cell col-sm-2">
                {{ funcionario.email }}
              </td>
              <td v-if="funcionario.ferias === true" class="col-sm-2">
                Férias
              </td>
              <td v-else class="col-sm-2">Ativo</td>
              <td v-if="funcionario.periodoVencendo === true" class="col-sm-2">
                Sim
              </td>
              <td v-else class="col-sm-2">Não</td>
               <td v-if="funcionario.feriasAprovada === true" class="col-sm-2">
                Sim
              </td>
              <td v-else class="col-sm-2">Não</td>
        
               <td class="d-none d-sm-table-cell col-sm-2">
                {{funcionario.diasDisponiveis}}
              </td>

            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderComp from "./header/HeaderComp.vue";
import api from "./api";

export default {
  components: {
    HeaderComp,
  },
  created() {
    var user = JSON.parse(localStorage.getItem("user"));
    this.idfuncionario = user.idfuncionario;
  },
  mounted() {
    this.getTime();
  },
  data() {
    return {
      mostrarModal: false,
      user: "",
      id: "",
      filtroNome: "",
      funcionarios: [],
      notificacoes: [
        { id: 1, mensagem: "Notificação 12" },
        { id: 2, mensagem: "Notificação 2" },
        { id: 3, mensagem: "Notificação 3" },
      ],
      solicitacoes: [],

      funcionarioSelecionado: null,
      funcionariosFiltrados: null,
      statusFiltro: "",
    };
  },
  computed: {},
  methods: {
    async getTime() {
      try {
        const response = await api.get(
          `/ferias/lista-funcionarios-status/${this.idfuncionario}`
        );

        const funcionariosFormatados = response.data.listaFuncionarios.map(
          (funcionario) => {
            return {
              nome: funcionario.nome,
              email: funcionario.email,
              ferias: funcionario.ferias,
              periodoVencendo: funcionario.periodoVencendo,
              feriasAprovada: funcionario.feriasAprovada,
              diasDisponiveis: funcionario.diasDisponiveis
            };
          }
        );

        this.funcionarios = funcionariosFormatados;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
@media (max-width: 900px) {
  #btndetalhes {
    display: none;
  }
  #clickable:hover {
    background-color: rgb(8, 154, 93);
  }
}

#btndetalhes {
  margin-right: 100px;
  padding-left: 0px;
}

#btndetalhes:hover {
  color: rgb(34, 34, 34);
}
</style>