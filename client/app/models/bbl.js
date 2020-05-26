import Model, { attr, belongsTo } from '@ember-data/model';

export const BOROUGHS_OPTIONSET = {
  BRONX: {
    code: 717170000,
    label: 'Bronx',
  },
  BROOKLYN: {
    code: 717170002,
    label: 'Brooklyn',
  },
  MANHATTAN: {
    code: 717170001,
    label: 'Manhattan',
  },
  QUEENS: {
    code: 717170003,
    label: 'Queens',
  },
  STATEN_ISLAND: {
    code: 717170004,
    label: 'Staten Island',
  },
  CITYWIDE: {
    code: 717170005,
    label: 'Citywide',
  },
};

export default class BblModel extends Model {
  @belongsTo('pas-form')
  pasForm;

  @belongsTo('project')
  project;

  @attr
  dcpBblnumber;

  @attr('boolean', { allowNull: true })
  dcpDevelopmentsite;

  @attr
  dcpPartiallot;

  @attr('number')
  dcpUserinputborough;

  @attr('string')
  dcpUserinputblock;

  @attr('string')
  dcpUserinputlot;
}
