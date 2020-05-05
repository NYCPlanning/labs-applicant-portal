import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class LandUseActionComponent extends Component {
  // local variable that records results of dropdown selection
  @tracked selectedLandUseAction = {};

  // actions selected by user in dropdown
  @tracked newLandUseActionSelections = [];

  // lookup to match action titles to their associated attributes
  allLandUseActionOptions = [
    {
      name: 'Acquisition of Real Property', field: 'dcpPfacquisitionofrealproperty', attr1: '', attr2: '',
    },
    {
      name: 'Change in CityMap', field: 'dcpPfchangeincitymap', attr1: '', attr2: '',
    },
    {
      name: 'Concession', field: 'dcpPfconcession', attr1: '', attr2: '',
    },
    {
      name: 'Disposition of Real Property', field: 'dcpPfdispositionofrealproperty', attr1: '', attr2: '',
    },
    {
      name: 'Franchise', field: 'dcpPffranchise', attr1: '', attr2: '',
    },
    {
      name: 'Housing Plan & Project', field: 'dcpPfhousingplanandproject', attr1: '', attr2: '',
    },
    {
      name: 'Landfill', field: 'dcpPflandfill', attr1: '', attr2: '',
    },
    {
      name: 'Modification', field: 'dcpPfmodification', attr1: 'dcpPreviousulurpnumbers1', attr2: '',
    },
    {
      name: 'Renewal', field: 'dcpPfrenewal', attr1: 'dcpPreviousulurpnumbers2', attr2: '',
    },
    {
      name: 'Revocable Consent', field: 'dcpPfrevocableconsent', attr1: '', attr2: '',
    },
    {
      name: 'Site Selection - Public Facility', field: 'dcpPfsiteselectionpublicfacility', attr1: '', attr2: '',
    },
    {
      name: 'UDAAP', field: 'dcpPfudaap', attr1: '', attr2: '',
    },
    {
      name: 'URA', field: 'dcpPfura', attr1: '', attr2: '',
    },
    {
      name: 'Zoning Authorization', field: 'dcpPfzoningauthorization', attr1: 'dcpZoningauthorizationpursuantto', attr2: 'dcpZoningauthorizationtomodify',
    },
    {
      name: 'Zoning Certification', field: 'dcpPfzoningcertification', attr1: 'dcpZoningpursuantto', attr2: 'dcpZoningtomodify',
    },
    {
      name: 'Zoning Map Amendment', field: 'dcpPfzoningmapamendment', attr1: 'dcpExistingmapamend', attr2: 'dcpProposedmapamend',
    },
    {
      name: 'Zoning Special Permit', field: 'dcpPfzoningspecialpermit', attr1: 'dcpZoningspecialpermitpursuantto', attr2: 'dcpZoningspecialpermittomodify',
    },
    {
      name: 'Zoning Text Amendment', field: 'dcpPfzoningtextamendment', attr1: 'dcpAffectedzrnumber', attr2: 'dcpZoningresolutiontitle',
    },
  ];

  // Actions with partial or complete answers already saved
  // to the PAS Form Entity in CRM
  get existingLandUseActionSelections() {
    const { pasForm } = this.args;
    return this.allLandUseActionOptions.filter((option) => pasForm[option.field] || pasForm[option.attr1] || pasForm[option.attr2]);
  }

  // Actions selected by user in dropdown, or already
  // existing in CRM
  get landUseActionSelections() {
    return [
      ...this.existingLandUseActionSelections,
      ...this.newLandUseActionSelections,
    ];
  }

  get availableLandUseActionOptions() {
    return this.allLandUseActionOptions.filter((option) => !this.landUseActionSelections.includes(option));
  }

  get sortedAvailableLandUseActionOptions() {
    return this.availableLandUseActionOptions.sort((a, b) => ((a.name > b.name) ? 1 : -1));
  }

  // when a user selects an option from the dropdown menu,
  // the option is removed from the landUseActionOptions
  // (and therefore removed from the dropdown).
  // The selected option is added to the newLandUseActionSelections array
  // (and therefore displays in the list of selected actions).
  @action
  addNewLandUseActionSelection() {
    // use unshiftObject to place new action at top of list
    const existsSelection = this.selectedLandUseAction.field;

    if (existsSelection) {
      this.newLandUseActionSelections.unshiftObject(this.selectedLandUseAction);
      this.selectedLandUseAction = {};
    }
  }

  // When a user deletes an action, the associated fields are reset as well.
  // The selected action option is added back to the landUseActionOptions arrays
  // (and therefore added back to the dropdown).
  @action
  removeSelectedAction(actionToRemove) {
    const { pasForm } = this.args;

    this.newLandUseActionSelections.removeObject(actionToRemove);
    pasForm[actionToRemove.field] = 0;
    pasForm[actionToRemove.attr1] = '';
    pasForm[actionToRemove.attr2] = '';
  }
}
