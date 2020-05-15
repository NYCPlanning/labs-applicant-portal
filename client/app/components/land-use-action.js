import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

// lookup to match action titles to their associated attributes
export const allLandUseActionOptions = [
  {
    name: 'Acquisition of Real Property', countField: 'dcpPfacquisitionofrealproperty', attr1: '', attr2: '',
  },
  {
    name: 'Change in CityMap', countField: 'dcpPfchangeincitymap', attr1: '', attr2: '',
  },
  {
    name: 'Concession', countField: 'dcpPfconcession', attr1: '', attr2: '',
  },
  {
    name: 'Disposition of Real Property', countField: 'dcpPfdispositionofrealproperty', attr1: '', attr2: '',
  },
  {
    name: 'Franchise', countField: 'dcpPffranchise', attr1: '', attr2: '',
  },
  {
    name: 'Housing Plan & Project', countField: 'dcpPfhousingplanandproject', attr1: '', attr2: '',
  },
  {
    name: 'Landfill', countField: 'dcpPflandfill', attr1: '', attr2: '',
  },
  {
    name: 'Modification', countField: 'dcpPfmodification', attr1: 'dcpPreviousulurpnumbers1', attr2: '',
  },
  {
    name: 'Renewal', countField: 'dcpPfrenewal', attr1: 'dcpPreviousulurpnumbers2', attr2: '',
  },
  {
    name: 'Revocable Consent', countField: 'dcpPfrevocableconsent', attr1: '', attr2: '',
  },
  {
    name: 'Site Selection - Public Facility', countField: 'dcpPfsiteselectionpublicfacility', attr1: '', attr2: '',
  },
  {
    name: 'UDAAP', countField: 'dcpPfudaap', attr1: '', attr2: '',
  },
  {
    name: 'URA', countField: 'dcpPfura', attr1: '', attr2: '',
  },
  {
    name: 'Zoning Authorization', countField: 'dcpPfzoningauthorization', attr1: 'dcpZoningauthorizationpursuantto', attr2: 'dcpZoningauthorizationtomodify',
  },
  {
    name: 'Zoning Certification', countField: 'dcpPfzoningcertification', attr1: 'dcpZoningpursuantto', attr2: 'dcpZoningtomodify',
  },
  {
    name: 'Zoning Map Amendment', countField: 'dcpPfzoningmapamendment', attr1: 'dcpExistingmapamend', attr2: 'dcpProposedmapamend',
  },
  {
    name: 'Zoning Special Permit', countField: 'dcpPfzoningspecialpermit', attr1: 'dcpZoningspecialpermitpursuantto', attr2: 'dcpZoningspecialpermittomodify',
  },
  {
    name: 'Zoning Text Amendment', countField: 'dcpPfzoningtextamendment', attr1: 'dcpAffectedzrnumber', attr2: 'dcpZoningresolutiontitle',
  },
];

export default class LandUseActionComponent extends Component {
  // local variable that records singular action result of dropdown selection
  @tracked selectedAction = {};

  // actions added by user in current session (pushed each time user selects from dropdown)
  @tracked actionsAddedByUser = [];

  // Actions with partial or complete answers already saved to the PAS Form Entity in CRM
  // OR actions that exist in the actionsAddedByUser array
  get selectedActions() {
    const { pasForm } = this.args;
    const newActions = this.actionsAddedByUser;
    return allLandUseActionOptions.filter((option) => pasForm[option.countField] || pasForm[option.attr1] || pasForm[option.attr2] || newActions.includes(option));
  }

  // actions that appear in dropdown sorted alphabetically
  get availableActions() {
    const availableLandUseActions = allLandUseActionOptions.filter((option) => !this.selectedActions.includes(option));
    return availableLandUseActions.sort((a, b) => ((a.name > b.name) ? 1 : -1));
  }

  @action
  addSelectedAction() {
    this.args.pasForm[this.selectedAction.countField] = 1;
    this.actionsAddedByUser.unshiftObject(this.selectedAction);

    this.selectedAction = {};
  }

  @action
  removeSelectedAction(actionToRemove) {
    const { pasForm } = this.args;

    this.actionsAddedByUser.removeObject(actionToRemove);
    // reset all model attributes
    pasForm[actionToRemove.countField] = 0;
    pasForm[actionToRemove.attr1] = '';
    pasForm[actionToRemove.attr2] = '';
  }
}
