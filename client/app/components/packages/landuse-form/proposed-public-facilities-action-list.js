import Component from '@glimmer/component';

export default class ProposedPublicFacilitiesActionListComponent extends Component {
  get proposedPublicFacilitiesActionList() {
    const { landuseForm } = this.args;

    const actions = [
      {
        prop: 'dcpOfficespaceleaseopt',
        label: 'Office Space Lease',
      },
      {
        prop: 'dcpAcquisitionopt',
        label: 'Public Facility Acquisition',
      },
      {
        prop: 'dcpSiteselectionopt',
        label: 'Public Facility Site Acquisition',
      },

    ];

    return actions.reduce((proposedActions, type) => {
      if (landuseForm[type.prop]) {
        proposedActions.push(type.label);
      }
      return proposedActions;
    }, []).join(', ');
  }
}
