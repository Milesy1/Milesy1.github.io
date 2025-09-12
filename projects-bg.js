let connectors = [];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('position', 'fixed');       // fix to viewport
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('width', '100vw');          // full viewport width
  canvas.style('height', '100vh');         // full viewport height
  canvas.style('z-index', '-1');           // behind content
  canvas.style('pointer-events', 'none');  // clicks pass through
  noFill();
  stroke(125, 50);

  for (let i = 0; i < 20; i++) {
    if (random() < 0.5) {
      connectors.push(new Connector(createVector(random(width), -1), createVector(random(width), height + 1)));
    } else {
      connectors.push(new Connector(createVector(-1, random(height)), createVector(width + 1, random(height))));
    }
  }
}

function draw() {
  clear();

  for (let i = 0; i < connectors.length; i++) {
    let c1 = connectors[i];
    c1.draw();
    c1.boundaries();

    for (let j = 0; j < connectors.length; j++) {
      let c2 = connectors[j];
      fill(0, 150, 255, 150);
      let pt = c1.calcIntersect(c2);
      if (pt) ellipse(pt.x, pt.y, 3, 3);
    }
  }
}

class Connector {
  constructor(startLoc, endLoc) {
    this.start = startLoc.copy();
    this.end = endLoc.copy();
    this.sVel = createVector(random(-1, 1), random(-1, 1));
    this.eVel = createVector(random(-1, 1), random(-1, 1));
  }

  draw() {
    this.start.add(this.sVel);
    this.end.add(this.eVel);
    line(this.start.x, this.start.y, this.end.x, this.end.y);
  }

  calcIntersect(c1) {
    let a = this.end.y - this.start.y;
    let b = this.start.x - this.end.x;
    let c = a * this.start.x + b * this.start.y;

    let a2 = c1.end.y - c1.start.y;
    let b2 = c1.start.x - c1.end.x;
    let c2 = a2 * c1.start.x + b2 * c1.start.y;

    let den = a * b2 - a2 * b;
    if (den === 0) return null;
    return createVector((b2 * c - b * c2) / den, (a * c2 - a2 * c) / den);
  }

  boundaries() {
    if (this.start.x <= 0 || this.start.x >= width) this.sVel.x *= -1;
    if (this.start.y <= 0 || this.start.y >= height) this.sVel.y *= -1;
    if (this.end.x <= 0 || this.end.x >= width) this.eVel.x *= -1;
    if (this.end.y <= 0 || this.end.y >= height) this.eVel.y *= -1;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
