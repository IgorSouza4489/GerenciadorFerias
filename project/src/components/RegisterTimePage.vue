<template>
  <div id="container">
    <img src="../assets/logoqq.png" alt="">
    <div id="">
      <div class="form-container">
        <form @submit.prevent="register">
          <div class="form-group">
            <h1>Cadastrar Colaborador</h1><br>
            
          </div>
          <div class="form-group">
            <input-form label="Nome" type="text" v-model="nome" placeholder="Digite um nome" />
          </div>
          <div class="form-group">
            <input-form label="Email" type="email" v-model="email" placeholder="Digite o email pessoal"/>
          </div>
          <div class="form-group">
            <input-form label="Email Institucional" type="email" v-model="emailinstitucional" placeholder="Digite o email institucional"/>
          </div>
          <div class="form-group">
            <input-form label="Matrícula" type="matricula" v-model="matricula" placeholder="Digite uma matrícula" />
          </div>
          
          <div class="form-group">
            <label for="">Contrato</label>
            <select required v-model="selectedContrato">
              <option value="" disabled selected>Selecione o tipo de contrato</option>
              <option v-for="contrato in contratos" :key="contrato.id">{{ contrato.name }}</option>

            </select>
          </div>
          <div class="form-group">
            <input-form label="Data de Início" type="date" v-model="dataInicio" placeholder="Seleciona uma data de início" />

        </div>
          <div class="form-group">
            <input-form label="Senha" type="password" v-model="senha" placeholder="Digite uma senha" />
          </div>
          <div class="form-group">
            <input type="submit" id="btn" value="Registrar"> 
          </div>
          <p v-if="error" style="color: red">Verifique se você digitou o email corretamente</p>
        </form>
      </div>
    </div>
  </div> 
</template>

<script>
import InputForm from './form/InputForm.vue';
import api from './api';

export default {
  components: {
    InputForm
    
  },
  data() {
    return {
      error: false,
      nome: '',
      email: '',
      senha: '',
      dataInicio: '',
      idfuncionario: '',
      emailinstitucional: '',
      matricula: '',
      selectedTipo: '',
      selectedGestor: '',
      selectedContrato: '',
      options: [],
         contratos: [
        {id: 1, name: 'CLT'},
        {id: 2, name: 'PJ'}
        ],
        tipos: [],

    };
  },
   async created() {

     var user = JSON.parse(localStorage.getItem("user"));
     this.idfuncionario = user.idfuncionario

    //alert(this.options.idfuncionario)
  },
  methods: {

        validarEmail(email){
            const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
            return emailRegex.test(email);
        },
       async register() {

        if (this.validarEmail(this.email)){
            try {
            this.error = false
            const response = await api.post('/auth/register', {
            tipo: "Colaborador",
            nome: this.nome,
            contrato: this.selectedContrato,
            matricula: this.matricula,
            email: this.email,
            emailinstitucional: this.emailinstitucional,
            datainicio: new Date(this.dataInicio),
            senha: this.senha,
            idgestor: this.idfuncionario,


            });

            console.log(response.data)
            this.$router.push({
                path: '/HomePage',
                //query: {id: tipo}
            }); 
        } catch (error) {
            this.erro = true
            //console.error(error);
        }
        }
        else{
            this.error = true
        }
       
    }
    }
}

</script>


<style scoped>
@import '@/assets/styles/form.css';




</style>
