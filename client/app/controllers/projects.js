import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';
import { PACKAGE_STATUS, PACKAGE_VISIBILITY } from '../optionsets/package';

export default class ProjectsController extends Controller {
  queryParams = ['email'];

  // TODO: organize this business logic as computed properties on the projects model
  // projects for applicant to do
  get applicantProjects () {
    return this.model.filter((project) => project.pasPackages.some((projectPackage) => {
      if (
        projectPackage.statuscode === PACKAGE_STATUS.PACKAGE_PREPARATION.code
        && [
          PACKAGE_VISIBILITY.APPLICANT_ONLY.code,
          PACKAGE_VISIBILITY.GENERAL_PUBLIC.code,
        ].includes(projectPackage.dcpVisibility)
      ) {
        return true;
      }
      return false;
    }));
  }

  // projects for nyc planning to do.
  // These are all other returned projects that are not in applicantProjects.
  // (I.e. this list includes projects with no packages).
  get planningProjects () {
    return this.model.filter((project) => {
      // if pasPackages is empty, some() automatically returnse false, but we want to return true.
      if (project.pasPackages.length === 0) return true;
      return project.pasPackages.some((projectPackage) => {
        if (
          projectPackage.statuscode === PACKAGE_STATUS.PACKAGE_PREPARATION.code
          && [
            PACKAGE_VISIBILITY.APPLICANT_ONLY.code,
            PACKAGE_VISIBILITY.GENERAL_PUBLIC.code,
          ].includes(projectPackage.dcpVisibility)
        ) {
          return false;
        }
        return true;
      });
    });
  }

  // TODO: Possibly improve this sort to consider the house numbers
  // in front of addresses. One possible implementation is that
  // Addresses should first be sorted alphabetically by their street name,
  // and secondly by their house number. (Currently, the sort is alphabetical
  // even across the house number, so "123" < "8" === true)
  @sort('applicantProjects', function(projectA, projectB) {
    return projectA.dcpProjectname.localeCompare(projectB.dcpProjectname);
  })
  sortedApplicantProjects;

  @sort('planningProjects', function(projectA, projectB) {
    return projectA.dcpProjectname.localeCompare(projectB.dcpProjectname);
  })
  sortedPlanningProjects;
}
