import Model, { attr, belongsTo } from '@ember-data/model';

export default class LanduseActionModel extends Model {
  @belongsTo('landuse-form', { async: false })
  landuseForm;

  @belongsTo('zoning-resolution', { async: false })
  zoningResolution;

  @attr dcpActioncode;

  @attr dcpPreviouslyapprovedactioncode;

  @attr('boolean', { allowNull: true })
  dcpApplicantispublicagencyactions;

  @attr dcpDatadifferentiationmultipleactionsametype;

  @attr dcpNameofzoningresolutionsection;

  @attr dcpPreviouslyapprovedapplicationnumbers;

  @attr dcpZoningsectionstobemodified;

  @attr('number')
  dcpNumberofzoninglotsaffected;

  @attr('number')
  dcpSquarefootageofzoninglotsaffected;

  @attr('number')
  dcpSquarefootageoftheproposeddevelopment;

  @attr('number')
  dcpSquarefootassociatedwithtransferbonus;

  @attr('number')
  dcpNumberofdu;

  @attr dcpIstheactiontoauthorizeorpermitanopenuse;

  @attr dcpIstheactiontoauthorizeacommercial;

  @attr dcpFollowuptopreviousaction;

  @attr dcpDateofpreviousapproval

  @attr dcpLapsedateofpreviousapproval;

  @attr dcpTypeoflegalinstrument;

  @attr dcpModsubjectto197c;

  @attr dcpIndicatewhetheractionisamodification;

  @attr dcpCrfnnumber;

  @attr dcpRecordationdate;

  @attr chosenZoningResolutionId;
}
