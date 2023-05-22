# Labs Applicant Portal

This is a monorepo containing both the server and client code for the ZAP Applicant Portal.

## Prerequisite Tools

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://ember-cli.com/)
* [Yarn](https://yarnpkg.com/)

## Prerequisite SSL Setup for Local Development
In order for cookies to work across both the client and the server during local development, we must have SSL setup for our development environment.

### Why is this necessary?
Google Chrome is beginning to enforce some restrictions on particular uses of cookies in cross-origin contexts. In our case, our server provides a cookie from one domain and is expected to be sent across subsequent requests via another. The only way to simulate this behavior as it works on a production environment is to run our local development servers with SSL enabled.

### Steps to setup SSL locally
1. Clone this repo and follow the steps in its README: https://github.com/NYCPlanning/local-cert-generator

2. Note that Step 1 generates two files in the `local-cert-generator` repo: `server.key` and `server.crt`. Later, you will need to copy/paste these files into the `labs-applicant-portal` repo to run the application (Steps 2 and 3 under "Running the App").

3. Open up your hosts file on your machine with admin permissions: `/etc/hosts`. For example, `sudo vim /etc/hosts`

4. Add the following line: `127.0.0.1 local.planninglabs.nyc` ![image](https://user-images.githubusercontent.com/3311663/78998629-fc437e00-7b16-11ea-81ef-edb19b4b1d90.png)


## Running the App
Once you have SSL enabled...
##### note: the client and server each run on their own node version, independent of each other. Refer to the .nvmrc of their respective folders to determine the appropriate node verion.
1. Clone `labs-applicant-portal` to your computer.
2. Navigate into the `server` folder.
    - Create the `development.env` file using variables stored on 1Password.
    - Copy the `server.key` and `server.crt` files from your `local-cert-generator` repo and paste both files into the `labs-applicant-portal/server/ssl/` folder.
    - Run `yarn` to install dependencies for the server.
3. Navigate into the `client` folder.
    - Copy the `server.key` and `server.crt` files from your `local-cert-generator` repo and paste both files into the `labs-applicant-portal/client/ssl/` folder.
    - Run `yarn` to install dependencies for the client.
4. Go to the root of the app `cd ..` and run: `yarn run start`. It will run both the client and server servers.

## Troubleshooting

### Address in use 3000

On `yarn run start`, you may run into the error `EADDRINUSE: address already in use :::3000`. 

To solve this, open Activity Monitor, search for all "node" processes, then force kill them.

Then try `yarn run start` again.

## Maintenance Mode

To enable "maintenance mode", set two environment variables in the frontend (Netlify) build environment:

MAINTENANCE_START='06/28/2021 19:00'
MAINTENANCE_END='06/29/2021 19:00'

Use the date format in the example above. This will warn of upcoming maintenance (if the start date is in the future), disable
the login, and disappear once the end period has passed.

