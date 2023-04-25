<template>
    <div>
        <header-comp></header-comp>
        <div class="form-container">
            
        <form @submit.prevent="solicitarFerias">

        <div class="form-group">
            <h2>Solicitar Férias</h2><br>
        </div>

        <div v-if="this.contrato.includes('CLT')" class="form-group">
            <p>Você já solicitou a antecipação do 13 salário?</p>
            <label>
                <input type="radio" value="sim" v-model="antecipou13Salario">Sim
            </label>
            <label>
                <input type="radio" value="nao" v-model="antecipou13Salario">Não
            </label>
        </div>

        <div v-if="antecipou13Salario === 'nao'" class="form-group">
            <p>Você deseja solicitar o adiantamento do 13 salário?</p>
            <label>
                <input type="radio" value="true" v-model="adiantou13Salario">Sim
            </label>
            <label>
                <input type="radio" value="false" v-model="adiantou13Salario">Não
            </label>
        </div>

        <div @change="calculoDiaFim" class="form-group">
            <p>Quantos dias de férias deseja solicitar?</p>
            <label>
                <input type="radio" value="5" v-model="diasFerias">5 dias
            </label>
            <label>
                <input type="radio" value="10" v-model="diasFerias">10 dias
            </label>
            <label>
                <input type="radio" value="15" v-model="diasFerias">15 dias
            </label>
            <label>
                <input type="radio" value="20" v-model="diasFerias">20 dias
            </label>
            <label>
                <input type="radio" value="30" v-model="diasFerias">30 dias
            </label>
        </div>

        <div v-if="diasFerias != null" class="form-group">
            <label>Data de início das férias:</label>
            <input @change="calculoDiaFim" type="date" v-model="dataInicioFerias">
        </div>

         <div v-if="dataInicioFerias != null " class="form-group">
            <p>Suas férias terminarão em: {{diaFim}}</p>
        </div>


        <div  class="form-group">
            <input type="submit" id="btn" value="Enviar Solicitação"> 
        </div>
        
            <div class="error" v-if="erro">Preencha os campos obrigatórios</div>

        </form>

            <form-modal v-show="mostrarModal" @close="mostrarModal = false"  @send="confirmado = true"></form-modal>

        </div>
    </div>
</template>

<script>
import HeaderComp from './header/HeaderComp.vue';
import FormModal from './modal/FormModal.vue'
import { useToast } from 'vue-toastification';
import axios from "axios";

const toast = useToast();
import api from './api';


