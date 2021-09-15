const canvas = document.getElementById('canvas1')
const context = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
})

class Point {
    constructor(x, y, oldx, oldy, pinned) {
        this.x = x
        this.y = y
        this.oldx = oldx; this.oldy = oldy;
        this.pinned = pinned ? pinned : false
    }
}

function distance(p0, p1) {
    var dx = p1.x - p0.x,
        dy = p1.y - p0.y;
    return Math.sqrt(dx * dx + dy * dy);
}

class Stick {
    constructor(p0, p1, hidden) {
        this.p0 = p0
        this.p1 = p1
        this.length = distance(p0, p1)
        this.hidden = hidden ? hidden : false
    }
}


var points = [],
    bounce = 0.9,
    gravity = 0.5,
    friction = 0.999;
let sticks = []
let radius = 1
let unit = 8
let row = 200
let column = 100

for (let i = 0; i < row; i++) {
    for (let j = 0; j < column; j++) {
        if (j === 0 && i % 4 === 0) {
            points.push(new Point(i * unit, j * unit, i * unit, j * unit, true));
        } else {
            points.push(new Point(i * unit, j * unit, i * unit, j * unit));
        }
    }
}

let tracking = 0
for (let i = 0; i < points.length - 1; i++) {
    if ((i + 1) % row === 0) {

    } else {
        sticks.push(new Stick(points[i], points[i + 1]))
    }
}



for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
        if (j - i === column) {
            sticks.push(new Stick(points[i], points[j]))
        }
    }
}


// points.push(new Point(100, 100, 100, 100));
// points.push(new Point(250, 100, 250, 100));
// points.push(new Point(250, 250, 250, 250));
// points.push(new Point(100, 250, 150, 250));

// // Swing
// points.push(new Point(500, 50, 500, 50, true));
// points.push(new Point(500, 100, 500, 100));

// sticks.push(new Stick(points[0], points[1]))
// sticks.push(new Stick(points[1], points[2]))
// sticks.push(new Stick(points[2], points[3]))
// sticks.push(new Stick(points[3], points[0]))
// sticks.push(new Stick(points[0], points[2], true))

// sticks.push(new Stick(points[4], points[5]))
// sticks.push(new Stick(points[5], points[0]))

function updatePoints() {
    for (let i = 0; i < points.length; i++) {
        let p = points[i]
        if (!p.pinned) {
            let vx = (p.x - p.oldx) * friction
            let vy = (p.y - p.oldy) * friction
            p.oldx = p.x
            p.oldy = p.y
            p.x += vx
            p.y += vy
            p.y += gravity
        }
    }
}

function handleBound() {
    for (var i = 0; i < points.length; i++) {
        var p = points[i],
            vx = (p.x - p.oldx) * friction,
            vy = (p.y - p.oldy) * friction;

        if (p.x > canvas.width - radius) {
            p.x = canvas.width - radius;
            p.oldx = p.x + vx * bounce;
        }
        else if (p.x < 0 + radius) {
            p.x = 0 + radius;
            p.oldx = p.x + vx * bounce;
        }
        if (p.y > canvas.height - radius) {
            p.y = canvas.height - radius;
            p.oldy = p.y + vy * bounce;
        }
        else if (p.y < 0 + radius) {
            p.y = 0 + radius;
            p.oldy = p.y + vy * bounce;
        }
    }

}

function updateSticks() {
    for (let i = 0; i < sticks.length; i++) {
        let s = sticks[i]
        // distance of point x, y after they update
        let dx = s.p1.x - s.p0.x
        let dy = s.p1.y - s.p0.y
        let distance = Math.sqrt(dx * dx + dy * dy)
        let diff = s.length - distance
        let percent = diff / distance / 2
        let offsetX = dx * percent
        let offsetY = dy * percent

        if (!s.p0.pinned) {
            s.p0.x -= offsetX
            s.p0.y -= offsetY
        }
        if (!s.p1.pinned) {
            s.p1.x += offsetX
            s.p1.y += offsetY
        }
    }
}


function renderPoints() {
    for (let i = 0; i < points.length; i++) {
        let p = points[i]
        context.fillStyle = p.pinned ? 'blue' : 'white'
        context.beginPath();
        context.arc(p.x, p.y, radius, 0, Math.PI * 2);
        context.fill();
    }
}

function renderSticks() {
    context.beginPath();

    for (let i = 0; i < sticks.length; i++) {
        let s = sticks[i];
        if (!s.hidden) {
            context.strokeStyle = 'white'
            context.lineWidth = 1
            context.moveTo(s.p0.x, s.p0.y);
            context.lineTo(s.p1.x, s.p1.y);
        }

    }
    context.stroke();
}


function update() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    updatePoints()

    for (let i = 0; i < 5; i++) {
        handleBound()
        updateSticks()
    }


    renderPoints()
    renderSticks()
    requestAnimationFrame(update);
}

update()





// window.addEventListener('click', event => {
//     let clickedPoint = false
//     for (let i = 0; i < points.length; i++) {
//         let p = points[i]
//         if (distance({ x: event.x, y: event.y }, p) < radius) {
//             console.log('good')
//             clickedPoint = true
//             if (!index1) {
//                 index1 = i

//             }

//             else if (index1 && !index2) {
//                 index2 = i
//             }
//             break;
//         }
//     }

//     if (index1 && index2) {
//         sticks.push(new Stick(points[index1], points[index2]))
//         index1 = undefined
//         index2 = undefined
//     }

//     if (clickedPoint) {
//         console.log(index1, index2)
//         console.log('good')
//     } else {
//         console.log('bad')
//     }
// })


let index1 = undefined
let index2 = undefined
// window.oncontextmenu = (event) => {
//     let clickedPoint = false;
//     for (let i = 0; i < points.length; i++) {
//         let p = points[i]
//         if (distance({ x: event.x, y: event.y }, p) < radius) {
//             console.log('good')
//             p.pinned = !p.pinned
//             clickedPoint = true
//             break;
//         }
//     }
//     if (!clickedPoint) {
//         points.push(new Point(event.x, event.y, event.x, event.y, true));
//     }



//     // return false;     // cancel default menu
// }

