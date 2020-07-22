import { Factory, trait } from 'ember-cli-mirage';
import { PACKAGE_STATUS, PACKAGE_VISIBILITY } from '../../optionsets/package';

export default Factory.extend({
  pasForm: trait({
    dcpPackagetype: 717170000,
    afterCreate(projectPackage, server) {
      // add a pasForm if it doesn't already exist
      // not sure which tests depend on this assumption
      // so adding logic for it here
      if (!projectPackage.pasForm) server.create('pas-form', { package: projectPackage });
    },
  }),

  rwcdsForm: trait({
    dcpPackagetype: 717170004,
    afterCreate(projectPackage, server) {
      if (!projectPackage.rwcdsForm) {
        server.create('rwcds-form', {
          package: projectPackage,
          // this field is set to true in the backend IF
          // there exists a 'ZR' dcpZoningresolutiontype and
          // that zoning resolution's dcpZrsectionnumber is 'Appendix F'
          dcpIncludezoningtextamendment: 717170000,
          affectedZoningResolutions: [
            server.create('affected-zoning-resolution', {
              dcpZoningresolutiontype: 'ZA',
              dcpZrsectionnumber: 'Section 74 7-11',
            }),
            server.create('affected-zoning-resolution', {
              dcpZoningresolutiontype: 'ZR',
              dcpZrsectionnumber: 'AppendixF',
            }),
          ],
        });
      }
    },
  }),

  withLandUseActions: trait({
    afterCreate(projectPackage, server) {
      server.create('pas-form', 'withLandUseActions', { package: projectPackage });
    },
  }),

  applicant: trait({
    statuscode(i) {
      const statuses = [
        PACKAGE_STATUS.PACKAGE_PREPARATION.code,
      ];

      return statuses[i % statuses.length];
    },

    dcpVisibility(i) {
      const visibility = [
        PACKAGE_VISIBILITY.APPLICANT_ONLY.code,
        PACKAGE_VISIBILITY.GENERAL_PUBLIC.code,
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
        PACKAGE_STATUS.CERTIFIED.code,
        PACKAGE_STATUS.FINAL_APPROVAL.code,
        PACKAGE_STATUS.REVIEWED_NO_REVISIONS_REQUIRED.code,
        PACKAGE_STATUS.REVIEWED_REVISIONS_REQUIRED.code,
        PACKAGE_STATUS.WITHDRAWN.code,
        PACKAGE_STATUS.SUBMITTED.code,
        PACKAGE_STATUS.UNDER_REVIEW.code,
      ];

      return statuses[i % statuses.length];
    },

    dcpVisibility(i) {
      const visibility = [
        PACKAGE_VISIBILITY.INTERNAL_DCP_ONLY.code,
        PACKAGE_VISIBILITY.CPC_ONLY.code,
        PACKAGE_VISIBILITY.APPLICANT_ONLY.code,
        PACKAGE_VISIBILITY.GENERAL_PUBLIC.code,
        PACKAGE_VISIBILITY.LUP.code,
      ];

      return visibility[i % visibility.length];
    },
  }),

  planningWithViewPASButton: trait({
    statuscode(i) {
      const statuses = [
        PACKAGE_STATUS.REVIEWED_NO_REVISIONS_REQUIRED.code,
        PACKAGE_STATUS.REVIEWED_REVISIONS_REQUIRED.code,
        PACKAGE_STATUS.SUBMITTED.code,
        PACKAGE_STATUS.UNDER_REVIEW.code,
      ];

      return statuses[i % statuses.length];
    },

    dcpVisibility(i) {
      const visibility = [
        PACKAGE_VISIBILITY.APPLICANT_ONLY.code,
        PACKAGE_VISIBILITY.GENERAL_PUBLIC.code,
      ];

      return visibility[i % visibility.length];
    },
  }),

  planningNoViewPASButton: trait({
    statuscode(i) {
      const statuses = [
        PACKAGE_STATUS.CERTIFIED.code,
        PACKAGE_STATUS.FINAL_APPROVAL.code,
        PACKAGE_STATUS.WITHDRAWN.code,
      ];

      return statuses[i % statuses.length];
    },

    dcpVisibility(i) {
      const visibility = [
        PACKAGE_VISIBILITY.INTERNAL_DCP_ONLY.code,
        PACKAGE_VISIBILITY.CPC_ONLY.code,
        PACKAGE_VISIBILITY.APPLICANT_ONLY.code,
        PACKAGE_VISIBILITY.GENERAL_PUBLIC.code,
        PACKAGE_VISIBILITY.LUP.code,
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
