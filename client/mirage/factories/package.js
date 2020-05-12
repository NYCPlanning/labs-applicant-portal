import { Factory, trait } from 'ember-cli-mirage';
import { PACKAGE_STATUS_CODES, PACKAGE_VISIBILITY_CODES } from '../../models/package';

export default Factory.extend({
  dcpPackagetype: 'PAS Package',

  afterCreate(projectPackage, server) {
    server.create('pas-form', { package: projectPackage });
  },

  withLandUseActions: trait({
    afterCreate(projectPackage, server) {
      server.create('pas-form', 'withLandUseActions', { package: projectPackage });
    },
  }),

  applicant: trait({
    statuscode(i) {
      const statuses = [
        PACKAGE_STATUS_CODES.PACKAGE_PREPARATION.code,
      ];

      return statuses[i % statuses.length];
    },

    dcpVisibility(i) {
      const visibility = [
        PACKAGE_VISIBILITY_CODES.APPLICANT_ONLY.code,
        PACKAGE_VISIBILITY_CODES.GENERAL_PUBLIC.code,
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
        PACKAGE_STATUS_CODES.CERTIFIED.code,
        PACKAGE_STATUS_CODES.FINAL_APPROVAL.code,
        PACKAGE_STATUS_CODES.REVIEWED_NO_REVISIONS_REQUIRED.code,
        PACKAGE_STATUS_CODES.REVIEWED_REVISIONS_REQUIRED.code,
        PACKAGE_STATUS_CODES.WITHDRAWN.code,
        PACKAGE_STATUS_CODES.SUBMITTED.code,
        PACKAGE_STATUS_CODES.UNDER_REVIEW.code,
      ];

      return statuses[i % statuses.length];
    },

    dcpVisibility(i) {
      const visibility = [
        PACKAGE_VISIBILITY_CODES.INTERNAL_DCP_ONLY.code,
        PACKAGE_VISIBILITY_CODES.CPC_ONLY.code,
        PACKAGE_VISIBILITY_CODES.APPLICANT_ONLY.code,
        PACKAGE_VISIBILITY_CODES.GENERAL_PUBLIC.code,
        PACKAGE_VISIBILITY_CODES.LUP.code,
      ];

      return visibility[i % visibility.length];
    },
  }),

  planningWithViewPASButton: trait({
    statuscode(i) {
      const statuses = [
        PACKAGE_STATUS_CODES.REVIEWED_NO_REVISIONS_REQUIRED.code,
        PACKAGE_STATUS_CODES.REVIEWED_REVISIONS_REQUIRED.code,
        PACKAGE_STATUS_CODES.SUBMITTED.code,
        PACKAGE_STATUS_CODES.UNDER_REVIEW.code,
      ];

      return statuses[i % statuses.length];
    },

    dcpVisibility(i) {
      const visibility = [
        PACKAGE_VISIBILITY_CODES.APPLICANT_ONLY.code,
        PACKAGE_VISIBILITY_CODES.GENERAL_PUBLIC.code,
      ];

      return visibility[i % visibility.length];
    },
  }),

  planningNoViewPASButton: trait({
    statuscode(i) {
      const statuses = [
        PACKAGE_STATUS_CODES.CERTIFIED.code,
        PACKAGE_STATUS_CODES.FINAL_APPROVAL.code,
        PACKAGE_STATUS_CODES.WITHDRAWN.code,
      ];

      return statuses[i % statuses.length];
    },

    dcpVisibility(i) {
      const visibility = [
        PACKAGE_VISIBILITY_CODES.INTERNAL_DCP_ONLY.code,
        PACKAGE_VISIBILITY_CODES.CPC_ONLY.code,
        PACKAGE_VISIBILITY_CODES.APPLICANT_ONLY.code,
        PACKAGE_VISIBILITY_CODES.GENERAL_PUBLIC.code,
        PACKAGE_VISIBILITY_CODES.LUP.code,
      ];

      return visibility[i % visibility.length];
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
