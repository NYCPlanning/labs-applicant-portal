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
    applicantType: 'Individual',
    dcpOrganization: null,
  }),
  organizationApplicant: trait({
    targetEntity: 'Applicant',
    applicantType: 'Organization',
    dcpOrganization: 'Planning Labs',
  }),

  applicantTeamMember: trait({
    targetEntity: 'Applicant Team Member',
    applicantType: null,
    dcpOrganization: 'Vandelay Industries',
  }),
});
