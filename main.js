const stageDatas = [
  {
    table: [
      "################################",
      "#                              #",
      "# # # #  ##   ### ###          #",
      "# # # # #  # #    #  #         #",
      "# # # # ####  ##  #  #         #",
      "# # # # #  #    # #  #         #",
      "#  # #  #  # ###  ###          #",
      "#                              #",
      "# #   #  ##  #  #  ### ####    #",
      "# ## ## #  # #  # #    #       #",
      "# # # # #  # #  #  ##  ###     #",
      "# #   # #  # #  #    # #       #",
      "# #   #  ##   ##  ###  ####    #",
      "#                              #",
      "#                              #",
      "#              a               #",
      "#                              #",
      "#                              #",
      "#                              #",
      "#                              #",
      "#                              #",
      "#                              #",
      "#              #               #",
      "#                              #",
      "#                              #",
      "#                              #",
      "#                              #",
      "#                              #",
      "#              S               #",
      "#                              #",
      "#                              #",
      "################################",
    ]
  },
  {
    table: [
      "################################",
      "#                              #",
      "# a                         a  #",
      "#                              #",
      "#   #######################    #",
      "#   #                     #    #",
      "#   # a                a  #    #",
      "#   #                     #    #",
      "#   #   ##############    #    #",
      "#   #   #            #    #    #",
      "#   #   #  a      a  #    #    #",
      "#   #   #            #    #    #",
      "#   #   #            #    #    #",
      "#   #   #            #    #    #",
      "#   #   #            #    #    #",
      "#   #   #            #    #    #",
      "#   #   #  a      a  #    #    #",
      "#   #   #            #    #    #",
      "#   #   #            #    #    #",
      "#   #   #            #    #    #",
      "#   #   #            #    #    #",
      "#   #   #            #    #    #",
      "#   #   #            #    #    #",
      "#   #   #            #    #    #",
      "#   #   #                 #    #",
      "#   #   #              a  #    #",
      "#   #   #                 #    #",
      "#   #   ###################    #",
      "#   #                          #",
      "# S # a                     a  #",
      "#   #                          #",
      "################################",
    ]
  }
];

class Vector2 {
  constructor() {
    if (arguments.length == 1) {
      this.x = arguments[0].x;
      this.y = arguments[0].y;
    } else if (arguments.length == 2) {
      this.x = arguments[0];
      this.y = arguments[1];
    } else {
      this.x = this.y = 0;
    }
  }
  clone() {
    return new Vector2(this);
  }
  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }
  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }
  multiplyScalar(s) {
    this.x *= s;
    this.y *= s;
    return this;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }
  length() {
    return Math.sqrt(this.lengthSq());
  }
  normalize(s) {
    const len = this.length();
    if (len === 0) {
      return this;
    }
    return this.multiplyScalar(1 / len);
  }
  clampLength(min, max) {
    const len = this.length();
    if (len === 0) {
      return this;
    }
    if (len < min) {
      this.multiplyScalar(min / len);
    } else if (len > max) {
      this.multiplyScalar(max / len);
    }
  }
}

