import Component from '@glimmer/component';

export default class ProjectMilestonesMilestoneGroupItemComponent extends Component {
  projectsToShow = [
    'Prepare Pre-Application Statement',
    'Review Pre-Application Statement',
    'Interdivisional Meeting',
    'Finalize Actions',
    'Prepare RWCDS Memo',
    'Review RWCDS Memo',
    'Prepare Draft Land Use Application',
    'Review Draft Land Use Application',
    'Prepare Filed Land Use Application',
    'Review Filed Land Use Fee Invoice',
    'Prepare Filed Land Use Fee Payment',
    'Review Filed Land Use Application',
    'Prepare Draft EAS',
    'Review Draft EAS',
    'Prepare EIS Draft Scope of Work',
    'Review Filed EAS and EIS Draft Scope of Work',
    'Prepare Filed EAS',
    'Review CEQR Fee Invoice',
    'Prepare CEQR Fee Payment',
    'Review Filed EAS',
    'DEIS Public Scoping Meeting',
    'Prepare and Review DEIS',
  ]

  get showProject() {
    return this.projectsToShow.includes(this.args.milestone.dcpMilestoneValue)
          || this.args.milestone.dcpMilestoneValue.toUpperCase().includes('AD-HOC')
          || this.args.milestone.dcpMilestoneValue.toUpperCase().includes('ADHOC')
          || this.args.milestone.dcpMilestoneValue.toUpperCase().includes('AD HOC');
  }
}
