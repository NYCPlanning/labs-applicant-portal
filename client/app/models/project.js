import Model, { attr } from '@ember-data/model';
import { alias } from '@ember/object/computed';

export default class ProjectModel extends Model {
  @attr dcpProjectname;

  @attr dcpApplicantCustomerValue;

  @attr({ defaultValue: () => [] }) dcpDcpProjectDcpPackageProject;

  @alias('dcpDcpProjectDcpPackageProject') packages;
}
