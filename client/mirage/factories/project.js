import { Factory, trait } from 'ember-cli-mirage';

export default Factory.extend({
  statuscode: 'Active', // default project statuscode
  dcpPublicstatus: 717170000,
  dcpVisibility: 717170003,

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

  dcpName(i) {
    const SAMPLE_CODENAMES = [
      'P2018M0268',
      'P2017M0366',
      '2019M0123'];

    return SAMPLE_CODENAMES[i % SAMPLE_CODENAMES.length];
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

  dcpProjectbrief: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',

  dcpBorough(i) {
    const BOROUGHS = [
      717170000,
      717170002,
      717170001,
      717170003,
      717170004,
      717170005,
    ];

    return BOROUGHS[i % BOROUGHS.length];
  },

  // Defaults to Project with a PAS Form applicant package.
  applicant: trait({
    afterCreate(project, server) {
      server.create('package', { project }, 'applicant', 'pasForm');
    },
  }),

  // These can be either projects with or without a View PAS button
  planning: trait({
    afterCreate(project, server) {
      server.create('package', { project }, 'planning', 'pasForm');
    },
  }),

  planningWithViewPASButton: trait({
    afterCreate(project, server) {
      server.create('package', { project }, 'planningWithViewPASButton', 'pasForm');
    },
  }),

  // A "View PAS" button does not show up as long it is not
  // BOTH submitted/under review/reviewed* and visible to
  // applicant only/general public
  planningNoViewPASButton: trait({
    afterCreate(project, server) {
      server.create('package', { project }, 'planningNoViewPASButton', 'pasForm');
    },
  }),

  onHold: trait({
    statuscode: 'On-Hold',
  }),
});
