import Controller from '@ember/controller';
import { optionset } from '../helpers/optionset';

export default class ProjectController extends Controller {
  get publicStatusGeneralPublicProjects() {
    const isGeneralPublic = this.model.dcpVisibility === optionset(['project', 'dcpVisibility', 'code', 'GENERAL_PUBLIC']);
    return this.model.dcpPublicstatus && isGeneralPublic;
  }
}
