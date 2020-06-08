import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';
import { PACKAGE_STATUS_OPTIONSET, PACKAGE_VISIBILITY_OPTIONSET } from '../models/package';

export default class ProjectsController extends Controller {
  queryParams = ['email'];

  // TODO: organize this business logic as computed properties on the projects model
  // projects for applicant to do
  get applicantProjects () {
    return [
      ...this.model.filter((project) => project.pasPackages.some((projectPackage) => {
        if (
          projectPackage.statuscode === PACKAGE_STATUS_OPTIONSET.PACKAGE_PREPARATION.code
          && [
            PACKAGE_VISIBILITY_OPTIONSET.APPLICANT_ONLY.code,
            PACKAGE_VISIBILITY_OPTIONSET.GENERAL_PUBLIC.code,
          ].includes(projectPackage.dcpVisibility)
        ) {
          return true;
        }
        return false;
      })),
      ...this.model.filter((project) => project.rwcdsPackages.some((projectPackage) => {
        if (
          projectPackage.statuscode === PACKAGE_STATUS_OPTIONSET.PACKAGE_PREPARATION.code
          && [
            PACKAGE_VISIBILITY_OPTIONSET.APPLICANT_ONLY.code,
            PACKAGE_VISIBILITY_OPTIONSET.GENERAL_PUBLIC.code,
          ].includes(projectPackage.dcpVisibility)
        ) {
          return true;
        }
        return false;
      })),
    ];
  }

  // projects for nyc planning to do.
  // These are all other returned projects that are not in applicantProjects.
  // (I.e. this list includes projects with no packages).
  get planningProjects () {
    return this.model.filter((project) => {
      return !this.applicantProjects.includes(project);
    })
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
