import Vue from 'vue';
import Vuex from 'vuex';
import WebSocket from 'ws';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    notificacoes: [],
  },
  mutations: {
    adicionarNotificacao(state, notificacao) {
      state.notificacao.push(notificacao);
    },
  },
  actions: {
    connectWebSocket(context) {
      const ws = new WebSocket('ws://localhost:8080');

      ws.on('open', () => {
        console.log('WebSocket ');
      });

      ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'notificacao') {
          context.commit('adicionarNotificacao', data.message);
        }
      });
    },
  },
});

export default store;