import Controller from '@ember/controller';

// TODO: Get theses codes from a Constants service
const PACKAGE_STATUS_CODES = {
  PACKAGE_PREPARATION: "Package Preparation",
  CERTIFIED: "Certified",
  FINAL_APPROVAL: "Final Approval",
  REVIEWED_NO_REVISIONS_REQUIRED: "Reviewed - No Revisions Required",
  REVIEWED_REVISIONS_REQUIRED: "Reviewed - Revisions Required",
  WITHDRAWN: "Withdrawn",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  MISTAKE: "Mistake",
}

const PACKAGE_VISIBILITY_CODES = {
  APPLICANT_ONLY: 717170002,
  GENERAL_PUBLIC: 717170003,
}

export default class ProjectsController extends Controller {
  queryParams = ['email'];

  // TODO: organize this business logic as computed properties on the projects model
  // projects for applicant to do
  get applicantProjects () {
    return this.model.filter((project) => project.pasPackages.some((projectPackage) => {
      if (
        projectPackage.statuscode === PACKAGE_STATUS_CODES.PACKAGE_PREPARATION
        && [
          PACKAGE_VISIBILITY_CODES.APPLICANT_ONLY,
          PACKAGE_VISIBILITY_CODES.GENERAL_PUBLIC
        ].includes(projectPackage['dcp-visibility'])
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
          projectPackage.statuscode === PACKAGE_STATUS_CODES.PACKAGE_PREPARATION
          && [
            PACKAGE_VISIBILITY_CODES.APPLICANT_ONLY,
            PACKAGE_VISIBILITY_CODES.GENERAL_PUBLIC
          ].includes(projectPackage['dcp-visibility'])
        ) {
          return false;
        }
        return true;
      });
    });
  }
}
