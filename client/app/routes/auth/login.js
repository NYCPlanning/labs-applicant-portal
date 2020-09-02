import Route from '@ember/routing/route';

export default class AuthLoginRoute extends Route {
  queryParams = {
    loginEmail: {},
    isCityEmployee: {
      type: 'boolean',
    },
  };
}
