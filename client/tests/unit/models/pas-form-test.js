import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | pas form', function(hooks) {
  setupTest(hooks);

  // NOTE: certain conditions have to be met in order for a field to be considered REQUIRED
  // These tests check three scenarios:
  // 1) ALL conditions are met (and therefore every field is required) AND each required field is filled
  // 2) SOME conditions are met (and therefore only SOME fields are required) AND each required field is filled
  // 3) ALL conditions are met (and therefore ALL fields are required) BUT one required field is blank
  test('pasFormRequiredFieldsFilled is true if ALL conditions are met and each required field is filled', function(assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('pas-form', {
      dcpUrbanrenewalarea: '717170000',
      dcpUrbanareaname: 'urban area name',
      dcpLanduseactiontype2: true,
      dcpPleaseexplaintypeiienvreview: 'explanation',
      dcpProjectareaindustrialbusinesszone: true,
      dcpProjectareaindutrialzonename: 'zone name',
      dcpIsprojectarealandmark: true,
      dcpProjectarealandmarkname: 'landmark name',
      dcpProposeddevelopmentsiteinfoother: true,
      dcpProposeddevelopmentsiteotherexplanation: 'exlananation',
      dcpIsinclusionaryhousingdesignatedarea: true,
      dcpInclusionaryhousingdesignatedareaname: 'area name',
      dcpDiscressionaryfundingforffordablehousing: '717170000',
      dcpHousingunittype: 4,
      dcpPfzoningauthorization: 2,
      dcpZoningauthorizationpursuantto: 'title 3',
      dcpZoningauthorizationtomodify: 'title 3',
      dcpPfzoningcertification: 2,
      dcpZoningpursuantto: 'title 3',
      dcpZoningtomodify: 'title 3',
      dcpPfzoningmapamendment: 2,
      dcpExistingmapamend: 'title 3',
      dcpProposedmapamend: 'title 3',
      dcpPfzoningspecialpermit: 2,
      dcpZoningspecialpermitpursuantto: 'title 3',
      dcpZoningspecialpermittomodify: 'title 3',
      dcpPfzoningtextamendment: 2,
      dcpAffectedzrnumber: 'title 3',
      dcpZoningresolutiontitle: 'title 3',
    });

    assert.equal(model.pasFormRequiredFieldsFilled, true);
  });

  test('pasFormRequiredFieldsFilled is true if SOME conditions are met ANDs each required field is filled', function(assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('pas-form', {
      // NOT NEEDED because dcpUrbanrenewalarea = '717170001'
      dcpUrbanrenewalarea: '717170000',
      dcpUrbanareaname: 'urban area name',
      // ---------------------------------------
      dcpLanduseactiontype2: true,
      dcpPleaseexplaintypeiienvreview: 'explanation',
      // NOT NEEDED because dcpProjectareaindustrialbusinesszone is false
      dcpProjectareaindustrialbusinesszone: false,
      dcpProjectareaindutrialzonename: 'zone name',
      // ---------------------------------------
      dcpIsprojectarealandmark: true,
      dcpProjectarealandmarkname: 'landmark name',
      dcpProposeddevelopmentsiteinfoother: true,
      dcpProposeddevelopmentsiteotherexplanation: 'exlananation',
      dcpIsinclusionaryhousingdesignatedarea: true,
      dcpInclusionaryhousingdesignatedareaname: 'area name',
      dcpDiscressionaryfundingforffordablehousing: '717170000',
      dcpHousingunittype: 4,
      // NOT NEEDED because dcpPfzoningauthorization < 0
      dcpPfzoningauthorization: 0,
      dcpZoningauthorizationpursuantto: 'title 3',
      dcpZoningauthorizationtomodify: 'title 3',
      // ---------------------------------------
      dcpPfzoningcertification: 2,
      dcpZoningpursuantto: 'title 3',
      dcpZoningtomodify: 'title 3',
      dcpPfzoningmapamendment: 2,
      dcpExistingmapamend: 'title 3',
      dcpProposedmapamend: 'title 3',
      dcpPfzoningspecialpermit: 2,
      dcpZoningspecialpermitpursuantto: 'title 3',
      dcpZoningspecialpermittomodify: 'title 3',
      dcpPfzoningtextamendment: 2,
      dcpAffectedzrnumber: 'title 3',
      dcpZoningresolutiontitle: 'title 3',
    });

    assert.equal(model.pasFormRequiredFieldsFilled, true);
  });

  test('pasFormRequiredFieldsFilled is false if ALL conditions are met BUT one required field is blank', function(assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('pas-form', {
      dcpUrbanrenewalarea: '717170000',
      // dcpUrbanareaname is blank
      dcpUrbanareaname: '',
      // ---------------------------------------
      dcpLanduseactiontype2: true,
      dcpPleaseexplaintypeiienvreview: 'explanation',
      dcpProjectareaindustrialbusinesszone: true,
      dcpProjectareaindutrialzonename: 'zone name',
      dcpIsprojectarealandmark: true,
      dcpProjectarealandmarkname: 'landmark name',
      dcpProposeddevelopmentsiteinfoother: true,
      dcpProposeddevelopmentsiteotherexplanation: 'exlananation',
      dcpIsinclusionaryhousingdesignatedarea: true,
      dcpInclusionaryhousingdesignatedareaname: 'area name',
      dcpDiscressionaryfundingforffordablehousing: '717170000',
      dcpHousingunittype: 4,
      dcpPfzoningauthorization: 2,
      dcpZoningauthorizationpursuantto: 'title 3',
      dcpZoningauthorizationtomodify: 'title 3',
      dcpPfzoningcertification: 2,
      dcpZoningpursuantto: 'title 3',
      dcpZoningtomodify: 'title 3',
      dcpPfzoningmapamendment: 2,
      dcpExistingmapamend: 'title 3',
      dcpProposedmapamend: 'title 3',
      dcpPfzoningspecialpermit: 2,
      dcpZoningspecialpermitpursuantto: 'title 3',
      dcpZoningspecialpermittomodify: 'title 3',
      dcpPfzoningtextamendment: 2,
      dcpAffectedzrnumber: 'title 3',
      dcpZoningresolutiontitle: 'title 3',
    });

    assert.equal(model.pasFormRequiredFieldsFilled, false);
  });
});
