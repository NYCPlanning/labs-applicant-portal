import Model, { attr } from '@ember-data/model';

const TARGET_DURATION_LOOKUP = {
  'Review Pre-Application Statement': '10-30',
  'Interdivisional Meeting': '5-10',
  'Finalize Actions': '10-60',
  'Review RWCDS Memo': '30-45',
  'Review Draft Land Use Application': '45-60',
  'Review Filed Land Use Fee Invoice': '2-4',
  'Review Filed Land Use Application': '45-60',
  'Review Draft EAS': '45-60',
  'Review Filed EAS and EIS Draft Scope of Work': '45-60',
  'Review CEQR Fee Invoice': '2-4',
  'Review Filed EAS': '45-60',
  'DEIS Public Scoping Meeting': '30-45',
  'Prepare and Review DEIS': '60-120',
};

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

  @attr('boolean')
  isDcpOwned;

  get targetDuration() {
    return TARGET_DURATION_LOOKUP[this.dcpMilestoneValue];
  }
}
