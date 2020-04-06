export default function(server) {
  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.
  */

  [
    {
      name: 'Huge New Public Library',
      primaryApplicant: 'Brandyn Friedly',
      packages: [
        {
          type: 'pas',
          statuscode: 'Saved',
        },
      ],
    },
    {
      name: 'Bagel Factory',
      primaryApplicant: 'Godfrey Yeung',
      packages: [
        {
          type: 'pas',
          statuscode: 'Package Preparation',
        },
      ],
    },
    {
      name: '123 Ember Avenue',
      primaryApplicant: 'Matt Gardner',
      packages: [
        {
          type: 'pas',
          statuscode: 'Submitted',
        },
      ],
    },
    {
      name: 'Arizona Sun Dog Kennel',
      primaryApplicant: 'Taylor McGinnis',
      packages: [
        {
          type: 'pas',
          statuscode: 'Under Review',
        },
      ],
    },
    {
      name: 'All Things Blue For You Merch',
      primaryApplicant: 'Hannah Kates',
      packages: [
        {
          type: 'pas',
          statuscode: 'Revision Required',
        },
      ],
    },
    {
      name: 'Pop Up Palm Tree & Goat Farm',
      primaryApplicant: 'Nneka Sobers',
      packages: [],
    },
  ].forEach((project) => server.create('project', project));
}
