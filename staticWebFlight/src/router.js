const RouterConfig = {
  // mode: 'history',
  routes: [
    {
      name: 'index',
      path: '/',
      component: resolve => require(['./views/index/layout'], resolve),
      children: [
        {
          name: 'flights',
          path: 'flights',
          component: resolve => require(['./views/index/flights'], resolve),
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: resolve => require(['./views/entry/login'], resolve)
    },
    {
      name: 'register',
      path: '/register',
      component: resolve => require(['./views/entry/register'], resolve)
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
};
export default RouterConfig;
