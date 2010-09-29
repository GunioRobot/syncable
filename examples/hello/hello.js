document.on("dom:loaded", function(){

  tweets = new Collection('tweets')
  tweets.template = "{{user}}: {{body}}"
  tweets.set(1, {user: "pablo", body: "Hello, world!"})
  tweets.set(2, {user: "jordi", body: "How does this work?"})
  tweets.set(3, {user: "pablo", body: "just open your console and type instructions!"})
  tweets.set(4, {user: "pablo", body: "look, i can delete this tweet"})
  tweets.unset(4)
  tweets.set(5, {user: "pablo", body: "look, i can replace this tweet"})
  tweets.set(5, {user: "pablo", body: "tweet replaced"})

})