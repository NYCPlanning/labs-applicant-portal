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

// Note: It's better to create packages through a
// project
export default Factory.extend({
  dcpPackagetype: 'PAS Package',

  afterCreate(projectPackage, server) {
    server.create('pas-form', { package: projectPackage });
  },

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

  withLandUseActions: trait({
    afterCreate(projectPackage, server) {
      server.create('pas-form', 'withLandUseActions', { package: projectPackage });
    },
  }),


  withRadioButtonAnswers: trait({
    afterCreate(projectPackage, server) {
      server.create('pas-form', 'withRadioButtonAnswers', { package: projectPackage });
    },
  }),

  withExistingDocuments: trait({
    documents: [
      {
        name: 'PAS Form.pdf',
        // TODO: Format that this is the final serialized
        // format of the "timeCreated" property
        timeCreated: '2020-04-23T22:35:30Z',
        id: '59fbf112-71a5-4af5-b20a-a746g08c4c6p',
      },
      {
        name: 'Action Changes.excel',
        timeCreated: '2020-02-21T22:25:10Z',
        id: 'f0f2f3a3-3936-499b-8f37-a9827a1c14f2',
      },
    ],
  }),
});
