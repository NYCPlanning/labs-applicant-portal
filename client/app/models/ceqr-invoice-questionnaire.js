import Model, { attr, belongsTo } from '@ember-data/model';

export default class CeqrInvoiceQuestionnaireModel extends Model {
  @belongsTo('package')
  package;

  @attr()
  dcpIsthesoleaapplicantagovtagency;

  @attr()
  dcpIsthesoleaapplicantagovtagency;

  @attr()
  dcpProjectspolelyconsistactionsnotmeasurable;

  @attr()
  dcpSquarefeet;

  @attr()
  dcpProjectmodificationtoapreviousapproval;

  @attr()
  dcpRespectivedecrequired;
}
