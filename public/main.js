const tetrisManager = new TetrisManager(document);
const localTetris = tetrisManager.createPlayer();
localTetris.element.classList.add('local');
localTetris.run();

const connectionManager = new ConnectionManager(tetrisManager);
connectionManager.connect();

const keyListener = (event) => {
    [
        [37, 39, 32, 38, 40],
    ].forEach((key, index) => {
        const player = localTetris.player;
        if (event.type === 'keydown') {
            if (event.keyCode === key[0]) {
                player.move(-1);
            } else if (event.keyCode === key[1]) {
                player.move(1);
            } else if (event.keyCode === key[2]) {
                player.rotate(-1);
            }
            else if (event.keyCode === key[3]) {
                player.rotate(1);
            }
        }

        if (event.keyCode === key[4]) {
            if (event.type === 'keydown') {
                if (player.dropInterval !== player.DROP_FAST) {
                    player.drop();
                    player.dropInterval = player.DROP_FAST;
                }
            } else {
                player.dropInterval = player.DROP_SLOW;
            }
        }
    });
};

document.addEventListener('keydown', keyListener);
document.addEventListener('keyup', keyListener);

/////////////////////////////////////////////////////////////////

// var shakingElements = [];
// var shake = function (element, magnitude = 16, angular = false) {
//     var tiltAngle = 1;
//     var counter = 1;
//     var numberOfShakes = 15;
//     var startX = 0,
//         startY = 0,
//         startAngle = 0;
//     var magnitudeUnit = magnitude / numberOfShakes;
//     var randomInt = (min, max) => {
//         return Math.floor(Math.random() * (max - min + 1)) + min;
//     };
//
//     if(shakingElements.indexOf(element) === -1) {
//         shakingElements.push(element);
//         if(angular) {
//             angularShake();
//         } else {
//             upAndDownShake();
//         }
//     }
//
//     function upAndDownShake() {
//         if (counter < numberOfShakes) {
//             element.style.transform = 'translate(' + startX + 'px, ' + startY + 'px)';
//             magnitude -= magnitudeUnit;
//             var randomX = randomInt(-magnitude, magnitude);
//             var randomY = randomInt(-magnitude, magnitude);
//             element.style.transform = 'translate(' + randomX + 'px, ' + randomY + 'px)';
//             counter += 1;
//             requestAnimationFrame(upAndDownShake);
//         }
//
//         if (counter >= numberOfShakes) {
//             element.style.transform = 'translate(' + startX + ', ' + startY + ')';
//             shakingElements.splice(shakingElements.indexOf(element), 1);
//         }
//     }
//
//     function angularShake() {
//         if (counter < numberOfShakes) {
//             element.style.transform = 'rotate(' + startAngle + 'deg)';
//             magnitude -= magnitudeUnit;
//             var angle = Number(magnitude * tiltAngle).toFixed(2);
//             element.style.transform = 'rotate(' + angle + 'deg)';
//             counter += 1;
//             tiltAngle *= -1;
//             requestAnimationFrame(angularShake);
//         }
//
//         if (counter >= numberOfShakes) {
//             element.style.transform = 'rotate(' + startAngle + 'deg)';
//             shakingElements.splice(shakingElements.indexOf(element), 1);
//         }
//     }
// };
