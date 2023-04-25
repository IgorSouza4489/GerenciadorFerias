<template>
  <div class="modal-overlay">
        <div id="container">
            <div id="modal">
                <h4>Você têm certeza de que deseja enviar a solicitação?</h4>
                <div id="botoes">
                    <button id="filterButton" @click="$emit('send')">Sim</button>
                    <button id="filterButton" @click="$emit('close')">Não</button>
                </div>
                
            </div>
            
        </div>
  </div>
</template>

<script>
  export default {
}
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
   height: 200px;
   color: black;
}



</style>