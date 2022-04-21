import {
  validateLength,
} from 'ember-changeset-validations/validators';

// These validate the fields for _saving_ to the server
// REMEMBER: You still need to manually update "maxlength"
// attributes for TextArea and TextInput components in the
// templates (in addition to the `max` attribute in the
// validateLength validators here).
export default {
  dcpDescribethewithactionscenario: [
    validateLength({
      min: 0,
      max: 1500,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpRationalbehindthebuildyear: [
    validateLength({
      min: 0,
      max: 2400,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpWhichactionsfromotheragenciesaresought: [
    validateLength({
      min: 0,
      max: 2400,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpProposedprojectdevelopmentdescription: [
    validateLength({
      min: 0,
      max: 2400,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpProjectsitedescription: [
    validateLength({
      min: 0,
      max: 2400,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpSitehistory: [
    validateLength({
      min: 0,
      max: 600,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpPurposeandneedfortheproposedaction: [
    validateLength({
      min: 0,
      max: 1500,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpDescribethenoactionscenario: [
    validateLength({
      min: 0,
      max: 1500,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpRwcdsexplanation: [
    validateLength({
      min: 0,
      max: 2400,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpHowdidyoudeterminethenoactionscenario: [
    validateLength({
      min: 0,
      max: 600,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpName: [
    validateLength({
      min: 0,
      max: 50,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpHowdidyoudeterminethiswithactionscena: [
    validateLength({
      min: 0,
      max: 600,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
  dcpBuildyear: [
    validateLength({
      min: 0,
      max: 4,
      message: 'Number is too long (max {max} characters)',
    }),
  ],
  dcpDevelopmentsiteassumptions: [
    validateLength({
      min: 0,
      max: 2400,
      message: 'Text is too long (max {max} characters)',
    }),
  ],
};
