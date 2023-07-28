import {
  validateLength,
  validatePresence,
} from 'ember-changeset-validations/validators';
import SaveablePackage from './saveable-package';

export default {
  ...SaveablePackage,
  documents: [
    validateLength({
      min: 1,
      message: 'One or more document uploads is required.',
    }),
  ],
   dcpNumberofnewdwellingunits: [ // start
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
