<template>
   <nav class="navbar navbar-expand-lg navbar-dark bg-success">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">
      <img src="@/assets/logoqq.png" alt="Logo"  class="d-inline-block align-text-top">
    </a>
    
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto">
         <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle d-none d-sm-block" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="bi bi-bell-fill text-warning"></i>
            </a>
            <a class="nav-link d-sm-none" href="#">
              Notificações
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li v-for="notificacao in notificacoes" :key="notificacao.id"><a class="dropdown-item" href="#">{{notificacao.mensagem}}</a></li> 
             
            </ul>
          </li>
          
        <li class="nav-item">
          <router-link class=""  :to="{ name: 'MinhasSolicitacoes'}">
          <a class="nav-link" href="#">
            <i class="bi bi-person-fill text-warning"></i>
             Minhas Solicitações  
          </a>
          </router-link>
        </li>
         <li v-if="tipo === 'Gestor' " class="nav-item">
          <router-link class=""  :to="{ name: 'MeuTimePage'}">
          <a class="nav-link" href="#">
            <i class="bi bi-person-fill text-warning"></i>
             Meu Time  
          </a>
          </router-link>
        </li>
        <li v-if="tipo === 'Gestor' " class="nav-item">
          <router-link class=""  :to="{ name: 'RegisterTimePage'}">
          <a class="nav-link" href="#">
            <i class="bi bi-person-fill text-warning"></i>
             Cadastrar 
          </a>
          </router-link>
        </li>
        
        <li class="nav-item">
          <a class="nav-link" href="#" @click="logout()">
            <i class="bi bi-box-arrow-right text-warning"></i>
            Sair
          </a>
        </li>
      </ul>
    </div>
  </div>
</nav>
</template>

<script>
import 'bootstrap-icons/font/bootstrap-icons.css';

export default {
  props: {
    notificacoes: {
      type: Array,
      required: true
    }
  },

  created(){
        var user = JSON.parse(localStorage.getItem("user"));
        this.tipo = user.tipo
       
  },
  
  data(){
    return{
     tipo: null
    }
  },
  methods: {
      logout(){
       try{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.$router.push('/'); 

       }
       catch(error){
        console.log(error)
       }
      }
   }
};
</script>


<style scoped>
a{
  text-decoration: none;
  
}

.bi{
  font-size: 23px;
}

img{
  width: 80%;
}
</style>
