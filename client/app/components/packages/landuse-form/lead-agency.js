import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class PackagesLanduseFormLeadAgencyComponent extends Component {
  @tracked chosenAccountName;

  get accountNames() {
    if (this.args.accounts) {
      return this.args.accounts.map((account) => account.name);
    } return [];
  }

  get searchPlaceholder() {
    if (this.args.landuseForm.data.leadAgency) {
      return this.args.landuseForm.data.leadAgency.name;
    } return 'Search agencies...';
  }

  get chosenAccountId() {
    const account = this.args.accounts.find((account) => account.name === this.chosenAccountName);
    return account.id;
  }
}
