<template>

<div class="modal-overlay">
        <div id="container">
            <div id="modal">
                    <div class="modal-content">
                    <h2>Solicitação</h2>
                    <br>
                     <p>Data Solicitação: {{ solicitacaoSelecionada.datasolicitacao }}</p>
                    <p>Data de Início {{ solicitacaoSelecionada.datainicio }}</p>
                    <p>Data de Fim: {{ solicitacaoSelecionada.datafim }}</p>
                    <p>Status: {{ solicitacaoSelecionada.statussolicitacao }}</p>
                    <p>Data Resposta: {{ solicitacaoSelecionada.dataresposta }}</p>
                    <p>Observação: {{ solicitacaoSelecionada.observacao }}</p>

                    <div v-if="solicitacaoSelecionada.statussolicitacao == 'Pendente'">
                      <textarea style="width: 100%; height:100px; resize: none" v-model="texto" type="text" placeholder="Digite aqui a observação"></textarea>
                      <div id="radio">
                        <div id="inpt1">
                          <input type="radio" id="one" value="Aprovada" v-model="picked">
                          <label for="one">Aprovar</label>
                        </div>
                        
                        <div id="inpt2">
                          <input type="radio" id="two" value="Reprovada" v-model="picked">
                          <label for="two">Reprovar</label>
                        </div>
                        
                      </div>
                      
                      <p class="error" v-if="erro">Preencha os campos antes de responder</p>
                    </div>
                    </div>
                <div id="botoes">
                    <button id="filterButton" @click="$emit('close')">Fechar</button>
                    <button v-if="solicitacaoSelecionada.statussolicitacao == 'Pendente'" id="filterButton" @click="solicitarFerias" >Responder</button>

                </div>
                
            </div>
            
        </div>
  </div>


</template>

<script>
import api from '../api';
import axios from "axios";

import { useToast } from 'vue-toastification';
const toast = useToast();
export default {
  props: {
    solicitacaoSelecionada: Object,
  },
  data(){
    return{
      picked: '',
      texto: '',
      idfuncionario: this.solicitacaoSelecionada.idfuncionario,
      erro: null
    }
  },
  methods:{
     async solicitarFerias() {
       if (!this.picked || !this.texto) {
                this.erro = true
                return
            }
            else{
                this.erro =  false
            }
      try {
        
        const response = await api.patch(`/ferias/solicitacoes-resposta/${this.solicitacaoSelecionada.idsolicitacao} `, {
          statussolicitacao: this.picked,
          observacao: this.texto,
          solicitacao13: this.solicitacaoSelecionada.solicitacao13,
          idfuncionario: this.solicitacaoSelecionada.idfuncionario,
          datafim: this.solicitacaoSelecionada.datafim,
          datainicio: this.solicitacaoSelecionada.datainicio,
          dataresposta: new Date().toISOString().slice(0, 10) //colocar newdate
        });
            this.enviarEmail()
            this.enviarWorkspace()
            toast.success('Resposta enviada!');
            console.log(response.data)
            this.$router.push('/HomePage'); 

      } catch (error) {
        this.erro = true
        //console.error(error);
      }
    },

    async enviarWorkspace(){
      const data = {
        status: `${this.picked}`,
        data_inicio: `${this.solicitacaoSelecionada.datainicio}`,
        data_fim: `${this.solicitacaoSelecionada.datafim}`,
        data_solicitacao: `${this.solicitacaoSelecionada.datasolicitacao}`,
        observacao: `${this.texto}`,
      }

      try {
        const response = await axios.post('http://127.0.0.1:8000/send_notification', data)
        console.log(response.data)
      }
      catch(error){
        console.log(error)
      }
    },

    async enviarEmail(){
      const data = {
        assunto: "Solicitacao Respondida",
        mensagem: `A sua solicitacao foi respondida pelo gestor, o status dela agora e ${this.picked}`,
        to_email: `${this.solicitacaoSelecionada.funcionario.email}`
      }

      try {
        const response = await axios.post('http://127.0.0.1:8000/enviar_email', data)
        console.log(response.data)
      }
      catch(error){
        console.log(error)
      }
    },
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: #000000da;
}

#modal{
    background-color: white;
    padding: 25px;
    border-radius: 20px;
     position: fixed;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
   width: 300px;
   color: black;
}

#radio{
  display:flex;
  justify-content: center;
}

#inpt1, #inpt2{
  padding: 5px;
}

label{
  padding: 5px;
}
</style>