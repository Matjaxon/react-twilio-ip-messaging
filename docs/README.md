# Twilio IP Messaging React Component Planning

## Background

Twilio, a telecom API SaaS company, builds various API's that empower developers to imbed telephony products, such as SMS or voice calling, into their applications.

A new product of Twilio's, which is still at beta at the time of this writing, is IP Messaging.  This product allows developers to quickly set up chat applications to instantly connect with users.

The scope of this proposal is to build a React component that handles setting up the connection to Twilio to start the service and build standard widgets for the 4 [default user roles](https://www.twilio.com/docs/api/ip-messaging/guides/permissions#default-roles-permissions):

* Service Admin
* Service User (Default Service User Role)
* Channel Admin
* Channel User (Default Channel Member Role)

The widgets will be designed and labelled in a manner to allow users of the component to easily apply CSS styling to create a seamless appearance.

## Functionality & MVP

With this component, users will be able to:

- [ ] Clear instructions are provided in README for signing up for Twilio IP Messaging
- [ ] Can initiate a Twilio Messaging client through component
- [ ] Can send messages between 2 different clients
- [ ] Sub-component for Service User
- [ ] Sub-component for Channel User
- [ ] Sub-component for Service Admin
- [ ] Sub-component for Channel Admin
- [ ] Widgets styled
- [ ] Component deployed to npm

## Technologies and Technical Challenges

The component will be built using ReactJS and styled with CSS.  

In addition to the `package.json` file, there will least be the following additional scripts:

* `twilio_ip_messenger.jsx` - initialize messaging client and render chat component

A default styling sheet, `style.css`, will be used to provide some default styling.

The primary technical challenge will be becoming familiar with the Twilio IP Messaging service and learning how properly setup chat channels across multiple sessions.

## Implementation Timeline

#### Day 1:
* Complete Twilio IP Messaging quickstart tutorials and read Docs

#### Day 2:
* Setup testing backend
* Setup basic file structure for component

#### Day 3:
* Build primary component and test

### Day 4:
* Style component
* Build functionality for additional sub-components
