class Api::IpMessagingController < ApplicationController

  def token
    device_id = params['device']
    identity = Faker::Internet.user_name

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
