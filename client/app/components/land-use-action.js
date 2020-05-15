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
  // local variable that records results of dropdown selection
  @tracked selectedLandUseAction = {};

  // actions selected by user in dropdown
  @tracked newLandUseActionSelections = [];

  // Actions with partial or complete answers already saved
  // to the PAS Form Entity in CRM
  get existingLandUseActionSelections() {
    const { pasForm } = this.args;
    return allLandUseActionOptions.filter((option) => pasForm[option.countField] || pasForm[option.attr1] || pasForm[option.attr2]);
  }

  // Actions selected by user in dropdown ("new"), or already
  // existing in CRM ("existing")
  get landUseActionSelections() {
    const { pasForm } = this.args;
    // Filter the "new" actions array so that the action does not exist on BOTH the "exisiting" and "new" arrays,
    // when user enters a value in the action inputs (and therefore updates the model)
    const filteredNewActions = this.newLandUseActionSelections.filter((action) => !pasForm[action.countField] && !pasForm[action.attr1] && !pasForm[action.attr2]);
    return [
      ...this.existingLandUseActionSelections,
      ...filteredNewActions,
    ];
  }

  get availableLandUseActionOptions() {
    return allLandUseActionOptions.filter((option) => !this.landUseActionSelections.includes(option));
  }

  get sortedAvailableLandUseActionOptions() {
    return this.availableLandUseActionOptions.sort((a, b) => ((a.name > b.name) ? 1 : -1));
  }

  // when a user selects an option from the dropdown menu,
  // the option is filtered out of the availableLandUseActionOptions
  // (and therefore removed from the dropdown).
  // The selected option is added to the newLandUseActionSelections array
  // (and therefore displays in the list of selected actions).
  @action
  addNewLandUseActionSelection() {
    const selection = this.selectedLandUseAction.countField;

    if (selection) {
      this.newLandUseActionSelections.pushObject(this.selectedLandUseAction);
      this.selectedLandUseAction = {};
    }
  }

  // When a user deletes an action, the associated fields are reset as well.
  // Because the action is removed from landUseActionSelections, it is no
  // longer filtered out of availableLandUseActionOptions array
  // (and therefore exists in the dropdown).
  @action
  removeSelectedAction(actionToRemove) {
    const { pasForm } = this.args;

    this.landUseActionSelections.removeObject(actionToRemove);
    pasForm[actionToRemove.countField] = 0;
    pasForm[actionToRemove.attr1] = '';
    pasForm[actionToRemove.attr2] = '';
  }
}
