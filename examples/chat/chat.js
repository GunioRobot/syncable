// Enable pusher logging - don't include this in production
Pusher.log = function() {
  if (window.console) window.console.log.apply(window.console, arguments);
};

// Flash fallback logging - don't include this in production
WEB_SOCKET_DEBUG = true;

var pusher = new Pusher('c4d8da3b6c36091f0ac4');
pusher.subscribe('test_channel');
pusher.bind('my_event', function(data) {
  string = JSON.stringify(data)
  console.log(string)
  messages.updateFromJSON(string)
  
});

document.on("dom:loaded", function(){

  messages = new Collection('messages')
  messages.template = "<span class='user'>{{user}}</span><span class='message'>{{message}}</span>"
  messages.set(1, {user: "micho", message: "just joined the room"})

})

document.on("keydown", function(event) {
  if(event.keyCode == 13) { // When you press enter...
    var id = Date.now()
    var user = encodeURI($('user').value)
    var message = encodeURI($('message').value)
    var payload = "http://json-pusher.heroku.com/asd?id="+id+"&user="+user+"&message="+message

    // Add your message to the local collection
    messages.set(id, {user: $('user').value, message: $('message').value})
    
    // Send the message to the JSON-Pusher server, so it's broadcasted
    // The method we're using is inserting an invisible <img> that pings the server. Not ideal..
    $$('body').first().insert({
      top: "<img style='display:none' src='"+payload+"'/>"
    })
    $('message').value = ""
  }
})