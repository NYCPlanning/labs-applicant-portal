import {
  validateLength,
} from 'ember-changeset-validations/validators';
import SaveableProjectForm from './saveable-project-form';

export default {
  ...SaveableProjectForm,

  artifactDocuments: [
    validateLength({
      min: 1,
      message: 'One or more document uploads is required.',
    }),
  ],
};
