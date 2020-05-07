import {
  validatePresence,
  validateLength,
} from 'ember-changeset-validations/validators';

export default {
  dcpRevisedprojectname: [
    validatePresence(true),
    validateLength({ min: 4 })
  ],
};