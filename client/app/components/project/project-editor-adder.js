import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { addToHasMany, removeFromHasMany } from '../../../utils/ember-changeset';

export default class ProjectProjectEditorAdderComponent extends Component {
  @action
  removeSelectedAction(actionToRemove) {
    const { pasForm } = this.args;

    // reset all model attributes
    pasForm[actionToRemove.countField] = null;
    pasForm[actionToRemove.attr1] = '';
    pasForm[actionToRemove.attr2] = '';

    this.actionsAddedByUser.removeObject(actionToRemove);
    this._selectedActions.removeObject(actionToRemove);
  }
}
