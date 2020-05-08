import {
  validatePresence,
} from 'ember-changeset-validations/validators';
import SaveablePasForm from './saveable-pas-form';

export default {
  ...SaveablePasForm,
  dcpRevisedprojectname: [
    ...SaveablePasForm.dcpRevisedprojectname,
    validatePresence(true),
  ],
};
