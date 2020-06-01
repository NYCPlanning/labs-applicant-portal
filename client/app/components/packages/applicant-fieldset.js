import Component from '@glimmer/component';
import { action } from '@ember/object';
import { STATE_OPTIONSET } from '../../models/applicant';
import SaveableApplicantFormValidations from '../../validations/saveable-applicant-form';
import SubmittableApplicantFormValidations from '../../validations/submittable-applicant-form';

export default class ApplicantFieldset extends Component {
  saveableApplicantFormValidations = SaveableApplicantFormValidations;

  submittableApplicantFormValidations = SubmittableApplicantFormValidations;

  get stateOptions() {
    return Object.values(STATE_OPTIONSET).map((option) => option.code);
  }

  // syncs radio input toggle to Ember model
  // TODO: Refactor this to engage with Changeset, when changesets are
  // introduced for applicant, BBls.
  @action
  updateAttr(currentObject, attr, newVal) {
    currentObject[attr] = newVal;
  }
}
