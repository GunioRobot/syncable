/**
 *  Syncable
 *  Item collections for client-side content, updatable in real-time
 *
 *  This library allows you to sync collections of items with data on the HTML UI.
 *  It does so by storing each item in JSON, and providing methods to update the elements.
 *  
 *  Each collection is linked to an HTML element with a given ID, which is auto-detected.
 *  Whenever you add, replace or delete elements, the DOM will be updated automagically.
 *
 *  New data can be invokes directly from JS or triggered by push notifications or data polling.
 *  You can also configure callback functions after inserting or deleting elements.
 *
 *  ##### Example
 *
 *      <div id="tweets"></div>
 *      
 *      <script type="text/javascript">
 *        // We create a collection of tweets, that links itself to the #tweets div.
 *        tweets = new Collection('tweets')
 *        
 *        // We assign a Mustache template to be rendered
 *        tweets.template = "<p>{{user}}: {{body}}</p>"
 *        
 *        // We load some initial items
 *        tweets.items = new Hash({
 *          6: { user: "pablo", body: "hola"},
 *          5: { user: "jordi", body: "ugh"}
 *        })
 *        
 *        // Now we render them to the page. The UI will now have the rendered elements
 *        tweets.renderAll()
 *
 *        // We can manipulate them at any moment with JS functions. The UI will update.
 *        tweets.set(7,{ user: "xurde", body: "a ver"}) // add item
 *        tweets.unset(5) // remove existing item
 *        
 *        // If we get JSON payloads from any channel, we can process those safely
 *        tweets.updateFromJSON('{"id":99,"body":"shouldnt see this","user":"you"}')  // add
 *        tweets.updateFromJSON('{"id":99,"_action":"unset"}')                        // remove 
 *        tweets.updateFromJSON('{"id":100,"body":"OH","user":"json"}')               // add
 *
 *        // You can also execute arbitrary JS on the client, receiving it from a channel
 *        tweets.updateFromJSON('{"_action":"js","js":"alert(1)"}')
 *
**/

var Collection = function (name) {

  this.name = name

  /**
   *  Model
   *
   *  Items of the collection are stores in a Prototype Hash.
   *
   *  Use get(), set() and unset() to interface with the Collection,
   *  and use the following methods internally:
   *  - this.items.get(id) to find item
   *  - this.items.set(id, {name:"pablo"}) to add/update item
   *  - this.items.unset(id) to remove item
   *
   *  There are two special attributes for each model:
   *  - id: will be used to build the item's id and data-id attributes on the HTML
   *  - class: will be used to build the class name on the HTML
  **/

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
    var item = this.get(id)
    this.afterUnsetCallbacks.each(function(f) { f(id,item) })
    this.removeElementIfExists(id)
    return this.items.unset(id)
  }
  
  // Updates an attribute atomically. Doesn't use the callbacks.
  this.setAttribute = function(id, attr, value) {
    var item = this.get(id)
    if(item[attr] != value) {
      item[attr] = value
      $(this.name+"_"+id).replace(this.itemToHtml(id))
    }
    return item
  }

  // Callback: Stuff to run after setting an object (new or existing)
  // They are run after the element has been added to the UI
  this.afterSetCallbacks = []
  this.afterSet = function(f) {
    this.afterSetCallbacks.push(f)
  }

  // Callback: Stuff to run after unsetting an object (deleting it)
  // They are run before the element is deleted from the UI
  this.afterUnsetCallbacks = []
  this.afterUnset = function(f) {
    this.afterUnsetCallbacks.push(f)
  }

  /**
   *  View
   *
   *  Each item is rendered into HTML by using Mustache templates.
   *
  **/

  // This is the Mustache template we'll use for the views
  this.template = "Please define the 'template' attribute for this collection"

  // The DOM container for the collection is detected upon initialization
  this.container = $(name) || console.error("There is no element with that id on the DOM: " + name)

  // Each item can be rendered to HTML using the template
  this.itemToHtml = function(id) {
    var item = this.items.get(id)
    if(item) {
      var dom_id = this.name + "_" + id
      var dom_class = this.name + "_item"
      if(item.class) dom_class += " "+item.class
      return "<div class='"+dom_class+"' id='"+dom_id+"' data-id='"+id+"'>" +
                Mustache.to_html(this.template, item) +
             "</div>"
    }
  }

  /**
   *  Controller
   *  
   *  The collection interfaces with the DOM by rendering and updating elements
   *
  **/

  // Renders all the elements in the collection to the container
  this.renderAll = function() {
    var html = ""
    var keys = this.items.keys().sort()
    for(var i=0; i < keys.length; i++)
      html += this.itemToHtml(keys[i])
    this.container.insert({ top: html })
    return html
  }
  
  // Removes an element only from the UI (doesn't affect the model)
  this.removeElementIfExists = function(id) {
    var el = $(this.name + "_" + id)
    if(el) return el.remove()
  }
  
  // Renders an item on the top of the container
  this.renderItem = function(id) {
    var html = this.itemToHtml(id)
    this.removeElementIfExists(id)
    this.container.insert({ top: html })
    return html
  }

  /**
   *  You can update the collection using JSON payloads, by calling updateFromJSON(payload)
   *  This is for use with push notifications, or polling.
   * 
   *  The default action is _set_. To delete elements, use the _unset_ action as in the example.
   *  You can also execute javascript on the client. Useful for custom behaviour.
   *  id and _action are special parameters, and don't get read as part of the item's data.
   *
   *      {id: 7, user: "micho"}           => adds or updates micho
   *      {_action: "unset", id: 3}        => removes item with _id_ 3
   *      {_action: "js", js: "alert(5)"}  => executes "alert(5)"
   *
  **/
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
        return false
    }
  }

}
