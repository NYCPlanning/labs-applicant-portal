import { Factory, trait } from 'ember-cli-mirage';

export default Factory.extend({
  withLandUseActions: trait({
    dcpRevisedprojectname: 'Testing form',
    dcpPfzoningcertification: 21,
    dcpZoningpursuantto: 'some value',
    dcpZoningtomodify: 'some other val',
    dcpPfzoningtextamendment: 2,
    dcpAffectedzrnumber: '',
    dcpZoningresolutiontitle: '',
    dcpPfchangeincitymap: 4,
  }),
});
