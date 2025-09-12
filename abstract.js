points=[]
colors=['#d7296c', '#b01aa8','#a92bb4','#723cc0','#5c4ded','#45aec9','#de6f95','#1780a1','#0091bd']
shapers=[]

function setup() {
  createCanvas(1112, 834);
  //blendMode(LIGHTEST)
  for(let i=0; i<60; i++){
    let x= random(width)
    let y= random(height)
    points.push(new pointy(x, y, random(0.01, 1)))
  }
  
  for(let i=0; i<20; i++){
    shapers.push(new shaper())
  }
}

function draw() {
  clear();
  background(0);
  for(let pointy of points){
    pointy.move();
    //pointy.show();
  }
   for(let shaper of shapers){
    shaper.show()
  }
  for(let i=0; i<points.length; i++){
    for(let j=0; j<points.length; j++){
      if(p5.Vector.dist(points[i].pos, points[j].pos)<100){
        stroke(255, 100)
        strokeWeight(0.5)
        //line(points[i].pos.x, points[i].pos.y, points[j].pos.x, points[j].pos.y)
      }
    }
  }
 
}

class pointy{
  constructor(x, y, speed){
    this.pos= createVector(x, y)
    this.tx= random(width)
    this.ty= random(height)
    this.target= createVector(this.tx, this.ty)
    this.speed=speed
  }
  move(){
    this.force= p5.Vector.sub(this.target, this.pos)
    this.force.setMag(this.speed)
    this.pos.add(this.force)
    let next= this.pos.dist(this.target)
    if(next<2){
      this.tx=random(width)
      this.ty=random(height)
      this.target.set(this.tx, this.ty)
    }
  
  }
  
  show(){
    stroke(255) 
    strokeWeight(5)
    point(this.pos.x, this.pos.y)
  }
}

class shaper{
  constructor(){
    this.shapepoints=[]
    this.numpoints= random(3, 12)
    for(let i=0; i<this.numpoints; i++){
      this.shapepoints.push(int(random(0, points.length)))
    }
    this.color1= random(colors)
    this.color2=color(random(colors) )
  }
  
  show(){
    let endColor= color(0, 0)
    let beginningpoint= this.shapepoints[0]
    this.color2.setAlpha(50)
    let coloring= drawingContext.createRadialGradient(points[beginningpoint].pos.x, points[beginningpoint].pos.y, 1,points[beginningpoint].pos.x, points[beginningpoint].pos.y, 400)
    //coloring.addColorStop(0, endColor)
    coloring.addColorStop(0, this.color1)
    coloring.addColorStop(0.5, this.color2)
    coloring.addColorStop(0.7, endColor)
    drawingContext.fillStyle = coloring
    noStroke()
    beginShape()
      for(let i=0; i<this.shapepoints.length; i++){
        curveVertex(points[this.shapepoints[i]].pos.x, points[this.shapepoints[i]].pos.y)
      }
    endShape()
  }
}

// save jpg
let lapse = 0;    // mouse timer
function mousePressed(){
  if (millis() - lapse > 400){
    save("img_" + month() + '-' + day() + '_' + hour() + '-' + minute() + '-' + second() + ".jpg");
    lapse = millis();
  } 
}
