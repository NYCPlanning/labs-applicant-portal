import Component from '@glimmer/component';
import { action } from '@ember/object';
import { STATE_OPTION_SET } from '../../models/applicant';

export default class ApplicantFieldset extends Component {
  get stateOptions() {
    return Object.values(STATE_OPTION_SET);
  }

  // TODO: Use a global helper instead after writing
  // unified optionset handling
  get stateLabelLookup() {
    return this.stateOptions.reduce(
      (accumulator, option) => ({
        [option.code]: option,
        ...accumulator,
      }), { },
    );
  }

  // TODO: Refactor this to engage with Changeset, when changesets are
  // introduced for applicant, BBls.
  @action
  updateAttrWithOption(currentObject, attr, { code: optionCode }) {
    this.updateAttr(currentObject, attr, optionCode);
  }

  // syncs radio input toggle to Ember model
  @action
  updateAttr(currentObject, attr, newVal) {
    currentObject[attr] = newVal;
  }
}
