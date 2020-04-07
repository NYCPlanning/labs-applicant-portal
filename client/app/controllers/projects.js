import Controller from '@ember/controller';

export default class ProjectsController extends Controller {
  queryParams = ['email'];

  // TODO: organize this business logic as computed properties on the projects model
  // projects for applicant to do
  get applicantProjects () {
    return this.model.filter((project) => project.packages.some((projectpackage) => {
      if (projectpackage.statuscode === 'Saved' || projectpackage.statuscode === 'Package Preparation') {
        return true;
      } return false;
    }));
  }

  // projects for nyc planning to do
  get planningProjects () {
    return this.model.filter((project) => project.packages.some((projectpackage) => {
      if (projectpackage.statuscode === 'Submitted' || projectpackage.statuscode === 'Under Review' || projectpackage.statuscode === 'Revision Required') {
        return true;
      } return false;
    }));
  }

  // projects that have no pas packages are shown as "upcoming"
  get noPasProjects () {
    return this.model.filter((project) => {
      // filter to get only pas packages
      const pasPackages = project.packages.filter((projectpackage) => {
        if (projectpackage.type === 'pas') {
          return true;
        } return false;
      });

      // return the project if there are no pasPackages
      if (pasPackages.length === 0) {
        return true;
      } return false;
    });
  }
}
