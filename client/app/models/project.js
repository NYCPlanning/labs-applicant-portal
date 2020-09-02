import Model, { attr, hasMany } from '@ember-data/model';
import { optionset } from '../helpers/optionset';

export default class ProjectModel extends Model {
  // The human-readable, descriptive name.
  // e.g. "Marcus Garvey Blvd Project"
  @attr dcpProjectname;

  // The CRM Project 5-letter ID.
  // e.g. 2020M0442
  // This is NOT the project GUID.
  @attr dcpName;

  @attr dcpBorough;

  @attr statuscode;

  // e.g. 'Prefiled', 'Filed', 'In Public Review', 'Completed'
  @attr dcpPublicstatus;

  @attr dcpVisibility;

  @attr dcpApplicantCustomerValue;

  @attr dcpProjectbrief;

  @hasMany('package', { async: false })
  packages;

  @hasMany('project-applicant', { async: false })
  projectApplicants;

  get publicStatusGeneralPublicProject() {
    const isGeneralPublic = this.dcpVisibility === optionset(['project', 'dcpVisibility', 'code', 'GENERAL_PUBLIC']);
    return this.dcpPublicstatus && isGeneralPublic;
  }

  get pasPackages() {
    const pasPackages = this.packages
      .filter((projectPackage) => projectPackage.dcpPackagetype === optionset(['package', 'dcpPackagetype', 'code', 'PAS_PACKAGE']))
      .sortBy('dcpPackageversion')
      .reverse();

    return pasPackages;
  }

  get rwcdsPackages() {
    const rwcdsPackages = this.packages
      .filter((projectPackage) => projectPackage.dcpPackagetype === optionset(['package', 'dcpPackagetype', 'code', 'RWCDS']))
      .sortBy('dcpPackageversion')
      .reverse();

    return rwcdsPackages;
  }

  get landusePackages() {
    const landusePackages = this.packages
      .filter((projectPackage) => projectPackage.dcpPackagetype === optionset(['package', 'dcpPackagetype', 'code', 'DRAFT_LU_PACKAGE']))
      .sortBy('dcpPackageversion')
      .reverse();

    return landusePackages;
  }
}
