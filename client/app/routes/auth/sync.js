import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class AuthSyncRoute extends Route {
  @service
  session;

  queryParams = {
    to: {},
  };

  async model({ to }) {
    const { authenticated } = this.session.data;

    const contact = await this.store.findRecord('contact', authenticated.contactId);

    if (document.referrer.includes('/account/user/profile.htm?returnOnSave=true')) {
      await contact.save();

      this.transitionTo(to);
    }
  }
}
