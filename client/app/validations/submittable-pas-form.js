import SaveablePasForm from './saveable-pas-form';
import validatePresenceIf from '../validators/required-if-selected';

export default {
  ...SaveablePasForm,
  dcpRevisedprojectname: [
    ...SaveablePasForm.dcpRevisedprojectname,
  ],
  dcpUrbanareaname: [
    validatePresenceIf({
      presence: true,
      on: 'dcpUrbanrenewalarea',
      withValue: 717170000,
      message: 'This field is required',
    }),
  ],
  dcpPleaseexplaintypeiienvreview: [
    validatePresenceIf({
      presence: true,
      on: 'dcpLanduseactiontype2',
      withValue: 717170000,
      message: 'This field is required',
    }),
  ],
  dcpProjectareaindutrialzonename: [
    validatePresenceIf({
      presence: true,
      on: 'dcpProjectareaindustrialbusinesszone',
      withValue: true,
      message: 'This field is required',
    }),
  ],
  dcpProjectarealandmarkname: [
    validatePresenceIf({
      presence: true,
      on: 'dcpIsprojectarealandmark',
      withValue: true,
      message: 'This field is required',
    }),
  ],
  dcpProposeddevelopmentsiteotherexplanation: [
    validatePresenceIf({
      presence: true,
      on: 'dcpProposeddevelopmentsiteinfoother',
      withValue: true,
      message: 'This field is required',
    }),
  ],
  dcpInclusionaryhousingdesignatedareaname: [
    validatePresenceIf({
      presence: true,
      on: 'dcpIsinclusionaryhousingdesignatedarea',
      withValue: true,
      message: 'This field is required',
    }),
  ],
  dcpHousingunittype: [
    validatePresenceIf({
      presence: true,
      on: 'dcpDiscressionaryfundingforffordablehousing',
      withValue: 717170000,
      message: 'This field is required',
    }),
  ],
};
