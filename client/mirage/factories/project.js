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
  statuscode: 'Active', // default project statuscode

  dcpProjectname(i) {
    const SAMPLE_NAMES = [
      'Huge New Public Library',
      'Bagel Factory',
      '123 Ember Avenue',
      'Arizona Sun Dog Kennel',
      'All Things Blue For You Merch',
      'Pop Up Palm Tree & Goat Farm'];

    return SAMPLE_NAMES[i % SAMPLE_NAMES.length];
  },

  dcpApplicantCustomerValue(i) {
    const SAMPLE_CUSTOMERS = [
      'Brandyn Friedly',
      'Godfrey Yeung',
      'Matt Gardner',
      'Taylor McGinnis',
      'Hannah Kates',
      'Nneka Sobers',
    ];

    return SAMPLE_CUSTOMERS[i % SAMPLE_CUSTOMERS.length];
  },

  applicant: trait({
    dcpDcpProjectDcpPackageProject(i) {
      const statuses = [
        PACKAGE_STATUS_CODES.PACKAGE_PREPARATION,
      ];
      const visibility = [
        PACKAGE_VISIBILITY_CODES.APPLICANT_ONLY,
        PACKAGE_VISIBILITY_CODES.GENERAL_PUBLIC,
      ];

      return [
        {
          id: `applicant-${i}`,
          'dcp-packagetype': 'PAS Package',
          statuscode: statuses[i % statuses.length],
          'dcp-visibility': visibility[i % visibility.length],
        },
      ];
    },
  }),

  // These can be either projects with or without a View PAS button
  planning: trait({
    dcpDcpProjectDcpPackageProject(i) {
      const statuses = [
        PACKAGE_STATUS_CODES.CERTIFIED,
        PACKAGE_STATUS_CODES.FINAL_APPROVAL,
        PACKAGE_STATUS_CODES.REVIEWED_NO_REVISIONS_REQUIRED,
        PACKAGE_STATUS_CODES.REVIEWED_REVISIONS_REQUIRED,
        PACKAGE_STATUS_CODES.WITHDRAWN,
        PACKAGE_STATUS_CODES.SUBMITTED,
        PACKAGE_STATUS_CODES.UNDER_REVIEW,
      ];

      // Projects with General Public and Applicant Only packages
      // may still still show in "Working on It" list as long as
      // the package statuscode is not "Prepared"
      const visibility = [
        PACKAGE_VISIBILITY_CODES.INTERNAL_DCP_ONLY,
        PACKAGE_VISIBILITY_CODES.CPC_ONLY,
        PACKAGE_VISIBILITY_CODES.APPLICANT_ONLY,
        PACKAGE_VISIBILITY_CODES.GENERAL_PUBLIC,
        PACKAGE_VISIBILITY_CODES.LUP,
      ];

      return [
        {
          id: `planning-${i}`,
          'dcp-packagetype': 'PAS Package',
          // allows us to have an evenly distributed
          // # of projects with these statuses. e.g.
          // this.server.createList('project', 'planning', 10)
          // ^ 5 will be WITHDRAWN, 6 will be SUBMITTED
          statuscode: statuses[i % statuses.length],
          'dcp-visibility': visibility[i % visibility.length],
        },
      ];
    },
  }),

  planningWithViewPASButton: trait({
    dcpDcpProjectDcpPackageProject(i) {
      const statuses = [
        PACKAGE_STATUS_CODES.REVIEWED_NO_REVISIONS_REQUIRED,
        PACKAGE_STATUS_CODES.REVIEWED_REVISIONS_REQUIRED,
        PACKAGE_STATUS_CODES.SUBMITTED,
        PACKAGE_STATUS_CODES.UNDER_REVIEW,
      ];
      const visibility = [
        PACKAGE_VISIBILITY_CODES.APPLICANT_ONLY,
        PACKAGE_VISIBILITY_CODES.GENERAL_PUBLIC,
      ];

      return [
        {
          id: `planningWithViewPASButton-${i}`,
          'dcp-packagetype': 'PAS Package',
          statuscode: statuses[i % statuses.length],
          'dcp-visibility': visibility[i % visibility.length],
        },
      ];
    },
  }),

  // A "View PAS" button does not show up as long it is not
  // BOTH submitted/under review/reviewed* and visible to
  // applicant only/general public
  planningNoViewPASButton: trait({
    dcpDcpProjectDcpPackageProject(i) {
      const statuses = [
        PACKAGE_STATUS_CODES.CERTIFIED,
        PACKAGE_STATUS_CODES.FINAL_APPROVAL,
        PACKAGE_STATUS_CODES.WITHDRAWN,
      ];
      const visibility = [
        PACKAGE_VISIBILITY_CODES.INTERNAL_DCP_ONLY,
        PACKAGE_VISIBILITY_CODES.CPC_ONLY,
        PACKAGE_VISIBILITY_CODES.APPLICANT_ONLY,
        PACKAGE_VISIBILITY_CODES.GENERAL_PUBLIC,
        PACKAGE_VISIBILITY_CODES.LUP,
      ];

      return [
        {
          id: `planningNoViewPASButton-${i}`,
          'dcp-packagetype': 'PAS Package',
          statuscode: statuses[i % statuses.length],
          'dcp-visibility': visibility[i % visibility.length],
        },
      ];
    },
  }),

  noPackages: trait({
    dcpDcpProjectDcpPackageProject: [],
  }),

  onHold: trait({
    statuscode: 'On-Hold',
  }),
});
