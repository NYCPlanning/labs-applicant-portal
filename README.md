# Labs Applicant Portal

# SSL Setup in Local Development
In order for cookies to work across both the client and the server during local development, we must have SSL setup for our development environment. Here's how to set that up:

1. Clone this repo and follow the steps in its README: https://github.com/NYCPlanning/local-cert-generator

2. Grab two files from Step 1 above (of this repo), `server.key` and `server.crt`. Copy and paste both files into BOTH `ssl/` folders under /client and /server.

3. Open up your hosts file on your machine with admin permissions: `/etc/hosts`. 
  - For example, `sudo vim /etc/hosts`

4. Add the following line: `127.0.0.1 local.planninglabs.nyc`
  - ![image](https://user-images.githubusercontent.com/3311663/78998629-fc437e00-7b16-11ea-81ef-edb19b4b1d90.png)


5. Now you have SSL enabled. Go to the root of the app and run: `yarn run start`. It should run both the client and server servers.

## Troubleshooting

### address in use 3000

On `yarn run start`, you may run into the error `EADDRINUSE: address already in use :::3000`. 

To solve this, open Activity Monitor, search for all "node" processes, then force kill them.

Then try `yarn run start` again.

## Why?
Google Chrome is beginning to enforce some restrictions on particular uses of cookies in cross-origin contexts. In our case, our server provides a cookie from one domain and is expected to be sent across subsequent requests via another. The only way to simulate this behavior as it works on a production environment is to run our local development servers with SSL enabled.
