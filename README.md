Gerenciador de Férias
Este é um projeto desenvolvido para permitir que gestores possam controlar com eficiência as férias dos colaboradores de cada time, tendo em vista a administração das entregas de cada equipe.

Resumo do Projeto
Levando em consideração que os gerentes dos times precisam atender as demandas inerentes às aplicações gerenciadas pelo seu time, é muito importante saber quando os seus colaboradores entrarão de férias para um melhor controle das entregas e cumprimento dos cronogramas.

Neste momento, torna-se essencial elaborar um sistema para controlar as férias dos colaboradores de cada time, tendo em vista a administração das entregas de cada time.

Visão da Solução do Projeto
A solução do projeto será uma aplicação web, onde os colaboradores poderão solicitar suas férias e os gestores terão acesso às informações sobre o período de férias de sua equipe.

Requisitos
RQ001 – Cadastrar funcionário, sendo ele CLT ou PJ.
RQ002 – Deve ser possível correlacionar os funcionários, informando quem é o seu gestor respectivamente.
RQ003 – O funcionário deve conseguir solicitar um agendamento de férias, com início e fim.
RQ004 – Seguindo as leis trabalhistas vigentes, o funcionário deverá ter a possibilidade de requerer a antecipação do 13º salário (somente para CLT).
RQ005 – O gestor deve conseguir visualizar todas as solicitações do seu time, aprovando ou reprovando um agendamento.
RQ006 – O perfil do gestor deve mostrar Dashboards com o cenário de férias agendadas.
RQ007 – O agendamento de férias somente será validado após a aprovação do gestor.
RQ008 – O sistema deve permitir a quantidade de dias que o funcionário pretende tirar (5, 10, 15, 20 ou 30 dias). Nenhum colaborador poderá tirar menos que 4 dias e pelo menos um dos períodos precisa ser de 15 dias.
RQ009 – As férias somente poderão ser solicitadas por colaboradores com um ano de empresa completos, ou seja, o colaborador somente poderá solicitar suas férias após seu primeiro aniversário de empresa.
RQ010 – O sistema deverá sinalizar que o colaborador está prestes a acumular período de férias, ou seja, nenhum colaborador poderá ficar dois anos consecutivos sem sair de férias. Isso deverá ser sinalizado para o seu gestor também.
RQ011 – O sistema deverá informar o colaborador quando passarem 11 meses do seu último período de férias gozados, não permitindo que vença o próximo período aquisitivo. Logo, o Funcionário terá 11 meses para fazer uma nova solicitação depois do seu último período.
RQ012 – Sempre que um colaborador agendar suas férias para aprovação, o gestor deverá ser notificado por e-mail.
RQ013 – Sempre que um colaborador tiver as férias aprovadas, a aplicação deverá marcar o compromisso na agenda do Gmail (caso o colaborador tenha conta), registrando na agenda um dia antes da sua saída e um dia antes do seu retorno. (PLUS).
RQ014 – Além do Dashboard, o gestor deverá emitir um relatório analítico em formato CSV ou XLSX com os dados inerentes à análise desejada.
RQ015 – Além da notificação por e-mail, a aplicação deverá enviar uma notificação por Workspace (Consumo de API do Workspace) – Python.
Tecnologias utilizadas
Node.js
Express
Sequelize
MySQL
Vue.js
Toastification
Axios
Python (para consumo de API do Workspace)
