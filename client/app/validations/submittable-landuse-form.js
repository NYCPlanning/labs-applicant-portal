import {
  validateLength,
} from 'ember-changeset-validations/validators';
import SaveableLanduseForm from './saveable-landuse-form';
import validatePresenceIf from '../validators/required-if-selected';

export default {
  ...SaveableLanduseForm,
  dcpBoroughs: [
    ...SaveableLanduseForm.dcpBoroughs,
    validatePresenceIf({
      presence: true,
      on: 'dcpEntiretyboroughs',
      withValue: true,
      message: 'This field is required',
    }),
  ],
  dcpCommunity: [
    ...SaveableLanduseForm.dcpCommunity,
    validatePresenceIf({
      presence: true,
      on: 'dcpEntiretycommunity',
      withValue: true,
      message: 'This field is required',
    }),
  ],
  dcpDevsize: [
    validatePresenceIf({
      presence: true,
      on: 'dcp500kpluszone',
      withValue: true,
      message: 'This field is required',
    }),
  ],
  dcpSitedataidentifylandmark: [
    ...SaveableLanduseForm.dcpSitedataidentifylandmark,
    validatePresenceIf({
      presence: true,
      on: 'dcpSitedatasiteisinnewyorkcity',
      withValue: true,
      message: 'This field is required',
    }),
  ],
  dcpFrom: [
    ...SaveableLanduseForm.dcpFrom,
    // TODO: Debug why we can't use
    // import LANDUSE_FORM_OPTIONSETS from '../optionsets/landuse-form';
    // ...
    // withValue: LANDUSE_FORM_OPTIONSETS.DCPMANNEROFDISPOSITION.DIRECT,
    validatePresenceIf({
      presence: true,
      on: 'dcpMannerofdisposition',
      withValue: 717170001,
      message: 'This field is required',
    }),
  ],
  dcpTo: [
    ...SaveableLanduseForm.dcpTo,
    // TODO: Debug why we can't use
    // import LANDUSE_FORM_OPTIONSETS from '../optionsets/landuse-form';
    // ...
    // withValue: LANDUSE_FORM_OPTIONSETS.DCPMANNEROFDISPOSITION.DIRECT,
    validatePresenceIf({
      presence: true,
      on: 'dcpMannerofdisposition',
      withValue: 717170001,
      message: 'This field is required',
    }),
  ],
  applicants: [
    validateLength({
      min: 1,
      message: 'One or more applicant team members is required.',
    }),
  ],
};