class Controller {
  constructor () {
    this._buttons = {
        KEY_W: false,
        KEY_A: false,
        KEY_S: false,
        KEY_D: false,
        MOUSE_BUTTON_LEFT: false
    };
    this._buttonsPrev = { ...this._buttons };
    this._mousePos = new Vector2();
    addEventListener('keydown', this._onKeyDown.bind(this));
    addEventListener('keyup', this._onKeyUp.bind(this));
    addEventListener('mousedown', this._onMouseDown.bind(this));
    addEventListener('mouseup', this._onMouseUp.bind(this));
    addEventListener('mousemove', this._onMouseMove.bind(this));
  }
  isButtonHeld(buttonId) {
    return this._buttons[buttonId];
  }
  isButtonTriggered(buttonId) {
    return this._buttons[buttonId] && !this._buttonsPrev[buttonId];
  }
  get mousePosition() {
    return this._mousePos;
  }
  updatePrev(keyCode) {
    this._buttonsPrev = { ...this._buttons };
  }
  _onKeyDownOrUp(keyCode, isDown) {
    if (keyCode == 65) {
      this._buttons['KEY_A'] = isDown;
    } else if (keyCode == 68) {
      this._buttons['KEY_D'] = isDown;
    } else if (keyCode == 87) {
      this._buttons['KEY_W'] = isDown;
    } else if (keyCode == 83) {
      this._buttons['KEY_S'] = isDown;
    }
  }
  _onKeyDown(event) {
    this._onKeyDownOrUp(event.keyCode, true);
  };
  _onKeyUp(event) {
    this._onKeyDownOrUp(event.keyCode, false);
  };
  _onMouseDown(event) {
    if (event.button === 0) {
      this._buttons['MOUSE_BUTTON_LEFT'] = true;
    }
    this._mousePos = screen.clientToScreen(new Vector2(event.clientX, event.clientY));
  };
  _onMouseUp(event) {
    if (event.button === 0) {
      this._buttons['MOUSE_BUTTON_LEFT'] = false;
    }
  };
  _onMouseMove(event) {
    this._mousePos = screen.clientToScreen(new Vector2(event.clientX, event.clientY));
  };
}

class Screen {
  constructor() {
    this._elm = document.createElement('canvas');
    this._elm.width = 256;
    this._elm.height = 256;
    this._elm.className = 'screen';
    this._elm.style.border = '1px solid #888';
    this._elm.style.imageRendering = 'pixelated';
    this._elm.style.width = `${this._elm.width * 2}px`;
    this._elm.style.height = `${this._elm.height * 2}px`;
    document.body.style.display = 'flex';
    document.body.style.justifyContent = 'center';
    document.body.appendChild(this._elm);
    const ctx = this._elm.getContext('2d');
    ctx.fillStyle = '#f00';
    ctx.fillRect(0, 0, 8, 8);
  }
  clientToScreen(pos) {
    const borderWidth = 1;
    const scale = 2;
    const clientRect = this._elm.getBoundingClientRect();
    return new Vector2(
      Math.round((pos.x - (clientRect.x + borderWidth)) / scale),
      Math.round((pos.y - (clientRect.y + borderWidth)) / scale)
    );
  }
}

