document.on("dom:loaded", function() {
  
  emails = new Collection("emails")
  emails.template =
    "<span class='from'>{{from}}</span>" +
    "<span class='title'>{{title}}</span>" +
    "<a href='#' class='button delete'>Delete</a>" +
    "<a href='#' class='button read'>Mark as read</a>" +
    "<a href='#' class='button unread'>Mark as unread</a>"
  emails.set(3, {from: "Nigerian Scammer", title: "FREE MONEY", class: 'read'})
  emails.set(4, {from: "Grandma", title: "Which was your Twitter account?", class: 'read'})
  emails.set(5, {from: "Mother", title: "Check out this PPT", class: 'read'})
  emails.set(10, {from: "Grandma", title: "Please bring me goods", class: 'read'})
  emails.set(20, {from: "Wolf", title: "I can help you get there", class: 'unread'})
  emails.set(30, {from: "Grandma", title: "SCAM ALERT: Don't trust Wolf", class: 'unread'})

})

document.on("click", ".delete", function(e,link){

  var id = link.up('.emails_item').readAttribute('data-id')
  emails.unset(id)
  Event.stop(e)

})

document.on("click", "a.read", function(e,link){

  var id = link.up('.emails_item').readAttribute('data-id')
  emails.setAttribute(id, "class", "read")
  Event.stop(e)

})

document.on("click", "a.unread", function(e,link){

  var id = link.up('.emails_item').readAttribute('data-id')
  emails.setAttribute(id, "class", "unread")
  Event.stop(e)

})

document.on("click", "a.new_email", function(e,link){

  var random = function(array) {
    return array[parseInt(Math.random() * array.length)]
  }

  var from  = random(["Jane","Kathy","Laura","Jessica","Sarah","Jennifer"]) +
              random([0,1,2,3,4,5,6,7,8,9,'_'])
  var title = random(["free","new","please","hi!"]) + " " +
              random(["vi4gr4","pr0n","m0n3y"]) + " " +
              random(["for you!!!!","pleas reply","thx"])
  emails.set(Date.now(), {from: from, title: title, class: "unread"})
  Event.stop(e)

})

