import Model, { attr } from '@ember-data/model';

export default class BblModel extends Model {
    @attr
    dcpBblnumber;

    @attr
    dcpDevelopmentsite;

    @attr
    dcpPartiallot;
}
