import { Factory, trait } from 'ember-cli-mirage';

export default Factory.extend({
  toDo: trait({
    dcpDcpProjectDcpPackageProject(i) {
      const statuses = ['Saved', 'Package Preparation'];

      return [
        {
          'dcp-packagetype': 'PAS Package',

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
    dcpDcpProjectDcpPackageProject(i) {
      const statuses = ['Submitted', 'Under Review', 'Revision Required'];

      return [
        {
          'dcp-packagetype': 'PAS Package',
          statuscode: statuses[i % statuses.length],
        },
      ];
    },
  }),

  noPackages: trait({
    dcpDcpProjectDcpPackageProject: [],
  }),
});
