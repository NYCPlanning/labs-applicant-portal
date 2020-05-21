import Component from '@glimmer/component';

export default class PackagesPasFormShowComponent extends Component {
  get proposedDevelopmentTypes() {
    const { pasForm } = this.args.package;
    const arr = [];

    if (pasForm.dcpProposeddevelopmentsitenewconstruction) {
      arr.push({
        type: 'dcpProposeddevelopmentsitenewconstruction',
        label: 'Newly constructed buildings',
      });
    }
    if (pasForm.dcpProposeddevelopmentsitedemolition) {
      arr.push({
        type: 'dcpProposeddevelopmentsitedemolition',
        label: 'Demolition',
      });
    }
    if (pasForm.dcpProposeddevelopmentsiteinfoalteration) {
      arr.push({
        type: 'dcpProposeddevelopmentsiteinfoalteration',
        label: 'Alteration',
      });
    }
    if (pasForm.dcpProposeddevelopmentsiteinfoaddition) {
      arr.push({
        type: 'dcpProposeddevelopmentsiteinfoaddition',
        label: 'Addition',
      });
    }
    if (pasForm.dcpProposeddevelopmentsitechnageofuse) {
      arr.push({
        type: 'dcpProposeddevelopmentsitechnageofuse',
        label: 'Change of use',
      });
    }
    if (pasForm.dcpProposeddevelopmentsiteenlargement) {
      arr.push({
        type: 'dcpProposeddevelopmentsiteenlargement',
        label: 'Enlargement',
      });
    }
    if (pasForm.dcpProposeddevelopmentsiteinfoother) {
      arr.push({
        type: 'dcpProposeddevelopmentsiteinfoother',
        label: `Other ${pasForm.dcpProposeddevelopmentsiteotherexplanation}`,
      });
    }

    return arr;
  }
}
