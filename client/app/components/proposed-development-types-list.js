import Component from '@glimmer/component';

export default class ProposedDevelopmentTypesListComponent extends Component {
  get proposedDevelopmentTypes() {
    const { pasForm } = this.args;

    const developmentTypes = [
      {
        prop: 'dcpProposeddevelopmentsitenewconstruction',
        label: 'Newly constructed buildings',
      },
      {
        prop: 'dcpProposeddevelopmentsitedemolition',
        label: 'Demolition',
      },
      {
        prop: 'dcpProposeddevelopmentsiteinfoalteration',
        label: 'Alteration',
      },
      {
        prop: 'dcpProposeddevelopmentsiteinfoaddition',
        label: 'Addition',
      },
      {
        prop: 'dcpProposeddevelopmentsitechnageofuse',
        label: 'Change of use',
      },
      {
        prop: 'dcpProposeddevelopmentsiteenlargement',
        label: 'Enlargement',
      },
      {
        prop: 'dcpProposeddevelopmentsiteinfoother',
        label: `Other (${pasForm.dcpProposeddevelopmentsiteotherexplanation})`,
      },
    ];

    return developmentTypes.reduce((proposedTypes, type) => {
      if (pasForm[type.prop]) {
        proposedTypes.push(type.label);
      }
      return proposedTypes;
    }, []).join(', ');
  }
}
