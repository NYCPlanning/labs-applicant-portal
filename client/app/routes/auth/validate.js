import Route from '@ember/routing/route';

export default class AuthValidateRoute extends Route {
  queryParams = {
    loginEmail: {},
  };
}
