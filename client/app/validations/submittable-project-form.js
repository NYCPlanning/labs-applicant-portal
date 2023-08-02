import {
  validatePresence,
} from 'ember-changeset-validations/validators';
import SaveableProjectForm from './saveable-project-form';

export default {
  ...SaveableProjectForm,
  dcpNumberofnewdwellingunits: [
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
  dcpIncrementhousingunits: [
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
  dcpActionaffordabledwellingunits: [
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
  dcpIncrementalaffordabledwellingunits: [
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
  dcpResidentialsqft: [
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
  dcpNewcommercialsqft: [
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
  dcpNewindustrialsqft: [
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
  dcpNewcommunityfacilitysqft: [
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
};
