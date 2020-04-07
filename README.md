# Labs Applicant Portal

# SSL Setup in Local Development
In order for cookies to work across both the client and the server during local development, we must have SSL setup for our development environment. Here's how to set that up:

1. Follow this step-by-step guide: https://www.freecodecamp.org/news/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec/. It will generate some files.

2. Grab two files from step 1, `server.key` and `server.crt`. Copy and paste both files into BOTH `ssl/` folders under /client and /server.

3. With SSL enabled, go to the root of the app and run: `yarn run start`. It should run both the client and server servers.

## Why?
Google Chrome is beginning to enforce some restrictions on particular uses of cookies in cross-origon contexts. In our case, our server provides a cookie from one domain and is expected to be sent across subsequent requests via another. The only way to simulate this behavior as it works on a production environment is to run our local development servers with SSL enabled.
