import Component from '@glimmer/component';

export default class ProposedActionsComponent extends Component {
  actionsWithSectionNumberAndSectionTitle = [
    'ZS', 'ZA', 'ZC', 'SD', 'SA', 'SC', 'RS', 'RA', 'RC',
  ];

  actionsWithModifiedZrSectionNumberQuestion = [
    'ZA', 'ZS', 'SD', 'SA', 'RA', 'RS',
  ];

  get zrAppendixF() {
    const zrType = this.args.zrForm.saveableChanges.dcpZoningresolutiontype;
    const zrSectionNumber = this.args.zrForm.saveableChanges.dcpZrsectionnumber;

    return zrType === 'ZR' && zrSectionNumber === 'Appendix F';
  }

  get zrSectionNumber() {
    const zrType = this.args.zrForm.saveableChanges.dcpZoningresolutiontype;
    const zrSectionNumber = this.args.zrForm.saveableChanges.dcpZrsectionnumber;

    const zrTypeInArray = this.actionsWithSectionNumberAndSectionTitle.includes(zrType);
    if (zrTypeInArray || this.zrAppendixF) {
      return zrSectionNumber;
    } return null;
  }

  get hasModifiedZrSectionNumberQuestion() {
    const zrType = this.args.zrForm.saveableChanges.dcpZoningresolutiontype;
    const zrTypeInArray = this.actionsWithModifiedZrSectionNumberQuestion.includes(zrType);
    return zrTypeInArray;
  }

  get hasZrSectionTitleQuestion() {
    const zrType = this.args.zrForm.saveableChanges.dcpZoningresolutiontype;
    const zrTypeInArray = this.actionsWithSectionNumberAndSectionTitle.includes(zrType);
    return zrTypeInArray || this.zrAppendixF;
  }
}
