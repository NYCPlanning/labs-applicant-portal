import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class ProjectsNewRoute extends Route.extend(
  AuthenticatedRouteMixin,
) {
  authenticationRoute = '/';

  async model() {
    return {
      projectName: '',
      borough: '',
      applicantType: '',
      primaryContactFirstName: '',
      primaryContactLastName: '',
      primaryContactEmail: '',
      primaryContactPhone: '',
      applicantFirstName: '',
      applicantLastName: '',
      applicantEmail: '',
      applicantPhone: '',
      projectBrief: '',
    };
  }
}
