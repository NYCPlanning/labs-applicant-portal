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
    }),
  ],
  dcpPleaseexplaintypeiienvreview: [
    validatePresenceIf({
      presence: true,
      on: 'dcpLanduseactiontype2',
      withValue: 717170000,
    }),
  ],
  dcpProjectareaindutrialzonename: [
    validatePresenceIf({
      presence: true,
      on: 'dcpProjectareaindustrialbusinesszone',
      withValue: true,
    }),
  ],
  dcpProjectarealandmarkname: [
    validatePresenceIf({
      presence: true,
      on: 'dcpIsprojectarealandmark',
      withValue: true,
    }),
  ],
  dcpProposeddevelopmentsiteotherexplanation: [
    validatePresenceIf({
      presence: true,
      on: 'dcpProposeddevelopmentsiteinfoother',
      withValue: true,
    }),
  ],
  dcpInclusionaryhousingdesignatedareaname: [
    validatePresenceIf({
      presence: true,
      on: 'dcpIsinclusionaryhousingdesignatedarea',
      withValue: true,
    }),
  ],
  dcpHousingunittype: [
    validatePresenceIf({
      presence: true,
      on: 'dcpDiscressionaryfundingforffordablehousing',
      withValue: 717170000,
    }),
  ],
};
