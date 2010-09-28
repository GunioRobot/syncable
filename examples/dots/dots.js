document.on("dom:loaded", function() {

  dots = new Collection("dots")
  dots.template = "<span style='top: {{y}}px; left: {{x}}px'>O</div>"

  const X_OFFSET = 150
  const Y_OFFSET = 250

  new PeriodicalExecuter(function(i){ 
    angle = Date.now() / 1000
    dots.set(1, {
      x: Math.sin(angle) * 100 + X_OFFSET,
      y: Math.cos(angle) * 100 + Y_OFFSET
    })
    angle = Date.now() / 1000 + Math.PI*2/3
    dots.set(2, {
      x: Math.sin(angle) * 100 + X_OFFSET,
      y: Math.cos(angle) * 100 + Y_OFFSET
    })
    angle = Date.now() / 1000 + Math.PI*4/3
    dots.set(3, {
      x: Math.sin(angle) * 100 + X_OFFSET,
      y: Math.cos(angle) * 100 + Y_OFFSET
    })
  }, 0.01)

})