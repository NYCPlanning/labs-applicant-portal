import Route from "@ember/routing/route";

export default class InvoiceRoute extends Route {
  model({ id }) {
    console.log(id);

    return this.store.findRecord('invoice', id);
  }
}
