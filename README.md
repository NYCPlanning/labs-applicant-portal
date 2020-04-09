# Labs Applicant Portal

# SSL Setup in Local Development
In order for cookies to work across both the client and the server during local development, we must have SSL setup for our development environment. Here's how to set that up:

1. Clone this repo and follow the steps in its README: https://github.com/NYCPlanning/local-cert-generator

2. Grab two files from step 1, `server.key` and `server.crt`. Copy and paste both files into BOTH `ssl/` folders under /client and /server.

3. Open up your hosts file on your machine: `/etc/hosts`. Add the following line: `127.0.0.1 local.planninglabs.nyc`

4. With SSL enabled, go to the root of the app and run: `yarn run start`. It should run both the client and server servers.

## Why?
Google Chrome is beginning to enforce some restrictions on particular uses of cookies in cross-origon contexts. In our case, our server provides a cookie from one domain and is expected to be sent across subsequent requests via another. The only way to simulate this behavior as it works on a production environment is to run our local development servers with SSL enabled.
