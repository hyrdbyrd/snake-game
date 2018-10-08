class SnakeGame {
    constructor(canv) {
        this.canv = canv
        this.ctx = this.canv.getContext('2d');
        this.matrix = (('0'.repeat(20) + '\n').repeat(20))
            .split('\n')
            .map(e => e.split('').map(e => +e))
            .slice(0, 20);

        this.snake = {
            isAlife: true,
            dirs: {
                x: -1,
                y: 0
            },
            // First array - is head!
            // y, x
            pos: [
                [9, 8],
                [9, 9],
                [9, 10]
            ],
            diff: 0,
            moveAhead(matrix, appleGen) {
                let { pos } = this;
                // 0.3s
                if (this.diff >= 40) {
                    const { x, y } = this.dirs;

                    const lastIndex = pos[pos.length - 1];
                    matrix[lastIndex[0]][lastIndex[1]] = 0;
                    
                    let prev = pos[0];
                    this.pos[0] = [pos[0][0] + y, pos[0][1] + x];

                    const p = this.pos;

                    if (p[0][0] >= 20) {
                        this.pos[0][0] = 0;
                    }

                    if (p[0][1] >= 20) {
                        this.pos[0][1] = 0;
                    }

                    if (p[0][0] < 0) {
                        this.pos[0][0] = 19;
                    }

                    if (p[0][1] < 0) {
                        this.pos[0][1] = 19;
                    }

                    for (let i = 1; i < this.pos.length; i++) {
                        [prev, this.pos[i]] = [this.pos[i], prev];
                    }

                    if (this.nextTail) {
                        this.pos.push(this.nextTail);
                        this.nextTail = null;
                    }

                    switch (matrix[this.pos[0][0]][this.pos[0][1]]) {
                        case 2: 
                            this.nextTail = this.pos[this.pos.length - 1];
                            appleGen();
                            break;
                        case 1:
                            this.isAlife = false;
                            break;
                    }

                    if (!this.isAlife) return;

                    this.diff = 0;
                } else {
                    this.diff += 1;
                }

                pos.forEach((c, i) => {
                    matrix[c[0]][c[1]] = i === 0 ? 3 : 1;
                });
            }
        };

        // Binding
        this.update = this.update.bind(this);
        this.appleGen = this.appleGen.bind(this);

        this.init();
    }

    init() {
        this.appleGen();
        this.events();
        this.update();
    }

    appleGen() {
        const emptyCoords = [];
        this.matrix.forEach((row, y) => 
            emptyCoords.push(...row
                .map((cell, x) => cell === 0 ? [y, x] : -1)
                .filter(e => e !== -1))
        );

        const len = emptyCoords.length - 1;
        const coords = emptyCoords[Math.random() * len | 0];

        this.matrix[coords[0]][coords[1]] = 2;
    }

    events() {
        document.addEventListener('keydown', event => {
            event.preventDefault();
            switch (event.key) {
                case 'ArrowUp':
                this.snake.diff = 1000;
                if (this.snake.dirs.y === 1) return;
                this.snake.dirs = { x: 0, y: -1 };
                    break;
                case 'ArrowDown':
                this.snake.diff = 1000;
                if (this.snake.dirs.y === -1) return;
                this.snake.dirs = { x: 0, y: 1 };
                    break;
                case 'ArrowLeft':
                this.snake.diff = 1000;
                    if (this.snake.dirs.x === 1) return;
                    this.snake.dirs = { x: -1, y: 0 };
                    break;
                case 'ArrowRight':
                    this.snake.diff = 1000;
                    if (this.snake.dirs.x === -1) return;
                    this.snake.dirs = { x: 1, y: 0 };
                    break;
            }
        });
    }

    update() {
        this.snake.moveAhead(this.matrix, this.appleGen);
        this.draw();

        const { ctx, metrika: m } = this;
        if (!this.snake.isAlife) {
            ctx.fillStyle = '#000';
            ctx.strokeStyle = '#fff';

            const score = `Score: ${this.snake.pos.length * 100}`;

            const fontSize = m.fr.width / score.length * 20;
            ctx.font = `bold ${fontSize}px Arial`;
           

            ctx.fillText(score, m.fr.width / 2 + fontSize, m.fr.height / 2 + fontSize);
            ctx.strokeText(score, m.fr.width / 2 + fontSize, m.fr.height / 2 + fontSize);
            return;
        }

        requestAnimationFrame(this.update);
    }

    draw() {
        const { ctx, canv } = this;
        this.metrika = {
            width: canv.width,
            height: canv.height,
            // One fraction - box 20x20
            fr: {
                width: canv.width / 20,
                height: canv.height / 20
            }
        };

        const { metrika: m, matrix } = this;

        matrix.forEach((row, y) => 
            row.forEach((cell, x) => {
                this.drawFraction(x, y);
            })
        );
    }

    drawFraction(x, y) {
        // Define all vars
        const { matrix, ctx, metrika: m } = this;
        const { width: fw, height: fh } = this.metrika.fr;
        const { x: dirX, y: dirY } = this.snake.dirs;

        const value = matrix[y][x];
        let diff, dX, dY;

        // Check the value of matrix.
        // On value = x, will write set yet.
        switch (value) {
            // Empty fills.
            case 0:
                ctx.fillStyle = '#000';
                ctx.fillRect(
                    x * fw, y * fh, 
                    m.width, m.height
                );
                break;
            // Snake's body.
            case 1:
                diff = 10;
                dX = fw / diff, dY = fh / diff;
                ctx.fillStyle = '#9f9';
                ctx.fillRect(
                    x * fw + dX, y * fh + dY, 
                    fw - dX, fh - dY
                );
                break;
            // Snake's head.
            case 3:
                // Snake's head.
                diff = 10;
                dX = fw / diff, dY = fh / diff;

                ctx.fillStyle = '#9f9';
                ctx.fillRect(
                    x * fw + dX, y * fh + dY, 
                    fw - dX, fh - dY
                );

                // Eyes.
                let diffX, diffY;
                dX *= 2;
                dY *= 2;

                // Right eye.
                if (dirX === 0) {
                    diffX = dirY > 0 ? 0 : fw / 2;    
                    diffY = dirY > 0 ? fh / 2 : 0;
                }

                if (dirY === 0) {
                    diffX = dirX > 0 ? fw / 2 : 0;
                    diffY = dirX > 0 ? fh / 2 : 0;
                }

                ctx.fillStyle = '#00f';
                ctx.fillRect(
                    x * fw + dX + diffX, 
                    y * fh + dY + diffY, 
                    fw / 6, 
                    fh / 6
                );

                // Left eye.
                if (dirX === 0) {
                    diffX = dirY > 0 ? fw / 2 : 0;    
                    diffY = dirY > 0 ? fh / 2 : 0;
                }

                if (dirY === 0) {
                    diffX = dirX > 0 ? fw / 2 : 0;
                    diffY = dirX > 0 ? 0 : fh / 2;
                }

                ctx.fillRect(
                    x * fw + dX + diffX, 
                    y * fh + dY + diffY, 
                    fw / 6, 
                    fh / 6
                );

                // Snake's tongues

                break;
            case 2:
                diff = 5;
                dX = fw / diff, dY = fh / diff;
                ctx.fillStyle = '#f99';
                ctx.fillRect(
                    x * fw + dX, y * fh + dY, 
                    fw - dX, fh - dY
                );
                break;
        }
    }
}

const canv = document.body.querySelector('.snake-game');
const GAME = new SnakeGame(canv);