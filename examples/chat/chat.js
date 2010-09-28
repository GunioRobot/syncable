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
  if(event.keyCode == 13) {
    $$('body').first().insert({
      top: "<img style='display:none' src='http://localhost:4567/asd?id=" + Date.now() + "&user=pablo&message=" + $('message').value + "'/>"
    })
    $('message').value = ""
  }
})