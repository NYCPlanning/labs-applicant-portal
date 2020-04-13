import Component from '@glimmer/component';

const PACKAGE_STATUS_CODES = {
  REVIEWED_NO_REVISIONS_REQUIRED: "Reviewed - No Revisions Required",
  REVIEWED_REVISIONS_REQUIRED: "Reviewed - Revisions Required",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
}

const PACKAGE_VISIBILITY_CODES = {
  APPLICANT_ONLY: 717170002,
  GENERAL_PUBLIC: 717170003,
}

/**
  * Generates a  project card listed under "Planning is working on it..."
  * @param      {Project Model}  project
  */
export default class ProjectsPlanningProjectCardComponent extends Component {
  /**
  * @return      {bool} true if this card shows the "View Pre-Application Statement" button
  */
  get showViewPas() {
    return this.args.project.pasPackages.some((projectPackage) => {
      if (
        [
          PACKAGE_STATUS_CODES.SUBMITTED,
          PACKAGE_STATUS_CODES.UNDER_REVIEW,
          PACKAGE_STATUS_CODES.REVIEWED_NO_REVISIONS_REQUIRED,
          PACKAGE_STATUS_CODES.REVIEWED_REVISIONS_REQUIRED,
        ].includes(projectPackage.statuscode)
        && [
          PACKAGE_VISIBILITY_CODES.APPLICANT_ONLY,
          PACKAGE_VISIBILITY_CODES.GENERAL_PUBLIC
        ].includes(projectPackage['dcp-visibility'])
      ) {
        return true;
      }
      return false;
    });
  }
}
