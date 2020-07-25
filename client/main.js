var config = {
    type: Phaser.AUTO,
    parent: 'mk-2006',
    width: screen.height,
    height: screen.height,
    scale: {
        mode: Phaser.Scale.FIT, // we don't want to change pixel size relationships
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    },
    backgroundColor: '#1d1d1d',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    //desynchronized: true, // here be dragons (and also only works in chrome)
    stencil: false // presumably this saves us some amount of CPU/GPU?
};

function preload()
{
    this.load.image('red', 'client/red.png');
}

// https://www.jneurosci.org/content/jneuro/26/14/3642.full.pdf
// details:
// straight out-and-back movements, no feedback corrections (sharp turn in target)
// move when target flashes + tone plays
// 45 deg rotation (+/-)
// 2.2cm movement (though it doesn't really matter)
// 10 cm radius of target placement
// "random" target out of 8
// freeze cursor 100ms after movement onset, show indicator at reversal point. "Place both cursor and white square in the target"

function create ()
{
    this.input.once('pointerup', function () {
        this.scale.startFullscreen();
    }, this);
    this.cameras.main.setBounds(-config.width / 2, -config.height / 2, config.width, config.height);

    // border
    path = new Phaser.Curves.Path(config.width/2, 0);
    path.circleTo(config.width/2, true);
    var emitter = this.add.particles('red').createEmitter({
        x: 0,
        y: 0,
        blendMode: 'ADD',
        scale: { start: 0.2, end: 0 },
        speed: { min: -100, max: 100 },
        lifespan: { min: 200, max: 1000 },
        quantity: 150,
        emitZone: { type: 'random', source: path },
        on: false
    });

    // targets (just visual, not interactive)
    const cursor_diameter = Math.round(config.height * 0.01);
    var x;
    var y;
    var angles = [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75];
    for (let i = 0; i < angles.length; i++) {
        let angle2 = angles[i] * Math.PI;
        x = Math.round(Math.cos(angle2) * (config.height / 4));
        y = Math.round(Math.sin(angle2) * (config.height / 4));
        this.add.circle(x, y, cursor_diameter * 3, 0x555555).setOrigin(0.5, 0.5);
    }
    // center position
    this.add.circle(0, 0, cursor_diameter * 3, 0x555555).setOrigin(0.5, 0.5);

    // collision target

    this.target = this.add.circle(x, y, cursor_diameter * 3, 0xff0000);
    this.target.setOrigin(0.5, 0.5);
    this.target.setStrokeStyle(2, 0xffffff);

    // cursor machinery
    this.cursor = this.add.circle(0, 0, cursor_diameter, 0xffffff).setOrigin(0.5, 0.5);
    this.cursor_pos = { x: 0, y: 0 };
    this.input.on('pointerdown', function (pointer) {
        this.input.mouse.requestPointerLock();
    }, this);
    this.t0 = 0;
    this.input.on('pointermove', function (pointer) {
        //console.log(pointer.event.timeStamp);
        if (this.input.mouse.locked) {
            var dx = pointer.movementX;
            var dy = pointer.movementY;
            var rad = Math.sqrt((this.cursor_pos.x + dx) ** 2 + (this.cursor_pos.y + dy) ** 2);
            if (rad <= config.width/2 && rad <= config.height/2)
            {
                this.cursor_pos.x += dx;
                this.cursor_pos.y += dy;
                //var tmp = Phaser.Math.Rotate({ x: pointer.worldX, y: pointer.worldY }, Phaser.Math.DegToRad(0));
                var tmp = Phaser.Math.Rotate({x: this.cursor_pos.x, y: this.cursor_pos.y}, Phaser.Math.DegToRad(45));
                this.cursor.x = tmp.x;
                this.cursor.y = tmp.y;
            } else {
                if (pointer.event.timeStamp > this.t0)
                {
                    emitter.start();
                    emitter.explode();
                    this.t0 = pointer.event.timeStamp + 200;
                }
            }
        }
    }, this);
}

function update ()
{

}

var game = new Phaser.Game(config);
