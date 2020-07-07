import Component from '@glimmer/component';

export default class ProposedActionsComponent extends Component {
  actionsWithSectionNumber = [
    'ZS', 'ZA', 'ZC', 'SD', 'SA', 'SC', 'RS', 'RA', 'RC',
  ];

  actionsWithModifiedZrSectionNumberQuestion = [
    'ZS', 'ZA', 'SD', 'SA', 'RS', 'RA',
  ];

  get zrAppendixF() {
    const zrType = this.args.form.saveableChanges.dcpZoningresolutiontype;
    const zrSectionNumber = this.args.form.saveableChanges.dcpZrsectionnumber;

    return zrType === 'ZR' && zrSectionNumber === 'Appendix F';
  }

  get zrSectionNumber() {
    const zrType = this.args.form.saveableChanges.dcpZoningresolutiontype;
    const zrSectionNumber = this.args.form.saveableChanges.dcpZrsectionnumber;

    const zrTypeInArray = this.actionsWithSectionNumber.includes(zrType);
    if (zrTypeInArray || this.zrAppendixF) {
      return zrSectionNumber;
    } return null;
  }

  get hasModifiedZrSectionNumberQuestion() {
    const zrType = this.args.form.saveableChanges.dcpZoningresolutiontype;
    const zrTypeInArray = this.actionsWithModifiedZrSectionNumberQuestion.includes(zrType);
    return zrTypeInArray;
  }
}
