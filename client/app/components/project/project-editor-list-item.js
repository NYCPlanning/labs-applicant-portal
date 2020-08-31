import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { optionset } from '../../helpers/optionset';

export default class ProjectEditorListComponent extends Component {
  get disableDelete() {
    return this.args.disableDelete ?? false;
  }

  @tracked removeEditorModalOpen = false;

  get isPrimaryApplicantOrContact() {
    const { role } = this.args;
    return role === optionset(['projectApplicant', 'applicantrole', 'code', 'PRIMARY_CONTACT'])
      || role === optionset(['projectApplicant', 'applicantrole', 'code', 'PRIMARY_APPLICANT']);
  }

  @action
  tryRemoveEditor() {
    this.removeEditorModalOpen = true;
  }

  @action
  async confirmRemoveEditor() {
    await this.args.onDelete();
    this.removeEditorModalOpen = false;
  }

  @action
  cancelRemoveEditor() {
    this.removeEditorModalOpen = false;
  }
}
