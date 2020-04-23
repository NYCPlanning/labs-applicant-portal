import { Factory, trait } from 'ember-cli-mirage';

const PACKAGE_STATUS_CODES = {
  PACKAGE_PREPARATION: 'Package Preparation',
  CERTIFIED: 'Certified',
  FINAL_APPROVAL: 'Final Approval',
  REVIEWED_NO_REVISIONS_REQUIRED: 'Reviewed - No Revisions Required',
  REVIEWED_REVISIONS_REQUIRED: 'Reviewed - Revisions Required',
  WITHDRAWN: 'Withdrawn',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  MISTAKE: 'Mistake',
};

const PACKAGE_VISIBILITY_CODES = {
  INTERNAL_DCP_ONLY: 717170000,
  CPC_ONLY: 717170001,
  APPLICANT_ONLY: 717170002,
  GENERAL_PUBLIC: 717170003,
  LUP: 717170004,
};

export default Factory.extend({
  dcpPackagetype: 'PAS Package',

  applicant: trait({
    statuscode(i) {
      const statuses = [
        PACKAGE_STATUS_CODES.PACKAGE_PREPARATION,
      ];

      return statuses[i % statuses.length];
    },

    dcpVisibility(i) {
      const visibility = [
        PACKAGE_VISIBILITY_CODES.APPLICANT_ONLY,
        PACKAGE_VISIBILITY_CODES.GENERAL_PUBLIC,
      ];

      return visibility[i % visibility.length];
    },
  }),

  // Projects with General Public and Applicant Only packages
  // may still still show in "Working on It" list as long as
  // the package statuscode is not "Prepared"
  planning: trait({
    statuscode(i) {
      const statuses = [
        PACKAGE_STATUS_CODES.CERTIFIED,
        PACKAGE_STATUS_CODES.FINAL_APPROVAL,
        PACKAGE_STATUS_CODES.REVIEWED_NO_REVISIONS_REQUIRED,
        PACKAGE_STATUS_CODES.REVIEWED_REVISIONS_REQUIRED,
        PACKAGE_STATUS_CODES.WITHDRAWN,
        PACKAGE_STATUS_CODES.SUBMITTED,
        PACKAGE_STATUS_CODES.UNDER_REVIEW,
      ];

      return statuses[i % statuses.length];
    },

    dcpVisibility(i) {
      const visibility = [
        PACKAGE_VISIBILITY_CODES.INTERNAL_DCP_ONLY,
        PACKAGE_VISIBILITY_CODES.CPC_ONLY,
        PACKAGE_VISIBILITY_CODES.APPLICANT_ONLY,
        PACKAGE_VISIBILITY_CODES.GENERAL_PUBLIC,
        PACKAGE_VISIBILITY_CODES.LUP,
      ];

      return visibility[i % visibility.length];
    },
  }),

  planningWithViewPASButton: trait({
    statuscode(i) {
      const statuses = [
        PACKAGE_STATUS_CODES.REVIEWED_NO_REVISIONS_REQUIRED,
        PACKAGE_STATUS_CODES.REVIEWED_REVISIONS_REQUIRED,
        PACKAGE_STATUS_CODES.SUBMITTED,
        PACKAGE_STATUS_CODES.UNDER_REVIEW,
      ];

      return statuses[i % statuses.length];
    },

    dcpVisibility(i) {
      const visibility = [
        PACKAGE_VISIBILITY_CODES.APPLICANT_ONLY,
        PACKAGE_VISIBILITY_CODES.GENERAL_PUBLIC,
      ];

      return visibility[i % visibility.length];
    },
  }),

  planningNoViewPASButton: trait({
    statuscode(i) {
      const statuses = [
        PACKAGE_STATUS_CODES.CERTIFIED,
        PACKAGE_STATUS_CODES.FINAL_APPROVAL,
        PACKAGE_STATUS_CODES.WITHDRAWN,
      ];

      return statuses[i % statuses.length];
    },

    dcpVisibility(i) {
      const visibility = [
        PACKAGE_VISIBILITY_CODES.INTERNAL_DCP_ONLY,
        PACKAGE_VISIBILITY_CODES.CPC_ONLY,
        PACKAGE_VISIBILITY_CODES.APPLICANT_ONLY,
        PACKAGE_VISIBILITY_CODES.GENERAL_PUBLIC,
        PACKAGE_VISIBILITY_CODES.LUP,
      ];

      return visibility[i % visibility.length];
    },
  }),
});
