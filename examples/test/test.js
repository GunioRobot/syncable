document.on("dom:loaded", function() {

  tweets = new Collection('tweets')
  tweets.renderAll() // shouldn't fail
  tweets.template = "<span class='user'>{{user}}:</span><span class='body'>{{body}}</span>"
  tweets.renderAll() // shouldn't fail
  tweets.items = new Hash({
    6: { user: "pablo", body: "hola"},
    5: { user: "jordi", body: "ugh"}
  })
  tweets.renderAll()
  tweets.set(7,{ user: "xurde", body: "a ver siete"}) // add item
  tweets.unset(7) // remove existing item
  tweets.unset(1) // remove unexisting item
  tweets.unset(5) // remove existing item
  tweets.set(8,{ user: "ocho", body: "pim pam"}) // new item
  tweets.set(8,{ user: "ocho", body: "bizcocho"}) // replace item
  tweets.set(9,{ user: "nueve", body: "que llueve, que llueve"}) // one more
  tweets.updateFromJSON('{"id":99,"body":"shouldnt see this","user":"you"}')  // add
  tweets.updateFromJSON('{"id":99,"_action":"unset"}')                        // remove 
  tweets.updateFromJSON('{"id":100,"_action":"unset"}')                       // delete unexisting
  tweets.updateFromJSON('{"id":100,"body":"OH","user":"json"}')               // add
  tweets.updateFromJSON('{"id":100,"body":"OH","user":"JSON"}')               // replace previous
  tweets.updateFromJSON('{"_action":"js","js":"var t=1"}')                    // execute js
  tweets.unset(5) // remove existing item

  tweets.setAttribute(9, "body", "LLUEVE")

  // Tests for callbacks
  log_id = function(id,data) { console.log("Id: " + id ) }
  log_data = function(id,data) { console.log("Data: " + data) }
  log_delete = function(id,item) { console.log("Item " + id + " has been deleted: " + item) }

  tweets.afterSet(log_id)
  tweets.afterSet(log_data)
  tweets.afterUnset(log_delete)

  tweets.set(11, { user: "once", body: "once"})
  tweets.unset(11)
  tweets.set(12, { user: "doce", body: "12"})

})