class Stage {
  static get CELL_WIDTH() {
    return 8;
  }
  static get WIDTH_IN_CELL() {
    return 32;
  }
  constructor() {
    this._index = 0;
    this._table = [];
    for (let y = 0; y < Stage.WIDTH_IN_CELL; ++y) {
      this._table[y] = [];
    }
  }
  _getStartPosition() {
    for (let y = 0; y < Stage.WIDTH_IN_CELL; ++y) {
      for (let x = 0; x < Stage.WIDTH_IN_CELL; ++x) {
        if (this._table[y][x] === 'S') {
          return new Vector2(Stage.CELL_WIDTH * (x + 0.5), Stage.CELL_WIDTH * (y + 0.5));
        }
      }
    }
  }
  goToFirstStage() {
    this._index = 0
    this.reset();
  }
  goToNextStage() {
    this._index++;
    if (this._index >= stageDatas.length) {
      this._index = 0
    }
    this.reset();
  }
  reset() {
    const stageData = stageDatas[this._index];
    const tableData = stageData.table;
    for (let y = 0; y < Stage.WIDTH_IN_CELL; ++y) {
      for (let x = 0; x < Stage.WIDTH_IN_CELL; ++x) {
        this._table[y][x] = tableData[y][x];
      }
    }
    ship.reset(this._getStartPosition());
    enemies.reset();
    shots.reset();
    bullets.reset();
    for (let y = 0; y < Stage.WIDTH_IN_CELL; ++y) {
      for (let x = 0; x < Stage.WIDTH_IN_CELL; ++x) {
        if (this._table[y][x] === 'a') {
          new Enemy(new Vector2(Stage.CELL_WIDTH * (x + 0.5), Stage.CELL_WIDTH * (y + 0.5)));
        }
      }
    }
  }
  update() {
    const ctx = document.querySelector('.screen').getContext('2d');
    ctx.fillStyle = '#ccc';
    const cw = Stage.CELL_WIDTH;
    const wic = Stage.WIDTH_IN_CELL;
    for (let y = 0; y < wic; ++y) {
      for (let x = 0; x < wic; ++x) {
        if (this._table[y][x] === ' ') {
          continue;
        }
        if (this._table[y][x] === '#') {
          ctx.fillRect(cw * x, cw * y, cw, cw);
        }
      }
    }
  }
  _getCell(pos) {
    const posByGrid = { x: Math.floor(pos.x / 8), y: Math.floor(pos.y / 8) };
    if (posByGrid.x < 0 || posByGrid.y < 0 || 32 <= posByGrid.x || 32 <= posByGrid.y) {
      return undefined;
    }
    return this._table[posByGrid.y][posByGrid.x];
  }
  isHit(pos) {
    return this._getCell(pos) === '#';
  }
  pushOut(pos, radius) {
    const cw = Stage.CELL_WIDTH;
    const posL = pos.clone().add(new Vector2(-radius, 0));
    if (this.isHit(posL)) {
      pos.x = Math.ceil(posL.x / cw) * cw + radius;
    }
    const posR = pos.clone().add(new Vector2(radius, 0));
    if (this.isHit(posR)) {
      pos.x = Math.floor(posR.x / cw) * cw - radius;
    }
    const posU = pos.clone().add(new Vector2(0, -radius));
    if (this.isHit(posU)) {
      pos.y = Math.ceil(posU.y / cw) * cw + radius;
    }
    const posD = pos.clone().add(new Vector2(0, radius));
    if (this.isHit(posD)) {
      pos.y = Math.floor(posD.y / cw) * cw - radius;
    }
  }
}

class Ship {
  constructor() {
    this._pos = new Vector2();
    this._vel = new Vector2();
    this._countToShot = 0;
  }
  reset(pos) {
    this._pos = pos;
    this._vel = new Vector2();
  }
  get position() {
    return this._pos;
  }
  update() {
    const velSign = new Vector2();
    if (controller.isButtonHeld('KEY_A')) {
      velSign.x = -1;
    } else if (controller.isButtonHeld('KEY_D')) {
      velSign.x = +1;
    }
    if (controller.isButtonHeld('KEY_W')) {
      velSign.y = -1;
    } else if (controller.isButtonHeld('KEY_S')) {
      velSign.y = +1;
    }
    const vel = velSign.multiplyScalar(4);
    vel.clampLength(0, 3);
    this._pos.add(vel);
    stage.pushOut(this._pos, 4);
    if (this._countToShot > 0) {
      this._countToShot--;
    }
    if (controller.isButtonHeld('MOUSE_BUTTON_LEFT') && this._countToShot === 0) {
      new Shot(this._pos, controller.mousePosition.clone().sub(this._pos).normalize().multiplyScalar(6));
      this._countToShot = 4;
    }
    const ctx = document.querySelector('.screen').getContext('2d');
    ctx.fillStyle = '#0f0';
    ctx.fillRect(Math.round(this._pos.x - 4), Math.round(this._pos.y - 4), 8, 8);
  }
  isHit(pos) {
    return pos.clone().sub(this._pos).length() <= 4;
  }
  onHit(pos) {
    stage.goToFirstStage();
  }
}

