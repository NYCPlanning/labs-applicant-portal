import Controller from '@ember/controller';

export default class ProjectsController extends Controller {
  // projects for applicant to do
  get applicantProjects () {
    // handle filtering here, reference in template as this.applicantProjects
    // todo if statuscode is "Save" or "Package Preparation"
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

  get upcomingProjects () {
    // TODO: write filter for projects with no pas package objects
    return null;
  }
}
