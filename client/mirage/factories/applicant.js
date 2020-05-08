import { Factory, trait } from 'ember-cli-mirage';

export default Factory.extend({
  dcpFirstname: 'Brandyn',
  dcpLastname: 'Friedly',
  dcpEmail: 'bfriedly@planning.nyc.gov',
  dcpAddress: '120 Broadway',
  dcpCity: 'New York',
  dcpState: 1,
  dcpZipcode: '10014',
  dcpPhone: '867-5309',

  individualApplicant: trait({
    targetEntity: 'Applicant',
    dcpType: 'Individual',
    dcpOrganization: null,
  }),
  organizationApplicant: trait({
    targetEntity: 'Applicant',
    dcpType: 'Organization',
    dcpOrganization: 'Planning Labs',
  }),

  applicantTeamMember: trait({
    targetEntity: 'Applicant Team Member',
    dcpType: null,
    dcpOrganization: 'Vandelay Industries',
  }),
});
