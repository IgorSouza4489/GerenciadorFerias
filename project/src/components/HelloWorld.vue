<template>
<div id="rl">
  <div id="black">

  </div>
  <nav>
    <figure>
          <img src="../assets/logoqq.png" alt="" class="logo">
    </figure>

    <div id="cadastro">
                  <router-link class="" :to="{ name: 'LoginPage', query: {id: 'Administrador'} }"><button class="navBtn">Administrador</button></router-link>

    </div>

  </nav>
  <div id="banner">
    <img src="../assets/banner.png" alt="" class="responsive">
    <div id="textoBanner">
      <h2>Sistema de Gerenciamento de Férias</h2>
    </div>
    </div>
    <div id="barra">
      <div id="funcionarios">
      <div id="colaborador">
        <h3>Como um colaborador você pode</h3>
        <p>
          Solicitar sua férias, escolher a data de início, antecipar seu 13º salário e verificar os status de suas solicitações. </p>
      </div>
       <div id="gestor">
        <h3>Como um Gestor você pode</h3>
        <p>
          Responder as solicitações de seu time, verificar o cenário de férias para os próximos meses e solicitar também suas férias.</p>
      </div>
    </div>
    </div>
    <div id="botoes">
      <router-link class=""  :to="{ name: 'LoginPage', query: {id: 'Colaborador'} }"><button class="botao1">Colaborador</button></router-link>
      <router-link class="" :to="{ name: 'LoginPage', query: {id: 'Gestor'} }"><button class="botao2">Gestor</button></router-link>
    </div>
    <footer class="footer"></footer>
  
</div>
  
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  created(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  methods: {
    navigateToLogin(){
      this.$router.push({name: 'LoginPage'})
    }
  }
}
</script>

<style scoped>

#botoes
{
  margin-bottom: 20px;
}

#barra{
}

#funcionarios{
  
}
/*
.footer {
  background-color:#008D53; 
  color: white; 
  height: 50px; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  position: absolute; 
  bottom: 0; 
  left: 0;
  right: 0; 
}

*/

.botao1 {
  background-color: #008D53;
  border: 1px solid #008D53;
  color: #F9EC00;
  border-radius: 50px;
  padding: 20px 54px;
  margin-right: 50px;
  width: 200px; 
  cursor: pointer;
}


.botao1:hover{
  background-color: transparent;
  color: #008D53;
}

.botao2 {
  cursor: pointer;
  background-color: transparent;
  border: 1px solid #008D53;
  color: #008D53;
  border-radius: 50px;
  padding: 20px 54px;
  margin-left: 50px;
  width: 200px; 
}

.botao2:hover{
  background-color: #008D53;
  color: #F9EC00;
}


#botoes {
  display: inline-block;
  margin-top: 50px;
  
}

#gestor, #colaborador{
    background-color: #008D53;
    float: left; 
    width: 50%;
    color: white;
    
}

h3, p {
  padding: 40px;
}

h3{
  padding-bottom: 0px;
}

p{
  padding-left: 50px;
  padding-right:50px;
  font-size: 20px;
  padding-top:0px
}

#banner{
  position: relative;
}

#textoBanner{
  position: absolute;
  text-align: center;
  top: 10%;
  width: 100%;
  left: 0;
}

#textoBanner p{
  width: 400px;
  margin: auto;
}

#textoBanner h2{
  color: #00673D;
  font-weight: bold;
}

.responsive{
  width: 100%;
  height: auto;
}
.logo {
  width: 80%;
  height: auto;
}
nav{
  background-color: #008D53;
  width: 100%;
  height: 100px;
}

figure{
  margin-top: 10px;
  float: left;
  margin-left:0px
}

.navBtn{
  background-color: transparent;
  border: none;
  color: #F9EC00;
  float: right;
  padding-right: 50px;
  padding-top: 40px;
  font-size: 20px;
  cursor: pointer;
  
}

@media (max-width: 900px)



{
  

  #barra{
  background-color: #007e4a;
  
  }

  #banner{
    display: none;
    position: relative;
  }

  #gestor, #colaborador{
    background-color: #008D53;
    float: none; 
    width: 100%;
    color: white;
}

figure{
  float: none;
  width: 60%;
  margin: 0 auto;
  padding: 30px;
}

.botao1 {
  margin-bottom: 20px;
  background-color: #008D53;
  border: 1px solid #008D53;
  color: #F9EC00;
  border-radius: 50px;
  padding: 20px 54px;
  margin-right: 0px;
  width: 200px; /* define uma largura fixa de 150 pixels para cada botão */
}

.botao2 {
  background-color: transparent;
  border: 1px solid #008D53;
  color: #008D53;
  border-radius: 50px;
  padding: 20px 54px;
  margin-left: 0px;
  width: 200px; /* define uma largura fixa de 150 pixels para cada botão */
}

#cadastro{
  display: none;
}

#botoes {
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-top: 50px;
}


}
</style>
