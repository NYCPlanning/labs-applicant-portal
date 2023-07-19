import {
  validateLength,
  validateNumber,
  validatePresence,
} from 'ember-changeset-validations/validators';
import SaveableProjectForm from './saveable-project-form';

export default {
  ...SaveableProjectForm,
  dcpNumberofnewdwellingunits: [ // start
    validateLength({
      min: 0,
      max: 10,
      message: 'Text is too long (max {max} characters)',
    }),
    validateNumber({
      integer: true,
      message: ' Must be a number',
    }),
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
  dcpIncrementhousingunits: [
    validateLength({
      min: 0,
      max: 10,
      message: 'Text is too long (max {max} characters)',
    }),
    validateNumber({
      integer: true,
      message: 'Must be a number',
    }),
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
  dcpActionaffordabledwellingunits: [
    validateLength({
      min: 0,
      max: 10,
      message: 'Text is too long (max {max} characters)',
    }),
    validateNumber({
      integer: true,
      message: 'Must be a number',
    }),
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
  dcpIncrementalaffordabledwellingunits: [
    validateLength({
      min: 0,
      max: 10,
      message: 'Text is too long (max {max} characters)',
    }),
    validateNumber({
      integer: true,
      message: 'Must be a number',
    }),
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
  dcpResidentialsqft: [
    validateLength({
      min: 0,
      max: 10,
      message: 'Text is too long (max {max} characters)',
    }),
    validateNumber({
      integer: true,
      message: 'Must be a number',
    }),
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
  dcpNewcommercialsqft: [
    validateLength({
      min: 0,
      max: 10,
      message: 'Text is too long (max {max} characters)',
    }),
    validateNumber({
      integer: true,
      message: 'Must be a number',
    }),
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
  dcpNewindustrialsqft: [
    validateLength({
      min: 0,
      max: 10,
      message: 'Text is too long (max {max} characters)',
    }),
    validateNumber({
      integer: true,
      message: 'Must be a number',
    }),
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
  dcpNewcommunityfacilitysqft: [
    validateLength({
      min: 0,
      max: 10,
      message: 'Text is too long (max {max} characters)',
    }),
    validateNumber({
      integer: true,
      message: 'Must be a number',
    }),
    validatePresence({
      presence: true,
      message: 'This field is required',
    }),
  ],
};
