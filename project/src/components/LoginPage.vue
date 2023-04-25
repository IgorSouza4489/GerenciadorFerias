<template>
    <div id="container">
        <img src="../assets/logoqq.png" alt="">
        <div id="">
        <div class="form-container">
            
        <form @submit.prevent="login">

        <div class="form-group">
            <h1 id="flag">{{fl}}</h1>

            <input-form label="Matrícula" type="text" v-model="matricula" placeholder="Digite sua matrícula" />

          
        </div>
        <div class="form-group">
            <input-form label="Senha" type="password" v-model="senha" placeholder="Digite sua senha" />
           
        </div>
        <div class="form-group">
            <input type="submit" id="btn" value="Entrar">
        <div class="form-group-links">
            <a href="#">Esqueci minha senha</a>
        </div>
        </div>
        <div class="error" v-if="erro">Usuário ou senha incorretos</div>
        </form>
        </div>
        
        </div>
    </div> 
</template>

<script>
import api from './api';
import InputForm from './form/InputForm.vue';

export default {
    components: {
    InputForm
    
    },
    name: 'LoginPage',
    props: ['flag'],
    
    data(){
        return{
            fl: this.$route.query.id,
            senha: '',
            matricula: '',
            erro: false
        }
    },
    created(){
      //localStorage.clear()
    },
    methods: {
       async login() {
      try {
        const response = await api.post('/auth/login', {
          matricula: this.matricula,
          senha: this.senha
        });
        const token = response.data.token;
        localStorage.setItem('token', token); 
        this.$router.push('/HomePage'); 
      } catch (error) {
        this.erro = true
        //console.error(error);
      }
    }
    }
}
</script>


<style scoped>
@import '@/assets/styles/form.css';

#flag{
    text-align: center;
    color: #008D53;
}
</style>
