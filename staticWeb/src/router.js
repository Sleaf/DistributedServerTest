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
        },
        {
          name: 'orders',
          path: 'orders',
          component: resolve => require(['./views/index/orders'], resolve),
        },
        {
          name: 'BankOrders',
          path: 'BankOrders',
          component: resolve => require(['./views/index/BankOrders'], resolve),
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
