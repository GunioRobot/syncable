require 'rubygems'
require 'sinatra'
require 'pusher'
require 'redis'

@@db = Redis.new

Pusher.app_id = 2192
Pusher.app_id = '2192'
Pusher.key = 'c4d8da3b6c36091f0ac4'
Pusher.secret = '50d3a48cd3e7133e7f55'

get '/' do
  "<p>This app echoes whatever you POST into /:channel to Pusher.</p>"
end

post '/' do
  "Please post to a channel, as in /channel_name\n"
end

get '/echo.js' do
  "new Ajax.Request('/your')"
end

get '/:channel/last_messages.js' do
  <<-EOS
    document.on("dom:loaded", function(){

      last_messages = (#{@@db["channels/#{params[:channel]}/last"] || "[]"});
      last_messages.each(function(m) {
        console.log("Loading recent message " + m.id)
        messages.set(m.id, {user: m.user, message: m.message})
      })

    })
  EOS
end

get '/:channel' do
  send_payload(params)
end

post '/:channel' do
  send_payload(params)
end

def send_payload(data)
  Pusher['test_channel'].trigger('my_event', data)
  if params[:id] && params[:channel]
    save_to_redis(params)
  end
  "JSON sent: #{JSON.dump(params)}\n"
end

def save_to_redis(params)
  last_messages = JSON.parse(@@db["channels/#{params[:channel]}/last"] || "[]")
  last_messages.shift if last_messages.size == 20
  last_messages.push(params)
  @@db["channels/#{params[:channel]}/last"] = JSON.dump(last_messages)

  key = "channels/#{params[:channel]}/payloads/#{params[:id]}"
  puts "Saving to Redis: #{key}"
  @@db[key] = JSON.dump(params)
end
