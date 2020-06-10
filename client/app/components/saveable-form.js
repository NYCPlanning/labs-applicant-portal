import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class SaveableFormComponent extends Component {
  // TODO: Understand why this particular sequencing is necessary.
  // Can the callback happen afterwards?
  async saveChangeset(changeset, callback) {
    try {
      await changeset.execute();
      await callback();
      await changeset.rollback();
    } catch (error) {
      console.log('Save error:', error);
    }
  }

  @action
  validate(changeset) {
    changeset.validate();
  }
}
