import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from "../views/auth/Login.vue"
import Perfil from "../views/admin/Perfil.vue"
import Usuario from "../views/admin/usuario/Usuario.vue"
import Blog from "../views/Blog.vue"
import AppLayout from "../layout/AppLayout.vue"
import SitioLayout from "../layout/SitioLayout.vue"
import CategoriaView from "../views/admin/categoria/Categoria.vue"
import Producto from "../views/admin/producto/Producto.vue"
import ListaPedido from "../views/admin/pedido/ListaPedido.vue"
import NuevoPedido from "../views/admin/pedido/NuevoPedido.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: SitioLayout,
      children: [
        {
          path: '/',
          name: 'home',
          component: HomeView
        },
        {
          path: '/about',
          name: 'about',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/AboutView.vue')
        },
        {
          path: '/ingresar',
          name: 'Login',
          component: Login,
          meta: {redirectIfAuth: true}
        },
        {
          path: '/blog',
          name: 'Blog',
          component: Blog
        },

      ]
    },
    {
      path: '/admin',
      component: AppLayout,
      children: [
        {
          path: 'perfil',
          name: 'Perfil',
          component: Perfil,
          meta: {requireAuth: true}
        },
        {
          path: 'usuario',
          name: 'Usuario',
          component: Usuario,
          meta: {requireAuth: true}
        },
        {
          path: 'categoria',
          name: 'Categoria',
          component: CategoriaView,
          meta: {requireAuth: true}
        },
        {
          path: 'producto',
          name: 'Producto',
          component: Producto,
          meta: {requireAuth: true}
        },
        {
          path: 'pedido',
          name: 'Pedido',
          component: ListaPedido,
          meta: {requireAuth: true}
        },
        {
          path: 'pedido/nuevo',
          name: 'NuevoPedido',
          component: NuevoPedido,
          meta: {requireAuth: true}
        },
      ]
    }
    
  ]
})

router.beforeEach((to, from, next) => {
  let token = localStorage.getItem("access_token");

  if(to.meta.requireAuth){
    if(!token)
      return next({name: 'Login'})
    return next()
  }

  if(to.meta.redirectIfAuth && token) {
    return next({name: 'Perfil'})
  }

  return next()

})

export default router
