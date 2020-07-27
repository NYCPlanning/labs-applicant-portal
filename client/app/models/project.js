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

  get pasPackages() {
    const pasPackages = this.packages
      .filter((projectPackage) => projectPackage.dcpPackagetype === optionset(['package', 'type', 'code', 'PAS_PACKAGE']))
      .sortBy('dcpPackageversion')
      .reverse();

  return pasPackages;
  }

  get latestPasPackage() {
    return this.pasPackages.firstObject;
  }

  get rwcdsPackages() {
    const rwcdsPackages = this.packages
      .filter((projectPackage) => projectPackage.dcpPackagetype === optionset(['package', 'type', 'code', 'RWCDS']))
      .sortBy('dcpPackageversion')
      .reverse();

    return rwcdsPackages;
  }

  get latestRwcdsPackage() {
    return this.rwcdsPackages.firstObject;
  }
}
