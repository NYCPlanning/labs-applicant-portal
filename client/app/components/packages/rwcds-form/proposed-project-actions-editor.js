import Component from '@glimmer/component';
import { optionset } from '../../../helpers/optionset';

export default class ProposedActionsComponent extends Component {
  actionsWithSectionNumberAndSectionTitle = [
    'ZS', 'ZA', 'ZC', 'SD', 'SA', 'SC', 'RS', 'RA', 'RC',
  ];

  actionsWithModifiedZrSectionNumberQuestion = [
    'ZA', 'ZS', 'SD', 'SA', 'RA', 'RS',
  ];

  get zrTypeCode() {
    return this.args.zrForm.data.dcpZoningresolutiontype;
  }

  get zrTypeLabel() {
    return optionset(['affectedZoningResolution', 'actions', 'label', this.zrTypeCode]);
  }

  get zrAppendixF() {
    const zrSectionNumber = this.args.zrForm.data.dcpZrsectionnumber;
    return this.zrTypeLabel === 'ZR' && zrSectionNumber === 'AppendixF';
  }

  get zrSectionNumber() {
    const zrSectionNumber = this.args.zrForm.data.dcpZrsectionnumber;

    const zrTypeInArray = this.actionsWithSectionNumberAndSectionTitle.includes(this.zrTypeLabel);
    if (zrTypeInArray || this.zrAppendixF) {
      return zrSectionNumber;
    } return null;
  }

  get hasModifiedZrSectionNumberQuestion() {
    const zrTypeInArray = this.actionsWithModifiedZrSectionNumberQuestion.includes(this.zrTypeLabel);
    return zrTypeInArray;
  }

  get hasZrSectionTitleQuestion() {
    const zrTypeInArray = this.actionsWithSectionNumberAndSectionTitle.includes(this.zrTypeLabel);
    return zrTypeInArray || this.zrAppendixF;
  }

  get isActionWithAdditionalInformation() {
    return this.hasModifiedZrSectionNumberQuestion
    || this.hasZrSectionTitleQuestion
    || this.zrTypeCode === optionset(['affectedZoningResolution', 'actions', 'code', 'ZR']);
  }
}
