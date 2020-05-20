import Component from '@glimmer/component';

export default class PackagesPasFormShowComponent extends Component {
  get proposedDevelopmentTypes() {
    return [
      ...(this.args.package.pasForm.dcpProposeddevelopmentsitenewconstruction ? ['Newly constructed buildings'] : []),
      ...(this.args.package.pasForm.dcpProposeddevelopmentsitedemolition ? ['Demolition'] : []),
      ...(this.args.package.pasForm.dcpProposeddevelopmentsiteinfoalteration ? ['Alteration'] : []),
      ...(this.args.package.pasForm.dcpProposeddevelopmentsiteinfoaddition ? ['Addition'] : []),
      ...(this.args.package.pasForm.dcpProposeddevelopmentsitechnageofuse ? ['Change of use'] : []),
      ...(this.args.package.pasForm.dcpProposeddevelopmentsiteenlargement ? ['Enlargement'] : []),
      ...(this.args.package.pasForm.dcpProposeddevelopmentsiteinfoother
        ? [`Other ${this.args.package.pasForm.dcpProposeddevelopmentsiteotherexplanation}`]
        : []
      ),
    ];
  }
}
