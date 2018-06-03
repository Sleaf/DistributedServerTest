const RouterConfig = {
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: resolve => require(['./views/index'], resolve)
    },
    {
      path: '/login',
      name: 'index',
      component: resolve => require(['./views/entry/login'], resolve)
    },
    {
      path: '/register',
      name: 'index',
      component: resolve => require(['./views/entry/register'], resolve)
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
};
export default RouterConfig;
