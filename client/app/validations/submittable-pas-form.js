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
  dcp_pleaseexplaintypeiienvreview: [
    validatePresenceIf({
      presence: true,
      on: 'dcpLanduseactiontype2',
      withValue: 717170000,
    }),
  ],
  dcp_projectareaindutrialzonename: [
    validatePresenceIf({
      presence: true,
      on: 'dcpProjectareaindustrialbusinesszone',
      withValue: true,
    }),
  ],
  dcp_projectarealandmarkname: [
    validatePresenceIf({
      presence: true,
      on: 'dcpIsprojectarealandmark',
      withValue: true,
    }),
  ],
  dcp_proposeddevelopmentsiteotherexplanation: [
    validatePresenceIf({
      presence: true,
      on: 'dcpProposeddevelopmentsiteinfoother',
      withValue: true,
    }),
  ],
  dcp_inclusionaryhousingdesignatedareaname: [
    validatePresenceIf({
      presence: true,
      on: 'dcpIsinclusionaryhousingdesignatedarea',
      withValue: true,
    }),
  ],
  dcp_housingunittype: [
    validatePresenceIf({
      presence: true,
      on: 'dcpDiscressionaryfundingforffordablehousing',
      withValue: 717170000,
    }),
  ],
};
