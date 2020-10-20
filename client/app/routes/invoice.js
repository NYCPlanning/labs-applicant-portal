import Route from '@ember/routing/route';

export default class InvoiceRoute extends Route {
  model({ id }) {
    return this.store.findRecord('invoice', id);
  }
}
