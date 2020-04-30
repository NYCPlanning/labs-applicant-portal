import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class PasFormComponent extends Component {
  @tracked dcpUrbanrenewalarea;
  @tracked dcpLanduseactiontype2;
  @tracked dcpProjectareaindustrialbusinesszone;
  @tracked dcpIsprojectarealandmark;
  @tracked dcpIsinclusionaryhousingdesignatedarea;
  @tracked dcpDiscressionaryfundingforffordablehousing;

  @action
  updateAttr(attr, newVal) {
    this[attr] = newVal;
  }
}
