import Model, { attr, belongsTo } from '@ember-data/model';

export default class LanduseActionModel extends Model {
  @belongsTo('landuse-form', { async: false })
  landuseForm;

  @attr dcpActioncode;

  @attr dcpPreviouslyapprovedactioncode;

  @attr('boolean', { allowNull: true })
  dcpApplicantispublicagencyactions;

  @attr dcpDatadifferentiationmultipleactionsametype;

  @attr dcpNameofzoningresolutionsection;

  @attr dcpZoningresolutionsectionactionispursuant;

  @attr dcpNumberofzoninglotsaffected;

  @attr dcpSquarefootageofzoninglotsaffected;

  @attr dcpSquarefootageoftheproposeddevelopment;

  @attr dcpSquarefootassociatedwithtransferbonus;

  @attr dcpNumberofdu;

  @attr dcpIstheactiontoauthorizeorpermitanopenuse;

  @attr dcpIstheactiontoauthorizeacommercial;

  @attr dcpFollowuptopreviousaction;

  @attr dcpDateofpreviousapproval

  @attr dcpLapsedateofpreviousapproval;

  @attr dcpTypeoflegalinstrument;
}
