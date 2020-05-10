import {
  validateLength,
} from 'ember-changeset-validations/validators';
import SaveablePasForm from './saveable-pas-form';

export default {
  ...SaveablePasForm,
  dcpRevisedprojectname: [
    validateLength({
      max: 5,
      min: 4,
      message: 'Name must be between {min} and {max} characters',
    }),
  ],
};
