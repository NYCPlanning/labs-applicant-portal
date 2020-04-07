export default function(server) {
  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.
  */

  server.create('user');

  [
    {
      dcpProjectname: 'Huge New Public Library',
      dcpApplicantCustomerValue: 'Brandyn Friedly',
      packages: [
        {
          type: 'pas',
          statuscode: 'Saved',
        },
      ],
    },
    {
      dcpProjectname: 'Bagel Factory',
      dcpApplicantCustomerValue: 'Godfrey Yeung',
      packages: [
        {
          type: 'pas',
          statuscode: 'Package Preparation',
        },
      ],
    },
    {
      dcpProjectname: '123 Ember Avenue',
      dcpApplicantCustomerValue: 'Matt Gardner',
      packages: [
        {
          type: 'pas',
          statuscode: 'Submitted',
        },
      ],
    },
    {
      dcpProjectname: 'Arizona Sun Dog Kennel',
      dcpApplicantCustomerValue: 'Taylor McGinnis',
      packages: [
        {
          type: 'pas',
          statuscode: 'Under Review',
        },
      ],
    },
    {
      dcpProjectname: 'All Things Blue For You Merch',
      dcpApplicantCustomerValue: 'Hannah Kates',
      packages: [
        {
          type: 'pas',
          statuscode: 'Revision Required',
        },
      ],
    },
    {
      dcpProjectname: 'Pop Up Palm Tree & Goat Farm',
      dcpApplicantCustomerValue: 'Nneka Sobers',
      packages: [],
    },
  ].forEach((project) => server.create('project', project));
}
