import Controller from '@ember/controller';
import { optionset } from '../helpers/optionset';

export default class ProjectController extends Controller {
  get publicStatusNotNullVisibilityGeneralPublic() {
    const publicStatus = optionset(['project', 'dcpPublicstatus', 'label', this.model.dcpPublicstatus]);
    const visibility = optionset(['project', 'dcpVisibility', 'label', this.model.dcpVisibility]);
    return publicStatus && visibility === 'General Public';
  }
}
