import { Factory, trait } from 'ember-cli-mirage';
import {
  STATUSCODE,
  DCPVISIBILITY,
} from '../../optionsets/package';

export default Factory.extend({
  dcpStatusdate: new Date('December 17, 1995 03:24:00'),

  dcpPackagenotes: 'Some instructions from Planners',

  dcpPackageversion(i) {
    const SAMPLE_VERSIONS = [
      1,
      2,
      3,
    ];

    return SAMPLE_VERSIONS[i % SAMPLE_VERSIONS.length];
  },

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

  landuseForm: trait({
    dcpPackagetype: 717170001,
    afterCreate(projectPackage, server) {
      if (!projectPackage.landuseForm) {
        server.create('landuse-form', {
          package: projectPackage,
          landuseActions: [
            server.create('landuse-action', {
              dcpActioncode: 'ZC',
            }),
            server.create('landuse-action', {
              dcpActioncode: 'ZA',
            }),
            server.create('landuse-action', {
              dcpActioncode: 'MM',
            }),
          ],
        });
      }
    },
  }),

  draftEas: trait({
    dcpPackagetype: 717170002,
  }),

  withLandUseActions: trait({
    afterCreate(projectPackage, server) {
      server.create('pas-form', 'withLandUseActions', { package: projectPackage });
    },
  }),

  toDo: trait({
    statuscode(i) {
      const statuses = [
        STATUSCODE.PACKAGE_PREPARATION.code,
      ];

      return statuses[i % statuses.length];
    },

    dcpVisibility(i) {
      const visibility = [
        DCPVISIBILITY.APPLICANT_ONLY.code,
        DCPVISIBILITY.GENERAL_PUBLIC.code,
      ];

      return visibility[i % visibility.length];
    },
  }),

  // Projects with General Public and Applicant Only packages
  // may still still show in "Other Projects" list as long as
  // the package statuscode is not "Prepared"
  done: trait({
    statuscode(i) {
      const statuses = [
        STATUSCODE.CERTIFIED.code,
        STATUSCODE.FINAL_APPROVAL.code,
        STATUSCODE.REVIEWED_NO_REVISIONS_REQUIRED.code,
        STATUSCODE.REVIEWED_REVISIONS_REQUIRED.code,
        STATUSCODE.WITHDRAWN.code,
        STATUSCODE.SUBMITTED.code,
        STATUSCODE.UNDER_REVIEW.code,
      ];

      return statuses[i % statuses.length];
    },

    dcpVisibility(i) {
      const visibility = [
        DCPVISIBILITY.INTERNAL_DCP_ONLY.code,
        DCPVISIBILITY.CPC_ONLY.code,
        DCPVISIBILITY.APPLICANT_ONLY.code,
        DCPVISIBILITY.GENERAL_PUBLIC.code,
        DCPVISIBILITY.LUP.code,
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
