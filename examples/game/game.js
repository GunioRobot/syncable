// // Enable pusher logging - don't include this in production
// Pusher.log = function() {
//   if (window.console) window.console.log.apply(window.console, arguments);
// };
//
// // Flash fallback logging - don't include this in production
// WEB_SOCKET_DEBUG = true;
//
// var pusher = new Pusher('c4d8da3b6c36091f0ac4');
// pusher.subscribe('test_channel');
// pusher.bind('my_event', function(data) {
//   string = JSON.stringify(data)
//   console.log(string)
//   users.updateFromJSON(string)
//
// });

document.on("dom:loaded", function(){
  players = new Collection('players')
  players.template = "<div style='position:fixed;left:{{x}};top:{{y}}'>o</div>"
  players.set(1, {x: 50, y: 50})
})

keyTimers = new Hash
activePlayer = 1
totalPlayers = 1

var move = function(keyCode) {
  return function() {
    var id = activePlayer
    var player = players.get(id)
    var spacing = 10
    switch(keyCode) {
      case 37: // left
        players.set(id, {x: player.x - spacing, y: player.y})
        break;
      case 38: // up
        players.set(id, {x: player.x, y: player.y - spacing})
        break;
      case 39: // right
        players.set(id, {x: player.x + spacing, y: player.y})
        break;
      case 40: // down
        players.set(id, {x: player.x, y: player.y + spacing})
        break;
    }
  }
}

document.on("keydown", function(event){
  if(event.keyCode >= 37 && event.keyCode <= 40) {
    if(!keyTimers[event.keyCode])
      keyTimers[event.keyCode] = new PeriodicalExecuter(move(event.keyCode), 0.03)
    Event.stop(event)
  }
  if(event.keyCode == 9) { // tab cycles player
    activePlayer++
    if(activePlayer > totalPlayers) activePlayer = 1
    Event.stop(event)
  }
  if(event.keyCode == 32) { // space creates new player
    totalPlayers++
    players.set(++activePlayer, {x: 50, y: 50})
    Event.stop(event)
  }

})

document.on("keyup", function(event){
  if(keyTimers[event.keyCode]) {
    keyTimers[event.keyCode].stop()
    delete keyTimers[event.keyCode]
  }
})
