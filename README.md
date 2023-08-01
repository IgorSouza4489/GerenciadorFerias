<h1>Gerenciador de Férias</h1>

<p>Este é um projeto desenvolvido durante o estágio na empresa LOJAS QUERO-QUERO S/A para sanar uma problemática de gerenciamento de férias de funcionários em times.
  <br><br>Esse projeto me permitiu passar para a próxima etapa do programa de estágio, todo e qualquer código aqui foi postado com permissão do gestor.
</p>

<h2>Resumo do Projeto</h2>

<p>Levando em consideração que os gerentes dos times precisam atender as demandas inerentes às aplicações gerenciadas pelo seu time, é muito importante saber quando os seus colaboradores entrarão de férias para um melhor controle das entregas e cumprimento dos cronogramas.</p>

<p>Neste momento, torna-se essencial elaborar um sistema para controlar as férias dos colaboradores de cada time, tendo em vista a administração das entregas de cada time.</p>

<h2>Visão da Solução do Projeto</h2>

<p>A solução do projeto será uma aplicação web, onde os colaboradores poderão solicitar suas férias e os gestores terão acesso às informações sobre o período de férias de sua equipe.</p>

<h2>Requisitos</h2>

<ul>
  <li>RQ001 – Cadastrar funcionário, sendo ele CLT ou PJ.</li>
  <li>RQ002 – Deve ser possível correlacionar os funcionários, informando quem é o seu gestor respectivamente.</li>
  <li>RQ003 – O funcionário deve conseguir solicitar um agendamento de férias, com início e fim.</li>
  <li>RQ004 – Seguindo as leis trabalhistas vigentes, o funcionário deverá ter a possibilidade de requerer a antecipação do 13º salário (somente para CLT).</li>
  <li>RQ005 – O gestor deve conseguir visualizar todas as solicitações do seu time, aprovando ou reprovando um agendamento.</li>
  <li>RQ006 – O perfil do gestor deve mostrar Dashboards com o cenário de férias agendadas.</li>
  <li>RQ007 – O agendamento de férias somente será validado após a aprovação do gestor.</li>
  <li>RQ008 – O sistema deve permitir a quantidade de dias que o funcionário pretende tirar (5, 10, 15, 20 ou 30 dias). Nenhum colaborador poderá tirar menos que 4 dias e pelo menos um dos períodos precisa ser de 15 dias.</li>
  <li>RQ009 – As férias somente poderão ser solicitadas por colaboradores com um ano de empresa completos, ou seja, o colaborador somente poderá solicitar suas férias após seu primeiro aniversário de empresa.</li>
  <li>RQ010 – O sistema deverá sinalizar que o colaborador está prestes a acumular período de férias, ou seja, nenhum colaborador poderá ficar dois anos consecutivos sem sair de férias. Isso deverá ser sinalizado para o seu gestor também.</li>
  <li>RQ011 – O sistema deverá informar o colaborador quando passarem 11 meses do seu último período de férias gozados, não permitindo que vença o próximo período aquisitivo. Logo, o Funcionário terá 11 meses para fazer uma nova solicitação depois do seu último período.</li>
  <li>RQ012 – Sempre que um colaborador agendar suas férias para aprovação, o gestor deverá ser notificado por e-mail.</li>
  <li>RQ013 – Sempre que um colaborador tiver as férias aprovadas, a aplicação deverá marcar o compromisso na agenda do Gmail (caso o colaborador tenha conta), registrando na agenda um dia antes da sua saída e um dia antes do seu retorno. (PLUS).</li>
  <li>RQ014 – Além do Dashboard, o gestor deverá emitir um relatório analítico em formato CSV ou XLSX com os dados inerentes à análise desejada.</li>
  <li>RQ015 – Além da notificação por e-mail, a aplicação deverá enviar uma notificação por Workspace (Consumo de API do Workspace) – Python.</li>
</ul>

<h2>Tecnologias utilizadas</h2>

<ul>
<li>Node.js</li>
<li>Express</li>
<li>Sequelize</li>
<li>MySQL</li>
<li>Vue.js</li>
<li>Toastification</li>
<li>ChartJs</li>
<li>Axios</li>
<li>Python (para consumo de API do Workspace e Envio de email, backend em python não foi commitado para o github)</li>
</ul>
<br>
<br>
![image](https://github.com/IgorSouza4489/GerenciadorFeriasEstagio/assets/63150786/fbf02df1-f444-42aa-9b5d-8e3211e749ab)
<br><br>

![image](https://github.com/IgorSouza4489/GerenciadorFeriasEstagio/assets/63150786/05c46939-6806-4b86-8539-ad262329bff9)


Arquivos de configuração de banco e .env com gitignore<br>
<br>gitlab<br>
https://gitlab.com/lokaiextreme
