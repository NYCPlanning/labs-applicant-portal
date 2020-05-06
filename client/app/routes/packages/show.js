import Route from '@ember/routing/route';

export default class PackagesShowRoute extends Route {
  model(params) {
    return this.store.findRecord('package', params.id, {
      reload: true,
      include: 'pasForm',
    });
  }
}
