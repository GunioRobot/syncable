// Enable pusher logging - don't include this in production
Pusher.log = function() {
  if (window.console) window.console.log.apply(window.console, arguments);
};

// Flash fallback logging - don't include this in production
WEB_SOCKET_DEBUG = true;

var pusher = new Pusher('c4d8da3b6c36091f0ac4');
pusher.subscribe('chat_example');
pusher.bind('syncable', function(data) {
  string = JSON.stringify(data)
  console.log(string)
  messages.updateFromJSON(string)

});

sendMessage = function(id, user, message) {
  var user_enc = encodeURI(user)
  var message_enc = encodeURI(message)
  var payload = "http://json-pusher.heroku.com/chat_example?id="+id+"&user="+user_enc+"&message="+message_enc

  // Add your message to the local collection
  messages.set(id, {user: user, message: message})

  // Send the message to the JSON-Pusher server, so it's broadcasted
  // The method we're using is inserting an invisible <img> that pings the server. Not ideal..
  $$('body').first().insert({
    top: "<img style='display:none' src='"+payload+"'/>"
  })
}

document.on("dom:loaded", function(){

  messages = new Collection('messages')
  messages.template = "<span class='user'>{{user}}</span><span class='message'>{{message}}</span>"
  sendMessage(Date.now(), "user", "just joined the room")

})

document.on("keydown", function(event) {
  if(event.keyCode == 13) { // When you press enter...
    sendMessage(Date.now(), $('user').value, $('message').value)
    $('message').value = ""
  }
})