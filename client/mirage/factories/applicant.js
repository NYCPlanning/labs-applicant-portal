import { Factory, trait } from 'ember-cli-mirage';

export default Factory.extend({
  firstName: 'Brandyn',
  lastName: 'Friedly',
  emailAddress: 'bfriedly@planning.nyc.gov',
  address: '120 Broadway',
  city: 'New York',
  state: 'NY',
  zip: '10014',
  phone: '867-5309',

  individualApplicant: trait({
    targetEntity: 'Applicant',
    applicantType: 'Individual',
    organization: null,
  }),
  organizationApplicant: trait({
    targetEntity: 'Applicant',
    applicantType: 'Organization',
    organization: 'Planning Labs',
  }),

  applicantTeamMember: trait({
    targetEntity: 'Applicant Team Member',
    applicantType: null,
    organization: 'Vandelay Industries',
  }),
});
