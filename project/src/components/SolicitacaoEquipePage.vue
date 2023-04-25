<template>
<div>
    <header-comp :notificacoes="notificacoes" ></header-comp>
    <div id="">
         <h3 id="tituloSolicitacao">Solicitações de sua Equipe</h3>
         <div id="filtroNome">
            <label style="padding:10px" for="filtroNome">Filtrar: </label>
            <input type="text" id="filtroNome" placeholder="Digite um nome" v-model="filtroNome">
        </div>
        <button id="filterButton" @click="mostrarTodas">Todas</button>
        <button id="filterButton" @click="mostrarAprovadas">Aprovadas</button>
        <button id="filterButton" @click="mostrarPendentes">Pendentes</button>
        <button id="filterButton" @click="mostrarRecusadas">Recusadas</button>
        

        
        <div class="table-responsive">
        <table class="table table-striped">
      <thead>
        <tr>
          <th class="col-sm-2">Solicitante</th>
          <th class="d-none d-sm-table-cell  col-sm-2"> Data Solicitação</th>
            <th class=" col-sm-2"> Data Início</th>


          <th class="d-none d-sm-table-cell col-sm-2">Data Fim</th> <!--Esconde em mobile-->
          <th class="col-sm-2 ">Resposta</th> 
          <th class="col-sm-2"></th>
        </tr>
      </thead>
      <tbody style="padding:20px" >
        <tr id="clickable" @click="verDetalhes(index)" v-for="(solicitacao, index) in solicitacoesFiltradasNome" :key="index"  >
          <td class="col-sm-2">{{ solicitacao.funcionario.nome }}</td>
          <td class="d-none d-sm-table-cell  col-sm-2">{{ solicitacao.datasolicitacao }}</td>
          <td class="  col-sm-2">{{ solicitacao.datainicio }}</td>

          <td class="d-none d-sm-table-cell col-sm-2">{{ solicitacao.datafim }}</td> <!--Esconde em mobile-->
          <td style="font-weight:bold" :class="{ 'text-danger': solicitacao.statussolicitacao === 'Reprovada', 'text-success': solicitacao.statussolicitacao === 'Aprovada', 'textoPendente': solicitacao.statussolicitacao === 'Pendente' }" class="col-sm-2">{{ solicitacao.statussolicitacao }}</td>
          <td class="col-sm-2 "  ><button  id="btndetalhes" @click="verDetalhes(index)">Responder</button></td>
        </tr>
      </tbody>
    </table>
  </div>
 
  <div  v-if="solicitacaoSelecionada !== null">
    <resposta-modal v-show="mostrarModal"
        :solicitacaoSelecionada="solicitacaoSelecionada"
        @close="mostrarModal = false"
      ></resposta-modal>
  </div>
    </div>
</div>
    
</template>

<script>
import HeaderComp from './header/HeaderComp.vue';
import api from './api';
import RespostaModal from "./modal/RespostaModal.vue";

export default {
    components: {
      HeaderComp,
      RespostaModal
    },
    created(){
        var user = JSON.parse(localStorage.getItem("user"));
        this.idfuncionario = user.idfuncionario
        this.solicitacoesFiltradas = this.solicitacoes
    },
    mounted(){
      this.getSolicitacoes()
      this.ordenarPorData()
    },
    data(){
        return{
            mostrarModal: false,
            user: '',
            id: '',
            filtroNome: '',
            notificacoes: [
              { id: 1, mensagem: "Notificação 12" },
              { id: 2, mensagem: "Notificação 2" },
              { id: 3, mensagem: "Notificação 3" }
            ],
              solicitacoes: [],

            solicitacaoSelecionada: null,
            solicitacoesFiltradas: null,
            statusFiltro: ''

        }
    },
    computed: {
      solicitacoesFiltradasNome() {
        if (!this.filtroNome) {
          return this.solicitacoesFiltradas.filter(solicitacao => {
            return solicitacao.statussolicitacao === this.statusFiltro || this.statusFiltro === 'Todas'
          })
        } else {
          const nomeLower = this.filtroNome.toLowerCase()
          return this.solicitacoesFiltradas.filter(solicitacao => {
            return (solicitacao.funcionario.nome.toLowerCase().includes(nomeLower)) &&
              (solicitacao.statussolicitacao === this.statusFiltro || this.statusFiltro === 'Todas')
          })
        }
      },
    },
    methods: {
        verDetalhes(index) {
        this.mostrarModal = true;
        this.solicitacaoSelecionada = this.solicitacoesFiltradasNome[index];
    },

     async getSolicitacoes() {
      try {
        const response = await api.get(`/ferias/solicitacoes-gestor/${this.idfuncionario} `); 
        this.solicitacoes = response.data;
        
        this.mostrarTodas() 
        this.solicitacoes.forEach(solicitacao => {
          //codigo pronto para mudar de formato postgre para pt-br sem usar newDate
          solicitacao.datainicio = solicitacao.datainicio.replace(/(\d{4})-(\d{2})-(\d{2})/, '$3/$2/$1');
          solicitacao.datafim = solicitacao.datafim.replace(/(\d{4})-(\d{2})-(\d{2})/, '$3/$2/$1');
          solicitacao.datasolicitacao = solicitacao.datasolicitacao.replace(/(\d{4})-(\d{2})-(\d{2})/, '$3/$2/$1');

        })
      } catch (error) {
        console.error(error);
      }
    },


    mostrarAprovadas() {
        this.solicitacoesFiltradas = this.solicitacoes.filter(solicitacao => solicitacao.statussolicitacao === 'Aprovada')
        this.statusFiltro = 'Aprovada'
    },
    mostrarPendentes() {
        this.solicitacoesFiltradas = this.solicitacoes.filter(solicitacao => solicitacao.statussolicitacao === 'Pendente')
        this.statusFiltro = 'Pendente'
    },
     mostrarTodas() {
        this.solicitacoesFiltradas = this.solicitacoes
        this.statusFiltro = 'Todas'
    },
    mostrarRecusadas() {
        this.solicitacoesFiltradas = this.solicitacoes.filter(solicitacao => solicitacao.statussolicitacao === 'Reprovada')
        this.statusFiltro = 'Reprovada'
    },

    ordenarPorData() {
      this.solicitacoes.sort((a, b) => {
        return new Date(b.datasolicitacao) - new Date(a.datasolicitacao)
      })
    }
    },   
}

</script>

<style scoped>

@media (max-width: 900px)
{
  #btndetalhes{
    display: none
  }
  #clickable:hover{
    background-color: rgb(8, 154, 93);
}

}


#btndetalhes{
    margin-right: 100px;
    padding-left: 0px
}

#btndetalhes:hover{
   color: rgb(34, 34, 34);
}



</style>