import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import window from 'ember-window-mock';

export default class AuthSyncRoute extends Route {
  @service
  session;

  queryParams = {
    to: {},
  };

  async model({ to = '/' }) {
    const { authenticated } = this.session.data;

    const contact = await this.store.findRecord('contact', authenticated.contactId);

    if (window.document.referrer.includes('nyc.gov')) {
      await contact.save();
    }

    this.transitionTo(to);
  }
}
