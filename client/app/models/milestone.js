import Model, { attr } from '@ember-data/model';

export default class MilestoneModel extends Model {
  @attr()
  statuscode;

  @attr()
  dcpMilestoneValue;

  // used for completed milestones because these dates will be known
  @attr()
  dcpActualstartdate;

  @attr()
  dcpActualenddate;

  // used for in progress and planned because these dates will not be known yet
  @attr()
  dcpPlannedstartdate;

  @attr()
  dcpPlannedcompletiondate;

  get targetDuration() {
    return 10;
  }
}
