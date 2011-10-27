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
  users.updateFromJSON(string)

});

document.on("dom:loaded", function(){
  users = new Collection('users')
  users.template = "<li>User {{user}} is {{state}}</li>"
  users.set(1, {user: "pablo", state: "online"})
  users.set(2, {user: "denis", state: "offline"})
})
