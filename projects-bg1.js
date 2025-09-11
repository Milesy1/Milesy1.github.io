function setup() {
    createCanvas(windowWidth, windowHeight);  // full screen
    noFill();
    stroke(0, 20);
    frameRate(60);

    // Put canvas behind everything
    let c = document.getElementsByTagName('canvas')[0];
    c.style.position = 'fixed';
    c.style.top = '0';
    c.style.left = '0';
    c.style.zIndex = '-1';
}

function draw() {
    background(250, 250, 250, 50); // semi-transparent for trailing effect

    let t = float(frameCount);
    translate(width / 2 + t / 2, height / 2);
    rotate(t / 150);
    ellipse(0, 0, sin(t / 100) * t / 2, cos(t / 100) * t / 6);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
