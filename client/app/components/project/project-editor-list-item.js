import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ProjectEditorListComponent extends Component {
  get canDelete() {
    return this.args.canDelete ?? false;
  }

  @tracked removeEditorModalOpen = false;

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
