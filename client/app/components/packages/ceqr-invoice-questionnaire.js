import Component from '@glimmer/component';
import { action } from '@ember/object';
import { optionset } from '../../helpers/optionset';

export default class PackagesCeqrInvoiceQuestionnaireComponent extends Component {
  @action
  setSubtotal(subtotalValue, formData) {
    const { dcpProjectmodificationtoapreviousapproval } = formData;
    if (dcpProjectmodificationtoapreviousapproval === optionset(['ceqrInvoiceQuestionnaire', 'dcpProjectmodificationtoapreviousapproval', 'code', 'Yes'])) {
      formData.dcpSubtotal = (subtotalValue * 0.2);
    } else {
      formData.dcpSubtotal = subtotalValue;
    }
  }
}
