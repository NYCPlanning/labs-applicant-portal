import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class PackagesLanduseFormLeadAgencyComponent extends Component {
  @tracked chosenAccountName = this.args.landuseForm.data.leadAgency
    ? this.args.landuseForm.data.leadAgency.name
    : null;

  get accountNames() {
    if (this.args.accounts) {
      return this.args.accounts.map((account) => account.name);
    }
    return [];
  }

  get chosenAccountId() {
    const account = this.args.accounts.find(
      (account) => account.name === this.chosenAccountName,
    );
    return account ? account.id : null;
  }

  @action
  clearDropdown(landuseFormData) {
    this.chosenAccountName = null;
    landuseFormData.chosenLeadAgencyId = null;
    landuseFormData.leadAgency = null;
  }
}
