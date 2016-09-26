# Twilio IP Messaging React Component

[Published package on npm](https://www.npmjs.com/package/twilio-ip-messaging-react)

## Overview

This component provides a basic means of implementing Twilio's IP Messaging product.  After setting up the basic backend configuration to provide a token to access Twilio's API, you can use this component to create new channels and invite members to those channels.

In addition to providing basic real time chat capabilities, this component allows you to pass in callbacks to respond to events triggered by Twilio's API (e.g. "memberJoined", "messageAdded").

NOTE:  As Twilio's IP Messaging is a paid service, you must have an active Twilio account and provide a backend web service to which this component can make a request to retrieve an authorization token.  A detailed example has been provided below to assist with navigating this process.  You can also refer to [Twilio's IP Messaging documentation](https://www.twilio.com/docs/api/ip-messaging) for additional information.

## Installation

This package can be installed via NPM:

```
npm install twilio-ip-messaging-react

```

Ensure that you have React installed.

Add the following scripts to your application.
```
<script src="https://media.twiliocdn.com/sdk/js/common/v0.1/twilio-common.min.js"></script>
<script src="https://media.twiliocdn.com/sdk/rtc/js/ip-messaging/v0.10/twilio-ip-messaging.min.js"></script>
```
The Twilio.IPMessaging and Twilio.AccessManager namespaces should then be available in the window scope of your JavaScript application.

## Configuration

Embed the component in your application as follows:  

```
import IPChatClient from
import React from 'react';
'twilio-ip-messaging-react';


class App extends React.Component {
  ...
  render() {
    return
      ...
      <IPChatClient tokenUrl={tokenUrl} />
      ...
    );
  }
}
```

The tokenUrl prop in the above example is the url to which the component can make an AJAX call to to retrieve authorization from your application to use your Twilio IP Messaging Service.  Refer to the 'Backend Requirements' section below for details and an example.

NOTE:  Twilio's IP Messaging Service does expect a messaging service to be initialized with a device type.  At this time, this component defaults the device for all initialized messaging clients as "browser".

## Backend Requirements

You are responsible for authorizing users to access your Twilio IP Messaging Service.  To do this, you must provide a URL to which this component can make a `GET` request to in order to retrieve the initial token to initialize the messaging client.  This URL will also be utilized to retrieve a new token once the current one expires.  

Refer to the [Twilio User Identity & Access Token documentation](https://www.twilio.com/docs/api/ip-messaging/guides/identity) for resources on how to setup the backend service.

The URL provided to the component must provide an object that offers an `identity` and a `token`.

```
{
  identity: 'matt',
  token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxp...'
}
```

The `identity` will be whatever you want to displayed as each user's name in the chat.  The `token` allow the Twilio API to connect the user to your messaging service.

#### Example Backend

Here is an [example Rails controller](https://github.com/Matjaxon/react-twilio-ip-messaging/blob/master/ReactIPMessagingTest2/app/controllers/api/ip_messaging_controller.rb) used to provide the token to the component.  This controller assumes that users will be logged in and stored as `current_user`.  The `current_users`'s `username` is then used as their `identity`.  Note that the `identity` should be unique as any members invited to join a channel will be invited by their `identity`.

```
# app/controllers/api/ip_messaging_controller.rb
class Api::IpMessagingController < ApplicationController

  def token
    device_id = params['device']
    identity = current_user.username

    endpoint_id = "ReactIPMessagingTest:#{identity}:#{device_id}"

    token = Twilio::Util::AccessToken.new ENV['TWILIO_ACCOUNT_SID'],
    ENV['TWILIO_API_KEY'], ENV['TWILIO_API_SECRET'], 3600, identity

    # Create IP Messaging grant for our token
    grant = Twilio::Util::AccessToken::IpMessagingGrant.new
    grant.service_sid = ENV['TWILIO_IPM_SERVICE_SID']
    grant.endpoint_id = endpoint_id
    token.add_grant grant

    # Generate the token and send to client
    render json: {identity: identity, token: token.to_jwt}, status: 200
  end
end


# routes.rb
Rails.application.routes.draw do
  ...
  namespace :api, defaults: {format: :json} do
    get 'token', to: 'ip_messaging#token'
    ...
  end
  ...
end

```

Using this as the example backend, when the the `twilio-ip-messaging-react` component is embedded in the application as follows:

```
import React from 'react';
import IPChatClient from 'twilio-ip-messaging-react';


class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return
      <IPChatClient tokenUrl="api/token" />
    );
  }
}
```

## Loading Default Styles

While every HTML element within the component has a className to allow for fully customized styling, a default stylesheet is provided.  Within each component, the following line has been included:

```
require('./ip_messaging_stylesheet.css');
```
If you're using Webpack, require these modules:
```
npm install --save style-loader css-loader
```

Then include the following in your the ```module: loaders``` section of `webpack.config.js`:

```
module: {
  loaders: [
    ...
    {
      test: /\.css$/,
      loader: "style-loader!css-loader"
    },
    ...
  ]
}
```

This will allow the the stylesheet to be required like any of the other sub-components.

## Example

![](http://res.cloudinary.com/dbwkodu79/image/upload/v1474850427/twilio_ip_messenger/messenger-screenshot.png)

## Limitations

All channels are currently defaulted to private and you must add invite members.  Public channels can be created by making a `POST` to the Twilio API through a tool such as Postman.

All instances will have the channel manager wrapper.  An attributes prop needs to be implemented to pass in options that should dictate whether or not the channel manager should be shown, and whether or not the user should have the ability to add channels or invite members to a channel they are currently in.

## Project Planning

See planning README at [docs/README.md](docs/README.md)

## Future Implementations

* Ability to pass in additional attributes.
* Stand-alone implementation of chat channel with no channel manager.
* Error handling responses (e.g. No user found).
* Enhanced styling options passed as prop.
* Inline styling for all elements to avoid. requirement that stylesheet be required by component.
* Channel Admin component for service administration, including deleting channels and creation of public channels through GUI.
