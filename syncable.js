function Collection(name) {
  this.name = name
  // MODEL ------------------------------------------------------------------
  // Items of the collection are stores in a Prototype Hash.
  // Use get(), set() and unset() to interface with the Collection,
  // and use the following methods internally:
  //   this.items.get(id) to find item
  //   this.items.set(id) to add/update item
  //   this.items.unset(id) to remove item
  this.items = new Hash({})
  // Adds or replaces the element _id_ on the collection and the DOM
  this.set = function(id, hash) {
    var item = this.items.set(id, hash)
    this.renderItem(id)
    this.afterSetCallbacks.each(function(f) { f(id,hash) })
    return item
  }
  // Returns the data for the element _id_
  this.get = function(id) {
    return this.items.get(id)
  }
  // Removes the element _id_ from the collection and the DOM
  this.unset = function(id) {
    item = this.get(id)
    this.afterUnsetCallbacks.each(function(f) { f(id,item) })
    this.removeElementIfExists(id)
    return this.items.unset(id)
  }
  // Callbacks: Stuff to run after setting an object (new or existing)
  // They are run after the element has been added to the UI
  this.afterSetCallbacks = []
  this.afterSet = function(f) {
    this.afterSetCallbacks.push(f)
  }
  // Callbacks: Stuff to run after unsetting an object (deleting it)
  // They are run before the element is deleted from the UI
  this.afterUnsetCallbacks = []
  this.afterUnset = function(f) {
    this.afterUnsetCallbacks.push(f)
  }

  // VIEW -------------------------------------------------------------------
  // This is the Mustache template we'll use for the views
  this.template = "Please define the 'template' attribute for this collection"
  this.container = $(name) || console.error("There is no element with that id on the DOM: " + name)
  this.itemToHtml = function(id) {
    if(item = this.items.get(id)) {
      return "<div id='" + this.name + "_" + id + "'>" +
                Mustache.to_html(this.template, item) +
             "</div>"
    }
  }

  // CONTROLLER  ------------------------------------------------------------
  this.renderAll = function() {
    var html = ""
    var keys = this.items.keys()
    for(var i=0; i < keys.length; i++)
      html += this.itemToHtml(keys[i])
    this.container.insert({ top: html })
    return html
  }
  this.removeElementIfExists = function(id) {
    var el = $(this.name + "_" + id)
    if(el) return el.remove()
  }
  this.renderItem = function(id) {
    var html = this.itemToHtml(id)
    this.removeElementIfExists(id)
    this.container.insert({ top: html })
    return html
  }
  // {id: 7, user: "micho"}           => adds or updates micho
  // {_action: "unset", id: 3}        => removes item with _id_ 3
  // {_action: "js", js: "alert(5)"}  => executes "alert(5)"
  // {id: 7, user: "micho", collection: "tweets"} => updates the said collection
  this.updateFromJSON = function(payload) {
    var obj = payload.evalJSON()
    // We get the action, which defaults to "set"
    var action = (obj._action || "set")
    delete obj.action
    switch(action) {
      case "set":
        var id = (obj.id || console.error("Incorrect JSON received, missing 'id': " + payload))
        delete obj.id
        return this.set(id, obj)
      case "unset":
        var id = (obj.id || console.error("Incorrect JSON received, missing 'id': " + payload))
        return this.unset(id)
      case "js":
        return eval(obj.js)
      default:
        console.log("Unknown action passed: " + payload)
    }
  }
}