export default {
    components: {
      HeaderComp,
      FormModal
    },
    name: 'SolicitarPage',

    created(){
        //this.checarAnoEmpresa()
        var user = JSON.parse(localStorage.getItem("user"));
        this.idgestor = user.idgestor
        this.nomefuncionario = user.nome
        this.idfuncionario = user.idfuncionario
        this.inicioEmpresa = user.datainicio
        this.contrato = user.contrato
        this.pegarDadosGestor()
        //alert(this.inicioEmpresa)

    },
    data(){
        return{
            confirmado: false,
            nomefuncionario: null,
            mostrarModal: false,
            antecipou13Salario: null,
            idgestor: null,
            gestoremail: null,
            adiantou13Salario: false,
            diasFerias: null,
            dataInicioFerias: null,
            diaFim: null,
            statussolicitacao: "Pendente",
            observacao: null,
            dataresposta: null,
            idfuncionario: this.userId,
            inicioEmpresa: null,
            datafim: null,
            erro: null,
            contrato: '',
            umAnoData: '',
        }
    },
    methods: {
        pegarDadosGestor(){
            api
      .get(`/users/gestores/${this.idgestor}`)
      .then((response) => {
        this.gestoremail = response.data.email;
        console.log(response.data)
      })
            
        },

        async enviarEmail(){
      const data = {
        assunto: "Solicitacao Pendente",
        mensagem: `${this.nomefuncionario} fez uma solicitacao de ferias`,
        to_email: `${this.gestoremail}`
      }

      try {
        const response = await axios.post('http://127.0.0.1:8000/enviar_email', data)
        this.enviarWorkspace()
        console.log(response.data)
      }
      catch(error){
        console.log(error)
      }
    },

    async enviarWorkspace(){
      const data = {
        funcionario: this.nomefuncionario
      }

      try {
        const response = await axios.post('http://127.0.0.1:8000/send_notification2', data)
        console.log(response.data)
      }
      catch(error){
        console.log(error)
      }
    },

        checarDataInicio(){
          const user = JSON.parse(localStorage.getItem('user'));
          if (user.datainicio != null){
            this.datainicio = user.datainicio;
          }
          else{
            alert('null')
          }
          const dataAtual = new Date();
          const dataInicio = new Date(this.datainicio);
          dataInicio.setFullYear(dataInicio.getFullYear() + 1);
          if (dataAtual > dataInicio) {
            this.umAnoData = true
          } else {
            this.umAnoData = false
          }
        },

        async solicitarFerias() {
            if (this.contrato.includes('CLT')){
                if (!this.diasFerias || !this.dataInicioFerias || !this.antecipou13Salario) {
                toast.error('Preencha corretamente os campos!');
                return
                }
                else{
                    this.erro =  false
                }
            }
            else{
                if (!this.diasFerias || !this.dataInicioFerias ) {
                toast.error('Preencha corretamente os campos!');
                return
                }
                else{
                    this.erro =  false
                }
            }

             this.checarDataInicio()
            if (!this.umAnoData) {
                 toast.error('Você só pode solicitar férias após um ano de empresa!');
                return;
            }
             
            this.mostrarModal = true
            await new Promise((resolve) => {
                    const interval = setInterval(() => {
                        if (this.confirmado) {
                            this.mostrarModal = false;
                            clearInterval(interval);
                            resolve();
                        }
                }, 100);
            });

      try {
        const response = await api.post('/ferias/solicitar', {
          statussolicitacao: this.statussolicitacao,
          adiantou13Salario: this.adiantou13Salario,
          datainicio: this.dataInicioFerias,
          datafim: this.datafim,
          datasolicitacao: new Date(),
          observacao: this.observacao,
          solicitacao13: this.adiantou13Salario,
          idfuncionario: this.idfuncionario
        });
            this.enviarEmail()
            console.log(response.data)
            toast.success('Solicitação enviada!');
            this.$router.push('/HomePage'); 

      } catch (error) {
        if (error.response.status === 400){
            toast.error('Você não têm saldo de dias suficientes para fazer essa solicitação');

        }
        else if(error.response.status === 402){
            toast.error('Você já fez duas solicitações nesse periodo aquisitivo, essa deve ser de pelo menos 15 dias')
        }

        else if(error.response.status === 403){
            toast.error('Você já têm duas solicitações ou mais pendentes, aguarde serem respondidas')
        }
        else if(error.response.status === 404){
            toast.error('Você possui 15 dias restantes de saldo e ainda não tirou 15 dias ou mais de férias nesse período.')
        }
        else if(error.response.status === 408){
            toast.error('Você solicitou anteriormente 10 dias de férias, essa solicitação deve ser de pelo menos 15 dias.')
        }
        else {
            toast.error('A próxima solicitação precisa ser de pelo menos 15 dias')
        }
        this.erro = true
        //console.error(error);
      }
    },
       /* calculoDiaFim() {
            import { addBusinessDays } from 'date-fns';
            import 'moment-business-days';  
            if (this.dataInicioFerias && this.diasFerias) {
                const dataInicio = new Date(this.dataInicioFerias);
                const diasFerias = parseInt(this.diasFerias);
                const diaFim = addBusinessDays(dataInicio, diasFerias + 1 , { //para contar o dia de hoje
                    weekends: false
                });
                this.diaFim = diaFim.toLocaleDateString('pt-BR');
                this.datafim = diaFim
            }
        },
        */

                
         calculoDiaFim() {
            if (this.dataInicioFerias && this.diasFerias) {
                const dataInicio = new Date(this.dataInicioFerias);
                const diasFerias = parseInt(this.diasFerias);

                // Adiciona os dias de férias à data de início
                const dataFim = new Date(dataInicio);
                this.datafim = dataFim.setDate(dataInicio.getDate() + diasFerias + 1);
                this.diaFim = dataFim.toLocaleDateString('pt-BR')
            }
        },
        
        //fazer depois check 
        /*
        checarAnoEmpresa(){
            const targetDate = new Date('2021-03-17');
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            if (targetDate.getTime() >= oneYearAgo.getTime()) {
            alert('One year has not passed yet');
            } else {
            alert('One year has passed');
            }
        }*/
    }
}

</script>

<style scoped>
p{
    color: #008D53;
    font-weight: bold;
    text-align: left;
}

input{
    margin-right: 5px;
}
</style>