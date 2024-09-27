import {
  validatePresence,
} from 'ember-changeset-validations/validators';
import SaveableProjectForm from './saveable-project-form';


export default {
  ...SaveableProjectForm,
  dcpProjectname: [
    ...SaveableProjectForm.dcpProjectname,
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
};
