<template>

<div class="modal-overlay">
        <div id="container">
            <div id="modal">
                    <div class="modal-content">
                     <p>Data Solicitação: {{ solicitacaoSelecionada.datasolicitacao }}</p>
                    <p>Data de Início {{ solicitacaoSelecionada.datainicio }}</p>
                    <p>Data de Fim: {{ solicitacaoSelecionada.datafim }}</p>
                    <p>Status: {{ solicitacaoSelecionada.statussolicitacao }}</p>
                    <p>Data Resposta: {{ solicitacaoSelecionada.dataresposta }}</p>
                    <p>Observação: {{ solicitacaoSelecionada.observacao }}</p>

                    </div>
                <div id="botoes">
                    <button id="filterButton" @click="$emit('close')">Fechar</button>
                </div>
                
            </div>
            
        </div>
  </div>


</template>

<script>
export default {
  props: {
    solicitacaoSelecionada: Object,
  },
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

</style>