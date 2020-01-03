# demisto-web-form-angular

This reference Angular project creates a Demisto incident through use of a web-based form.  The purpose is to trigger a playbook which will perform an automated action behind the scenes

It consists of two main components:

- A Node.js server application (required due to CORS restrictions)
- An Angular client application which will be delivered to users' web browsers

## PLEASE NOTE

This is a simplistic, sample implementation, for reference purposes only. It is **NOT** intended for use in a production environment.  

## SECURITY

There is no authentication mechanism in this application for client communication.  Any user connecting to this app will be able to submit the form, assuming Demisto API communications have been initialised using a Demisto API key.

**ASSUME THAT THIS IMPLEMENTATION IS INSECURE** and that it will require numerous changes to be used in production.

## Running for the First Time

The client is not distributed in pre-built form, so to run it for the first time, one must either start the Angular client in development mode or build the client using the below instructions.  If running in development mode, this means that one will have two servers running - both the Node.js server and the Angular compiler / server.

1.  Install Node.js.  This is beyond the scope of this Readme.
2.  Clone this repository by running `git clone https://github.com/tundisto/demisto-web-form-angular.git`.
2.  Install all necessary packages by running `npm install` from the cloned repo's directory.
3.  Start the Node.js server by running `npm run server`.
4.  In a separate terminal, start the Angular compiler using `npm start`.

## The Scenario

This scenario creates an incident in Demisto, for the purposes of provisioning a new employee.  The web form collects information about the new employee from the end user, who is likely the new employee's manager, and then submits it to Demisto as a new incident via the Node.js server.  Demisto can then run a playbook to do things like:

- Create an account in Active Directory
- Assign groups to the user's account
- Do any custom account provisioning based on the user's group
- Order a computer for the user
- Create a ticket for IT to image the computer and send it to the user

This scenario is not an out-of-the-box (OOTB) scenario, meaning that it will not run successfully with an OOTB Demisto installation without customisation.

## Demisto Configuration

These are the relevant details to enable the app to run successfully on the Demisto side:

**Incident Type**: New Employee Request

**Incident Fields:**

| Name | Type |
| ---- | ---- |
| Requestor | Short text |
| First Name | Short text |
| Last Name | Short text |
| Hire Date | Date picker |
| Work Location | Single select | 
| Home Address Street | Short text |
| Home Address Street 2 | Short text |
| Home Address City | Short text |
| Home Address State | Short text |
| Home Address ZIP | Short text |
| Home Address Country | Short text |
| Home Phone | Short text |
| Mobile Phone | Short text |
| AD Groups | Short text |
| Computer Type | Single select |
| Computer Model | Short text |
| Form Factor | Single select |

### Demisto API Key

Before this app can be used, An API key must first be generated within Demisto. using `Settings -> Integrations -> API Keys -> Get Your Key`.  Enter this key and the server infornation into the 

### Note on Playbook

A playbook is not yet provided as part of this sample.  It will create a Demisto incident with the necessary fields, but a playbook would still beed to be built to perform any automated actions based on the form.

## Running the Node.js server

Run `npm run server` to start the Node.js server.  If the `dist/` subdirectory is found, the pre-compiled Angular application will be served statically from it.  If `dist/` isn't found, it will run in development mode by proxying http://localhost:4200.

## Running the Node.js server in development mode

Use `npm run server-dev` to run the server in development mode, which will only proxy http://localhost:4200, rather than serving `dist/` statically.

## Running the Angular client in development mode

Run `npm start` to start the Angular client app in development mode, allowing live-reload if making changes to the client source (in the `src/` subdirectory).

## Building the Angular client

Run `ng build` to build the project in development mode. The build artifacts will be stored in the `dist/` subdirectory. Use the `--prod` flag for a production build.

## Connecting to the Application

Browse to `http://<yourserverip>:4000` in your favourite web browser to launch the application.