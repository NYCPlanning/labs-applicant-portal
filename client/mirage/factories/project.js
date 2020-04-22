import { Factory, trait } from 'ember-cli-mirage';

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
    afterCreate(project, server) {
      server.create('package', { project }, 'applicant');
    },
  }),

  // These can be either projects with or without a View PAS button
  planning: trait({
    afterCreate(project, server) {
      server.create('package', { project }, 'planning');
    },
  }),

  planningWithViewPASButton: trait({
    afterCreate(project, server) {
      server.create('package', { project }, 'planningWithViewPASButton');
    },
  }),

  // A "View PAS" button does not show up as long it is not
  // BOTH submitted/under review/reviewed* and visible to
  // applicant only/general public
  planningNoViewPASButton: trait({
    afterCreate(project, server) {
      server.create('package', { project }, 'planningNoViewPASButton');
    },
  }),

  // are these used? are they even correct?
  noPackages: trait({}),

  onHold: trait({
    statuscode: 'On-Hold',
  }),
});
