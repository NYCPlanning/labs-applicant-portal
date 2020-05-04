import Controller from '@ember/controller';

export default class LoginErrorController extends Controller {
  /**
    * @return      {bool} true if login route yields error response
    *                     about Contact not existing in CRM.
    */
  get contactNotAssigned() {
    if (this.model.errors) {
      return this.model.errors.some((error) => error.response.code === 'NO_CONTACT_FOUND');
    }

    return [];
  }
}
