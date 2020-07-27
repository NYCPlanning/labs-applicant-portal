import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';
import { PACKAGE_STATUS, PACKAGE_VISIBILITY } from '../optionsets/package';

export function packageIsToDo(project) {
  return project.pasPackages.some((projectPackage) => {
    if (
      projectPackage.statuscode === PACKAGE_STATUS.PACKAGE_PREPARATION.code
      && [
        PACKAGE_VISIBILITY.APPLICANT_ONLY.code,
        PACKAGE_VISIBILITY.GENERAL_PUBLIC.code,
      ].includes(projectPackage.dcpVisibility)
    ) {
      return true;
    } return false;
  });
}

export default class ProjectsController extends Controller {
  queryParams = ['email'];

  // TODO: organize this business logic as computed properties on the projects model

  // Projects awaiting the applicant's submission
  // (includes active projects with packages that haven't been submitted)
  get toDoProjects () {
    const boop = this.model.filter((project) => 
      packageIsToDo(project)
    );
    return boop;
  }

  // Projects in NYC Planning's hands
  // These are all other returned projects that are not in toDoProjects
  // (includes projects under review, on hold, with no packages, etc)
  get doneProjects () {
    return this.model.filter((project) => {
      // if pasPackages is empty, some() automatically returnse false, but we want to return true.
      if (project.pasPackages.length === 0) return true;
      return !packageIsToDo(project);
    });
  }

  // TODO: Possibly improve this sort to consider the house numbers
  // in front of addresses. One possible implementation is that
  // addresses should first be sorted alphabetically by their street name,
  // and secondly by their house number. (Currently, the sort is alphabetical
  // even across the house number, so "123" < "8" === true)
  @sort('toDoProjects', function(projectA, projectB) {
    return projectA.dcpProjectname.localeCompare(projectB.dcpProjectname);
  })
  sortedToDoProjects;

  @sort('doneProjects', function(projectA, projectB) {
    return projectA.dcpProjectname.localeCompare(projectB.dcpProjectname);
  })
  sortedDoneProjects;
}
