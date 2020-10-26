import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import fetch from 'fetch';
import ENV from '../../config/environment';

export default class ProjectPackageSectionComponent extends Component {
  @service
  session;

  @tracked
  isPaying = false;

  @tracked
  paymentLink;

  get payablePackage() {
    const [payablePackage] = this.args.packages.filter((pkg) => pkg.invoices.length > 0);

    return payablePackage;
  }

  @action
  async beginPayment() {
    this.isPaying = true;

    if (!this.paymentLink) {
      try {
        const response = await fetch(`${ENV.host}/packages/pay/${this.payablePackage.id}`, {
          headers: {
            Authorization: `Bearer ${this.session.data.authenticated.access_token}`,
          },
        });
        const paymentLink = await response.json();

        this.paymentLink = paymentLink.data.attributes['city-pay-url'];
      } catch (e) {
        alert(`
          Something went wrong generating the payment link. Please try again or contact DCP.

          ${e.toString()}
        `);
      }
    }
  }

  @action
  sum(acc, curr) {
    return acc + curr;
  }
}
