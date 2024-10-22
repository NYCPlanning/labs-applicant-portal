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
      projectBrief: 'A [action(s)] [ZR#&apos;s for ZR, ZS, ZA] to facilitate a [new] [# of max stories], [total zsf, (# DU&apos;s)], [use] development, including [sf for each use, sf open space], is being sought by [public/private] [applicant] at [address] in [neighborhood], [Community District], [Borough].',
      primaryContactFirstName: '',
      primaryContactLastName: '',
      primaryContactEmail: '',
      primaryContactPhone: '',
      applicantFirstName: '',
      applicantLastName: '',
      applicantEmail: '',
      applicantPhone: '',
    };
  }
}
