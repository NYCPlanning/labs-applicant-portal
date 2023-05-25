import Component from '@glimmer/component';

export default class ApplicantPropertyTypeListComponent extends Component {
  get applicantPropertyTypeList() {
    const { landuseForm } = this.args;

    const actions = [
      {
        prop: 'dcpOwnersubjectproperty',
        label: 'Owner of subject property',
      },
      {
        prop: 'dcpLeesseesubjectproperty',
        label: 'Lessee of subject property',
      },
      {
        prop: 'dcpLeaseorbuy',
        label: 'In a contract to lease or buy the subject property',
      },
      {
        prop: 'dcpIsother',
        label: 'Other (explain in attached project description)',
      },
    ];

    return actions
      .reduce((applicantPropertyTypes, type) => {
        if (landuseForm[type.prop]) {
          applicantPropertyTypes.push(type.label);
        }
        return applicantPropertyTypes;
      }, [])
      .join(', ');
  }
}
