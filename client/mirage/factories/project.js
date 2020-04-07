import { Factory, trait } from 'ember-cli-mirage';

export default Factory.extend({
  toDo: trait({
    packages(i) {
      const statuses = ['Saved', 'Package Preparation'];

      return [
        {
          type: 'pas',

          // allows us to have an evenly distributed
          // # of projects with these statuses
          //
          // this.server.createList('project', 'toDo', 10)
          // ^ 5 will be "Saved", 5 will be "Package Preparation"
          statuscode: statuses[i % statuses.length],
        },
      ];
    },
  }),

  workingOnIt: trait({
    packages(i) {
      const statuses = ['Submitted', 'Under Review', 'Revision Required'];

      return [
        {
          type: 'pas',
          statuscode: statuses[i % statuses.length],
        },
      ];
    },
  }),

  noPackages: trait({
    // we _want_ this to be blank because we want to test that the
    // model's default value is used when this is absent
    // packages: [],
  }),
});
