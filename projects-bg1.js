let t = 0;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style('position', 'fixed');   // stay behind content
    canvas.style('top', '0');
    canvas.style('left', '0');
    canvas.style('width', '100vw');
    canvas.style('height', '100vh');
    canvas.style('z-index', '-1');       // behind everything
    canvas.style('pointer-events', 'none'); // clicks pass through
    noFill();
    stroke(0, 20);                       // soft black trails
    frameRate(60);
}

function draw() {
    // semi-transparent grey overlay for trail effect
    background(211, 211, 211, 50);

    push();
    translate(width / 2 + sin(t / 100) * 50, height / 2 + cos(t / 100) * 50);
    rotate(t / 150);
    ellipse(0, 0, abs(sin(t / 100) * 200) + 100, abs(cos(t / 100) * 100) + 50);
    pop();

    t += 1;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

