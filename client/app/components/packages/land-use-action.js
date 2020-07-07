import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

// lookup to match action titles to their associated attributes
export const All_LAND_USE_ACTION_OPTIONS = [
  {
    name: 'Acquisition of Real Property',
    countField: 'dcpPfacquisitionofrealproperty',
    attr1: '',
    attr2: '',
  },
  {
    name: 'Change in CityMap',
    countField: 'dcpPfchangeincitymap',
    attr1: '',
    attr2: '',
  },
  {
    name: 'Concession',
    countField: 'dcpPfconcession',
    attr1: '',
    attr2: '',
  },
  {
    name: 'Disposition of Real Property',
    countField: 'dcpPfdispositionofrealproperty',
    attr1: '',
    attr2: '',
  },
  {
    name: 'Franchise',
    countField: 'dcpPffranchise',
    attr1: '',
    attr2: '',
  },
  {
    name: 'Housing Plan & Project',
    countField: 'dcpPfhousingplanandproject',
    attr1: '',
    attr2: '',
  },
  {
    name: 'Landfill',
    countField: 'dcpPflandfill',
    attr1: '',
    attr2: '',
  },
  {
    name: 'Modification',
    countField: 'dcpPfmodification',
    attr1: 'dcpPreviousulurpnumbers1',
    attr2: '',
  },
  {
    name: 'Renewal',
    countField: 'dcpPfrenewal',
    attr1: 'dcpPreviousulurpnumbers2',
    attr2: '',
  },
  {
    name: 'Revocable Consent',
    countField: 'dcpPfrevocableconsent',
    attr1: '',
    attr2: '',
  },
  {
    name: 'Site Selection - Public Facility',
    countField: 'dcpPfsiteselectionpublicfacility',
    attr1: '',
    attr2: '',
  },
  {
    name: 'UDAAP',
    countField: 'dcpPfudaap',
    attr1: '',
    attr2: '',
  },
  {
    name: 'URA',
    countField: 'dcpPfura',
    attr1: '',
    attr2: '',
  },
  {
    name: 'Zoning Authorization',
    countField: 'dcpPfzoningauthorization',
    attr1: 'dcpZoningauthorizationpursuantto',
    attr2: 'dcpZoningauthorizationtomodify',
  },
  {
    name: 'Zoning Certification',
    countField: 'dcpPfzoningcertification',
    attr1: 'dcpZoningpursuantto',
    attr2: 'dcpZoningtomodify',
  },
  {
    name: 'Zoning Map Amendment',
    countField: 'dcpPfzoningmapamendment',
    attr1: 'dcpExistingmapamend',
    attr2: 'dcpProposedmapamend',
  },
  {
    name: 'Zoning Special Permit',
    countField: 'dcpPfzoningspecialpermit',
    attr1: 'dcpZoningspecialpermitpursuantto',
    attr2: 'dcpZoningspecialpermittomodify',
  },
  {
    name: 'Zoning Text Amendment',
    countField: 'dcpPfzoningtextamendment',
    attr1: 'dcpAffectedzrnumber',
    attr2: 'dcpZoningresolutiontitle',
  },
];

export default class LandUseActionComponent extends Component {
  // actions added by user in current session (pushed each time user selects from dropdown)
  @tracked actionsAddedByUser = [];

  @tracked _selectedActions = All_LAND_USE_ACTION_OPTIONS
    .filter((option) => this.args.pasForm[option.countField]
      || this.args.pasForm[option.attr1]
      || this.args.pasForm[option.attr2]);

  get selectedActions() {
    return [
      ...this._selectedActions,
      ...this.actionsAddedByUser,
    ];
  }

  // sorting: actions from db all on bottom in alphabetical order
  // sorting: new actions all on top, most recently added first
  get sortedSelectedActions() {
    const newActions = this.actionsAddedByUser;

    return this.selectedActions.sort(function (a, b) {
      const includesA = newActions.includes(a);
      const includesB = newActions.includes(b);

      // if actions are both new -- sort most recently added on top
      if (includesA && includesB) {
        return newActions.indexOf(a) - newActions.indexOf(b);
      }

      // if actions are both from db -- sort alphabetically
      if (!includesA && !includesB) {
        return (a.name > b.name) ? 1 : -1;
      }

      // if top action is new and bottom action is from db -- don't reorder
      if (includesA && !includesB) {
        return -1;
      }
    });
  }

  // actions that appear in dropdown sorted alphabetically
  get availableActions() {
    return All_LAND_USE_ACTION_OPTIONS
      .filter((option) => !this.selectedActions.includes(option))
      .sort((a, b) => ((a.name > b.name) ? 1 : -1));
  }

  @action
  addSelectedAction(selectedAction) {
    this.args.pasForm[selectedAction.countField] = 1;
    this.actionsAddedByUser.unshiftObject(selectedAction);
  }

  @action
  removeSelectedAction(actionToRemove) {
    const { pasForm } = this.args;

    // reset all model attributes
    pasForm[actionToRemove.countField] = null;
    pasForm[actionToRemove.attr1] = '';
    pasForm[actionToRemove.attr2] = '';

    this.actionsAddedByUser.removeObject(actionToRemove);
    this._selectedActions.removeObject(actionToRemove);
  }
}
