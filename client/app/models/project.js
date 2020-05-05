import Model, { attr, hasMany } from '@ember-data/model';

export default class ProjectModel extends Model {
  @attr dcpProjectname;

  @attr statuscode;

  @attr dcpApplicantCustomerValue;

  @hasMany('package', { async: false })
  packages;

  get pasPackages() {
    const [firstPackage] = this.packages
      .filter((projectPackage) => projectPackage.dcpPackagetype === 'PAS Package')
      .sortBy('dcpPackageversion')
      .reverse();

    if (firstPackage) {
      return [firstPackage];
    }
    return [];
  }
}
