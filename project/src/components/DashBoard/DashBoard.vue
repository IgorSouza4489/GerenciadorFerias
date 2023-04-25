<template>
  <div>
    <div id="board">
      <h2>Solicitações</h2>
      <hr />
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa reiciendis
      eius earum consequatur blanditiis. Repellendus molestiae aut id ipsam
      commodi facilis magni sunt asperiores, sed minima vitae voluptate,
      explicabo laudantium. Lorem ipsum dolor sit amet consectetur adipisicing
      elit. Culpa reiciendis eius earum consequatur blanditiis. Repellendus
      molestiae aut id ipsam commodi facilis magni sunt asperiores, sed minima
      vitae voluptate, explicabo laudantium. Lorem ipsum dolor sit amet
      consectetur adipisicing elit. Culpa reiciendis eius earum consequatur
      blanditiis. Repellendus molestiae aut id ipsam commodi facilis magni sunt
      asperiores, sed minima vitae voluptate, explicabo laudantium.
    </div>
    <div id="board">
      <h2>Funcionários</h2>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa reiciendis
      eius earum consequatur blanditiis. Repellendus molestiae aut id ipsam
      commodi facilis magni sunt asperiores, sed minima vitae voluptate,
      explicabo laudantium. Lorem ipsum dolor sit amet consectetur adipisicing
      elit. Culpa reiciendis eius earum consequatur blanditiis. Repellendus
      molestiae aut id ipsam commodi facilis magni sunt asperiores, sed minima
      vitae voluptate, explicabo laudantium. Lorem ipsum dolor sit amet
      consectetur adipisicing elit. Culpa reiciendis eius earum consequatur
      blanditiis. Repellendus molestiae aut id ipsam commodi facilis magni sunt
      asperiores, sed minima vitae voluptate, explicabo laudantium.
      <hr />

      <botao-pagina label="Exportar Dados"></botao-pagina>
    </div>
  </div>
</template>


<script>
import BotaoPagina from "../btn/BtnPagina.vue";

export default {
  components: {
    BotaoPagina,
  },
  props: {
    label: String,
  },
};
</script>


<style scoped>
#board {
  margin-top: 50px;
}
</style>
