document.on("dom:loaded", function() {

  tweets = new Collection('tweets')
  tweets.renderAll() // shouldn't fail
  tweets.template = "<p>{{user}}: {{body}}</p>"
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

  log_id = function(id,data) { console.log("Id: " + id ) }
  log_data = function(id,data) { console.log("Data: " + data) }
  log_delete = function(id,item) {console.log("Item " + id + " has been deleted: " + item) }
  comments = new Collection('comments')
  //comments.template = "<div class='comment' data-editable-before='1281942676000' data-project='{{project_id}}' data-user='{{user_id}}' id='comment_{{id}}'>\n      <div class='info'>\n        {{#user}}\n          <a class='micro_avatar' href='/users/{{username}}' style='background: url({{avatar_url}}) no-repeat'></a>\n        {{/user}}\n      </div>\n      <div class='block'>\n        <div class='actions_menu'>\n          <span class='actiondate'><time class=\"timeago\" data-msec=\"1281941776000\" datetime=\"2010-08-16T08:56:16+02:00\" pubdate=\"true\">Agosto 16, 2010 08:56</time></span>\n          <img class=\"triangle\" src=\"/images/triangle.png\" />\n          <div class='extra'>\n            <a href=\"/comments/{{id}}/edit\" class=\"edit\" data-uneditable-message=\"El comentario no se puede editar 15 minutos despus de publicarse\" rel=\"facebox\">Editar comentario</a>\n            <a href=\"/comments/{{id}}\" class=\"delete\" data-confirm=\"Seguro que quieres borrar este comentario?\" data-method=\"delete\" data-remote=\"true\">Borrar</a>\n          </div>\n        </div>\n        <div class='body textilized'>\n          <div class='before'>\n            {{#user}}\n              <a href=\"/users/{{username}}\" class=\"user\">{{first_name}} {{last_name}}</a>\n            {{/user}}\n          </div>\n          {{{body_html}}}\n        </div>\n      </div>\n      <div class='clear'></div>\n    </div>"
  comments.template = "just a body: {{body}}"
  comments.afterSet(log_id)
  comments.afterSet(log_data)
  comments.afterUnset(log_delete)

  comments.set(1, {body: "Example"})
  comments.unset(1, {body: "Example"})
//  comments.set(1, comments_json.first())

})