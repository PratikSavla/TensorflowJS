var mX = [], mY = [], arrX = [], arrY = [], click = false, dx, dy, dr;
var optimizer = tf.train.sgd(0.01);
let x = tf.variable(tf.scalar(0));
let y = tf.variable(tf.scalar(0));
let r = tf.variable(tf.scalar(0.5));

function mouseDown() { click = true; }
function mouseUp() { click = false; }

function f() {
    const xs = tf.tensor1d(arrX);
    const ys = tf.tensor1d(arrY);
    let a = xs.sub(x).square();
    let b = ys.sub(y).square();
    let c = a.add(b).sqrt().sub(r).abs().mean();
    return c;
}

function setup() {
    var canvas = createCanvas(400, 400);
    canvas.mousePressed(mouseDown);
    canvas.mouseReleased(mouseUp);
}

function draw() {
    colorMode(HSB);
    background(255, 204, 100);
    if (click) {
        var exist = false;
        for (var i = 0; i < mX.length; i++) {
            if (mX[i] == mouseX && mY[i] == mouseY) exist = true;
        }
        if (!exist) {
            mX.push(mouseX); mY.push(mouseY);
            arrX.push(map(mouseX, 0, width, -1, 1));
            arrY.push(map(mouseY, 0, height, 1, -1));
        }
    } else {
        tf.tidy(() => {
            if (arrX.length > 1) {
                optimizer.minimize(() => f());
            }
        });
    }
    stroke(255);
    strokeWeight(6);
    for (let i = 0; i <= arrX.length; i++) {
        if (arrX[i] && arrY[i]) {
            dx = map(arrX[i], -1, 1, 0, width);
            dy = map(arrY[i], -1, 1, height, 0);
            point(dx, dy);
        }
    }
    noFill();
    strokeWeight(1);
    dx = map(x.dataSync()[0], -1, 1, 0, width);
    dy = map(y.dataSync()[0], -1, 1, height, 0);
    dr = map(r.dataSync()[0], 0, 1, 0, width);
    ellipse(dx, dy, dr, dr);
    endShape();
}
