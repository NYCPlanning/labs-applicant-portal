export function oauthMock(nock, options = {}) {
  nock('https://accounts-nonprd.nyc.gov')
    .get('/account/api/user.htm')
    .query(true)
    .reply(200, {
      ERRORS: {
        'cpui.unauthorized': 'The search is unauthorized.', // implies a found user
      },
    })
    .persist();

  nock('https://login.microsoftonline.com:443')
    .post((uri) => uri.includes('oauth2/token'))
    .reply(200, {
      token_type: 'Bearer',
      expires_in: '3600',
      ext_expires_in: '3600',
      expires_on: '1573159181',
      not_before: '1573155281',
      resource: 'https://dcppfsuat2.crm9.dynamics.com',
      access_token: 'test',
      ...options,
    })
    .persist();
}
