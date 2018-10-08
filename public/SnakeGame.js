class SnakeGame {
    constructor(canv) {
        this.canv = canv
        this.ctx = this.canv.getContext('2d');

        // Don't afraid, that gen array of arr[20][20] :)
        this.matrix = (('0'.repeat(20) + '\n').repeat(20))
            .split('\n')
            .map(e => e.split('').map(e => +e))
            .slice(0, 20);

        // Main snake
        this.snake = {
            isAlive: true,
            // directory
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
            // requestAnimationFrame timeOut diff
            diff: 0,
            // move to head dir
            moveAhead(matrix, appleGen) {
                let { pos } = this;
                // ms
                if (this.diff >= Math.atan(pos.length) * 90 / Math.PI) {
                    const { x, y } = this.dirs;

                    const lastElem = pos[pos.length - 1];
                    matrix[lastElem[0]][lastElem[1]] = 0;
                    
                    // Previos pos of head
                    let prev = pos[0];
                    this.pos[0] = [pos[0][0] + y, pos[0][1] + x];

                    // Creat loop of area
                    const p = this.pos;
                    if (p[0][0] >= 20) {
                        this.pos[0][0] = 0;
                    } else if (p[0][1] >= 20) {
                        this.pos[0][1] = 0;
                    } else if (p[0][0] < 0) {
                        this.pos[0][0] = 19;
                    } else if (p[0][1] < 0) {
                        this.pos[0][1] = 19;
                    }

                    // Replace all position to next position
                    for (let i = 1; i < this.pos.length; i++) {
                        [prev, this.pos[i]] = [this.pos[i], prev];
                    }

                    // If snake has eaten apple
                    if (this.nextTail) {
                        this.pos.push(this.nextTail);
                        this.nextTail = null;
                    }

                    // Check next position of head
                    switch (matrix[this.pos[0][0]][this.pos[0][1]]) {
                        // If that apple
                        case 2: 
                            this.nextTail = this.pos[this.pos.length - 1];
                            appleGen();
                            break;
                        // If that body
                        case 1:
                            this.isAlive = false;
                            break;
                    }

                    // If snake not alive, exit from function
                    if (!this.isAlive) return;

                    this.diff = 0;
                } else {
                    this.diff += 1;
                }

                // Rewrite matrix
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
        this.eventsInit();
        this.update();
    }

    // Generate random position for apple,
    // fow empty space
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
        return coords;
    }

    eventsInit() {
        const self = this;

        const moveTo = {
            left() {
                self.snake.diff = 1000;
                if (self.snake.dirs.x === 1) return;
                self.snake.dirs = { x: -1, y: 0 };
            },
            top() {
                self.snake.diff = 1000;
                if (self.snake.dirs.y === 1) return;
                self.snake.dirs = { x: 0, y: -1 };
            },
            down() {
                self.snake.diff = 1000;
                if (self.snake.dirs.y === -1) return;
                self.snake.dirs = { x: 0, y: 1 };
            },
            right() {
                self.snake.diff = 1000;
                if (self.snake.dirs.x === -1) return;
                self.snake.dirs = { x: 1, y: 0 };
            }
        };

        document.addEventListener('keydown', event => {
            event.preventDefault();
            // Set direction for snake, on key...
            switch (event.keyCode) {
            // ArrowUp
            case 38:
                moveTo.top();
                break;
            // W - key
            case 87:
                moveTo.top();
                break;
            // ArrowDown
            case 40:
                moveTo.down();
                break;
            // S - key
            case 83:
                moveTo.down();
                break;
            // ArrowLeft
            case 37:
                moveTo.left();
                break;
            case 65:
                moveTo.left();
                break;
            // ArrowRight
            case 39:
                moveTo.right();
                break;
            case 68:
                moveTo.right();
                break;
            }
        });

        if (!PointerEvent) return;
        
        function onDown() {
            self.eventTime = 0;
            document.addEventListener('pointermove', onMove);
            document.addEventListener('pointerup', onUp);
        }

        function onMove(event) {
            const { movementX: mX, movementY: mY } = event;
            const minmax = 0;
            const newTime = (new Date()).getTime();
            
            // 0.5s
            const delay = 200;

            if (!(self.eventTime + delay <= newTime)) return;

            self.eventTime = newTime;

            if (mX < -minmax) {
                moveTo.left();
            } else if (mX > minmax) {
                moveTo.right();
            } else if (mY > minmax) {
                moveTo.down();
            } else if (mY < -minmax) {
                moveTo.top();
            }
        }

        function onUp() {
            document.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerup', onUp);
        }

        this.canv.addEventListener('pointerdown', onDown);
    }

    showScore() {
        const { ctx, metrika: m } = this;

        ctx.fillStyle = '#000';
        ctx.strokeStyle = '#fff';

        // length - 3, be-se, on game start, snake have 2 body, and 1 head
        const score = `Score: ${(this.snake.pos.length - 3) * 100}`;

        const fontSize = m.fr.width / score.length * 20;
        ctx.font = `bold ${fontSize}px Arial`;

        ctx.fillText(score, m.fr.width / 2 + fontSize, m.fr.height / 2 + fontSize);
        ctx.strokeText(score, m.fr.width / 2 + fontSize, m.fr.height / 2 + fontSize);
    }

    update() {
        this.snake.moveAhead(this.matrix, this.appleGen);
        this.draw();

        // Show score, after die
        if (!this.snake.isAlive) {
            this.showScore();
            return;
        }

        requestAnimationFrame(this.update);
    }

    draw() {
        const { ctx, canv } = this;
        // Rewrite metrika, on every frame
        this.metrika = {
            width: canv.width,
            height: canv.height,
            // One fraction - box 20x20
            fr: {
                width: canv.width / 20,
                height: canv.height / 20
            }
        };

        // Draw all blocks
        const { matrix } = this;
        matrix.forEach((row, y) => 
            row.forEach((cell, x) => {
                this.drawFraction(x, y);
            })
        );
    }

    // Draw one block
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

        return matrix[y][x];
    }
}