export default function(server) {
  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.
  */

  server.create('user');

  [
    {
      dcpProjectname: 'Huge New Public Library',
      primaryApplicant: 'Brandyn Friedly',
      packages: [
        {
          type: 'pas',
          statuscode: 'Saved',
        },
      ],
    },
    {
      dcpProjectname: 'Bagel Factory',
      primaryApplicant: 'Godfrey Yeung',
      packages: [
        {
          type: 'pas',
          statuscode: 'Package Preparation',
        },
      ],
    },
    {
      dcpProjectname: '123 Ember Avenue',
      primaryApplicant: 'Matt Gardner',
      packages: [
        {
          type: 'pas',
          statuscode: 'Submitted',
        },
      ],
    },
    {
      dcpProjectname: 'Arizona Sun Dog Kennel',
      primaryApplicant: 'Taylor McGinnis',
      packages: [
        {
          type: 'pas',
          statuscode: 'Under Review',
        },
      ],
    },
    {
      dcpProjectname: 'All Things Blue For You Merch',
      primaryApplicant: 'Hannah Kates',
      packages: [
        {
          type: 'pas',
          statuscode: 'Revision Required',
        },
      ],
    },
    {
      dcpProjectname: 'Pop Up Palm Tree & Goat Farm',
      primaryApplicant: 'Nneka Sobers',
      packages: [],
    },
  ].forEach((project) => server.create('project', project));
}
