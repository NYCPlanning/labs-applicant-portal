import Model, { attr } from '@ember-data/model';

export default class ProjectModel extends Model {
  @attr dcpProjectname;

  @attr dcpApplicantCustomerValue;

  @attr({ defaultValue: () => [] }) dcpDcpProjectDcpPackageProject;

  get packages() {
    const [firstPackage] =
      this.dcpDcpProjectDcpPackageProject
        .filter((projectPackage) => projectPackage['dcp-packagetype'] === 'PAS Package')
        .sortBy('versionnumber')
        .reverse();

    if (firstPackage) {
      return [firstPackage];
    } return [];
  }
}
