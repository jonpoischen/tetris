class Arena
{
    constructor(w, h) {
        const matrix = [];
        while (h--) {
            matrix.push(new Array(w).fill(0));
        }
        this.matrix = matrix;

        this.events = new Events;
    }

    clear() {
        const player = localTetris.player;
        player.dropInterval  = 1100;
        player.DROP_SLOW  = 1100;
        var music = document.getElementById("music");
        music.playbackRate = 1;

        this.matrix.forEach(row => row.fill(0));
        this.events.emit('matrix', this.matrix);
    }

    collide(player) {
        const [m, o] = [player.matrix, player.pos];
        for (let y = 0; y < m.length; ++y) {
            for (let x = 0; x < m[y].length; ++x) {
                if (m[y][x] !== 0 &&
                    (this.matrix[y + o.y] &&
                    this.matrix[y + o.y][x + o.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    merge(player) {
        player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.matrix[y + player.pos.y][x + player.pos.x] = value;
                }
            });
        });
        this.events.emit('matrix', this.matrix);
    }

    sweep() {
        var audio2 = new Audio('drop.mp3');
        audio2.play();
        var shakingElements = [];
        var shake = function (element, magnitude = 16, angular = false) {
            var tiltAngle = 1;
            var counter = 1;
            var numberOfShakes = 15;
            var startX = 0,
                startY = 0,
                startAngle = 0;
            var magnitudeUnit = magnitude / numberOfShakes;
            var randomInt = (min, max) => {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            };

            if(shakingElements.indexOf(element) === -1) {
                shakingElements.push(element);
                if(angular) {
                    angularShake();
                } else {
                    upAndDownShake();
                }
            }

            function upAndDownShake() {
                if (counter < numberOfShakes) {
                    element.style.transform = 'translate(' + startX + 'px, ' + startY + 'px)';
                    magnitude -= magnitudeUnit;
                    var randomX = randomInt(-magnitude, magnitude);
                    var randomY = randomInt(-magnitude, magnitude);
                    element.style.transform = 'translate(' + randomX + 'px, ' + randomY + 'px)';
                    counter += 1;
                    requestAnimationFrame(upAndDownShake);
                }

                if (counter >= numberOfShakes) {
                    element.style.transform = 'translate(' + startX + ', ' + startY + ')';
                    shakingElements.splice(shakingElements.indexOf(element), 1);
                }
            }

            function angularShake() {
                if (counter < numberOfShakes) {
                    element.style.transform = 'rotate(' + startAngle + 'deg)';
                    magnitude -= magnitudeUnit;
                    var angle = Number(magnitude * tiltAngle).toFixed(2);
                    element.style.transform = 'rotate(' + angle + 'deg)';
                    counter += 1;
                    tiltAngle *= -1;
                    requestAnimationFrame(angularShake);
                }

                if (counter >= numberOfShakes) {
                    element.style.transform = 'rotate(' + startAngle + 'deg)';
                    shakingElements.splice(shakingElements.indexOf(element), 1);
                }
            }
        };

        let rowCount = 1;
        let score = 0;
        outer: for (let y = this.matrix.length - 1; y > 0; --y) {
            for (let x = 0; x < this.matrix[y].length; ++x) {
                if (this.matrix[y][x] === 0) {
                    continue outer;
                }
            }

            const row = this.matrix.splice(y, 1)[0].fill(0);
            shake(document.querySelector('.player.local canvas'));
            var audio = new Audio('break.mp3');
            audio.play();
            this.matrix.unshift(row);
            ++y;

            score += rowCount * 10;
            rowCount *= 2;
        }
        this.events.emit('matrix', this.matrix);
        return score;
    }
}
