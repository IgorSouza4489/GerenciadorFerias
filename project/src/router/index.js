import { createRouter, createWebHistory } from 'vue-router'
import HelloWorld from '@/components/HelloWorld.vue'
import LoginPage from '@/components/LoginPage.vue'
import RegisterPage from '@/components/RegisterPage.vue'
import SolicitarPage from '@/components/SolicitarPage.vue'
import MinhasSolicitacoes from '@/components/MinhasSolicitacoes.vue'
import SolicitacaoEquipePage from '@/components/SolicitacaoEquipePage.vue'
import RegisterTimePage from '@/components/RegisterTimePage.vue'
import MeuTimePage from '@/components/MeuTimePage.vue'
import HomePage from '@/components/HomePage.vue'
import jwtDecode from 'jwt-decode'
import { useToast } from "vue-toastification";
const toast = useToast();

function checarLogin() {
  const token = localStorage.getItem('token')
  if (token) {
    const decodedToken = jwtDecode(token)
    if (decodedToken.exp < Date.now() / 1000) {
      toast.error("Sua sessão expirou, entre em sua conta de usuário para acessar as funcionalidades")
      return false
    } else {
      return true
    }
  } else {
    alert("Você não possui token")
    return false
  }
}

const routes = [
  {
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld

  },
  {
    path: '/MeuTimePage',
    name: 'MeuTimePage',
    component: MeuTimePage

  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage
  },

  {
    path: '/register',
    name: 'RegisterPage',
    component: RegisterPage
  },
  {
    path: '/HomePage',
    name: 'HomePage',
    component: HomePage,
    meta: {
      requiresAuth: true
    }

  },
  {
    path: '/solicitarferias',
    name: 'SolicitarFerias',
    component: SolicitarPage,
    meta: {
      requiresAuth: true
    }
    
  },
  {  path: '/registertime',
  name: 'RegisterTimePage',
  component: RegisterTimePage,
  meta: {
    requiresAuth: true
  }
  },
  {
    path: '/solicitacaoequipe',
    name: 'SolicitacaoEquipe',
    component: SolicitacaoEquipePage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/minhassolicitacoes',
    name: 'MinhasSolicitacoes',
    component: MinhasSolicitacoes,
    meta: {
      requiresAuth: true
    },
    

  }
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (checarLogin()) {
      next()
    } else {
      next('/')
    }
  } else {
    next()
  }
});

export default router