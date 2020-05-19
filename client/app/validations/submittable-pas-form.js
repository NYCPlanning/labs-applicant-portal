import SaveablePasForm from './saveable-pas-form';
import validatePresenceIf from '../validators/required-if-selected';
import validateNumberIf from '../validators/validate-number-if';

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
  dcpZoningauthorizationpursuantto: [
    validatePresenceIf({
      presence: true,
      on: 'dcpPfzoningauthorization',
      withValue: (target) => target !== null && target !== undefined,
      message: 'This field is required',
    }),
  ],
  dcpZoningauthorizationtomodify: [
    validatePresenceIf({
      presence: true,
      on: 'dcpPfzoningauthorization',
      withValue: (target) => target !== null && target !== undefined,
      message: 'This field is required',
    }),
  ],
  dcpZoningtomodify: [
    validatePresenceIf({
      presence: true,
      on: 'dcpPfzoningcertification',
      withValue: (target) => target !== null && target !== undefined,
      message: 'This field is required',
    }),
  ],
  dcpZoningpursuantto: [
    validatePresenceIf({
      presence: true,
      on: 'dcpPfzoningcertification',
      withValue: (target) => target !== null && target !== undefined,
      message: 'This field is required',
    }),
  ],
  dcpExistingmapamend: [
    validatePresenceIf({
      presence: true,
      on: 'dcpPfzoningmapamendment',
      withValue: 1,
      message: 'This field is required',
    }),
  ],
  dcpProposedmapamend: [
    validatePresenceIf({
      presence: true,
      on: 'dcpPfzoningmapamendment',
      withValue: 1,
      message: 'This field is required',
    }),
  ],
  dcpZoningspecialpermitpursuantto: [
    validatePresenceIf({
      presence: true,
      on: 'dcpPfzoningspecialpermit',
      withValue: (target) => target !== null && target !== undefined,
      message: 'This field is required',
    }),
  ],
  dcpZoningspecialpermittomodify: [
    validatePresenceIf({
      presence: true,
      on: 'dcpPfzoningspecialpermit',
      withValue: (target) => target !== null && target !== undefined,
      message: 'This field is required',
    }),
  ],
  dcpAffectedzrnumber: [
    validatePresenceIf({
      presence: true,
      on: 'dcpPfzoningtextamendment',
      withValue: 1,
      message: 'This field is required',
    }),
  ],
  dcpZoningresolutiontitle: [
    validatePresenceIf({
      presence: true,
      on: 'dcpPfzoningtextamendment',
      withValue: 1,
      message: 'This field is required',
    }),
  ],
  dcpPreviousulurpnumbers1: [
    validatePresenceIf({
      presence: true,
      on: 'dcpPfmodification',
      withValue: 1,
      message: 'This field is required',
    }),
  ],
  dcpPreviousulurpnumbers2: [
    validatePresenceIf({
      presence: true,
      on: 'dcpPfrenewal',
      withValue: 1,
      message: 'This field is required',
    }),
  ],
  dcpPfzoningauthorization: [
    validateNumberIf({
      on: 'dcpPfzoningauthorization',
      withValue: (target) => target !== null && target !== undefined,
      gte: 1,
      message: 'Number of actions must be greater than 0.',
    }),
  ],
  dcpPfzoningcertification: [
    validateNumberIf({
      on: 'dcpPfzoningcertification',
      withValue: (target) => target !== null && target !== undefined,
      gte: 1,
      message: 'Number of actions must be greater than 0.',
    }),
  ],
  dcpPfzoningspecialpermit: [
    validateNumberIf({
      on: 'dcpPfzoningspecialpermit',
      withValue: (target) => target !== null && target !== undefined,
      gte: 1,
      message: 'Number of actions must be greater than 0.',
    }),
  ],
};