class Enemy {
  constructor(pos) {
    this._pos = new Vector2(pos);
    this._vel = new Vector2(0, 0);
    this._hp = 4;
    this._count = 0;
    this._shouldFlash = false;
    enemies.append(this);
  }
  update() {
    this._pos.add(this._vel);
    this._count++;
    if (this._count > 10) {
      new Bullet(this._pos, ship.position.clone().sub(this._pos).normalize().multiplyScalar(3));
      this._count = 0;
    }
    const ctx = document.querySelector('.screen').getContext('2d');
    ctx.fillStyle = '#f00';
    if (this._shouldFlash) {
      ctx.fillStyle = '#fff';
      this._shouldFlash = false;
    }
    ctx.fillRect(Math.round(this._pos.x - 4), Math.round(this._pos.y - 4), 8, 8);
  }
  isHit(pos) {
    return pos.clone().sub(this._pos).length() <= 4;
  }
  onHit(pos) {
    this._hp--;
    this._shouldFlash = true;
    if (this._hp <= 0) {
      enemies.remove(this);
    }
  }
}

class Enemies {
  constructor() {
    this._enemies = [];
  }
  reset() {
    this._enemies = [];
  }
  append(enemy) {
    this._enemies.push(enemy);
  }
  remove(enemy) {
    this._enemies = this._enemies.filter(e => e !== enemy);
  }
  get isEmpty() {
    return this._enemies.length === 0;
  }
  findHit(pos) {
    return this._enemies.find(e => e.isHit(pos));
  }
  update() {
    this._enemies.forEach(enemy => enemy.update());
  }
}

class Shot {
  constructor(pos, vel) {
    this._pos = new Vector2(pos);
    this._vel = new Vector2(vel);
    shots.append(this);
  }
  update() {
    this._pos.add(this._vel);
    if (stage.isHit(this._pos)) {
      shots.remove(this);
      return;
    }
    {
        const hitEnemy = enemies.findHit(this._pos);
        if (hitEnemy !== undefined) {
            hitEnemy.onHit();
            shots.remove(this);
            return;
        }
    }
    const ctx = document.querySelector('.screen').getContext('2d');
    ctx.fillStyle = '#0f0';
    ctx.fillRect(Math.round(this._pos.x - 2), Math.round(this._pos.y - 2), 4, 4);
  }
}

class Shots {
  constructor() {
    this._shots = [];
  }
  reset() {
    this._shots = [];
  }
  append(shot) {
    this._shots.push(shot);
  }
  remove(shot) {
    this._shots = this._shots.filter(s => s !== shot);
  }
  update() {
    this._shots.forEach(shot => shot.update());
  }
}

class Bullet {
  constructor(pos, vel) {
    this._pos = new Vector2(pos);
    this._vel = new Vector2(vel);
    this._count = 0;
    bullets.append(this);
  }
  update() {
    this._pos.add(this._vel);
    this._count++;
    if (stage.isHit(this._pos)) {
      bullets.remove(this);
      return;
    }
    if (ship.isHit(this._pos)) {
        ship.onHit();
        return;
    }
    const ctx = document.querySelector('.screen').getContext('2d');
    ctx.fillStyle = '#f00';
    ctx.fillRect(Math.round(this._pos.x - 2), Math.round(this._pos.y - 2), 4, 4);
  }
}

class Bullets {
  constructor() {
    this._bullets = [];
  }
  reset() {
    this._bullets = [];
  }
  append(bullet) {
    this._bullets.push(bullet);
  }
  remove(bullet) {
    this._bullets = this._bullets.filter(s => s !== bullet);
  }
  update() {
    this._bullets.forEach(bullet => bullet.update());
  }
}

let controller;
let screen;
let stage;
let ship;
let enemies;
let shots;
let bullets;

function update() {
  const ctx = document.querySelector('.screen').getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 256, 256);
  if (enemies.isEmpty) {
    stage.goToNextStage();
  }
  stage.update();
  ship.update();
  enemies.update();
  shots.update();
  bullets.update();
  controller.updatePrev();
}

onload = () => {
  controller = new Controller();
  screen = new Screen();
  stage = new Stage();
  ship = new Ship();
  enemies = new Enemies();
  shots = new Shots();
  bullets = new Bullets();
  stage.reset();
  setInterval(update, 100);
};

