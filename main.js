const charImageDatas = {
  "1": [
    "   #    ",
    "  ##    ",
    "   #    ",
    "   #    ",
    "   #    ",
    "   #    ",
    "  ###   ",
    "        ",
  ],
  "2": [
    " #####  ",
    "#     # ",
    "      # ",
    "  ####  ",
    " #      ",
    "#       ",
    "####### ",
    "        ",
  ],
  "3": [
    " #####  ",
    "#     # ",
    "      # ",
    "  ####  ",
    "      # ",
    "#     # ",
    " #####  ",
    "        ",
  ],
  "4": [
    "   # #  ",
    "  #  #  ",
    " #   #  ",
    "#    #  ",
    "#    #  ",
    "####### ",
    "     #  ",
    "        ",
  ],
  "5": [
    "####### ",
    "#       ",
    "#       ",
    "######  ",
    "      # ",
    "#     # ",
    " #####  ",
    "        ",
  ],
  "6": [
    " #####  ",
    "#       ",
    "#       ",
    "######  ",
    "#     # ",
    "#     # ",
    " #####  ",
    "        ",
  ],
  "7": [
    "####### ",
    "      # ",
    "      # ",
    "     #  ",
    "    #   ",
    "   #    ",
    "  #     ",
    "        ",
  ],
  "8": [
    " #####  ",
    "#     # ",
    "#     # ",
    " #####  ",
    "#     # ",
    "#     # ",
    " #####  ",
    "        ",
  ],
  "9": [
    " #####  ",
    "#     # ",
    "#     # ",
    " ###### ",
    "      # ",
    "      # ",
    " #####  ",
    "        ",
  ],
  "0": [
    " #####  ",
    "##    # ",
    "# #   # ",
    "#  #  # ",
    "#   # # ",
    "#    ## ",
    " #####  ",
    "        ",
  ],
  ".": [
    "        ",
    "        ",
    "        ",
    "        ",
    "        ",
    "  ##    ",
    "  ##    ",
    "        ",
  ],
};

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
    ],
    enemies: {
      "a": {
        type: "Enemy0",
      },
    }
  },
  {
    table: [
      "################################",
      "#                              #",
      "# a                            #",
      "#                              #",
      "#                              #",
      "#                              #",
      "#                              #",
      "#                              #",
      "#                              #",
      "#                              #",
      "#                              #",
      "#                              #",
      "#                              #",
      "#                              #",
      "#                              #",
      "#                              #",
      "#              S               #",
      "#                              #",
      "#                              #",
      "#                              #",
      "#                              #",
      "#                              #",
      "#                              #",
      "#                              #",
      "#                              #",
      "#                              #",
      "#                              #",
      "#                              #",
      "#                              #",
      "#                              #",
      "#                              #",
      "################################",
    ],
    enemies: {
      "a": {
        type: "SurvivalModeManager",
      },
    }
  },
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
  rotate(angleRad) {
    const v = this.clone();
    this.x = v.x * Math.cos(angleRad) - v.y * Math.sin(angleRad);
    this.y = v.x * Math.sin(angleRad) + v.y * Math.cos(angleRad);
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
  static get WIDTH() {
    return 256;
  }
  static get HEIGHT() {
    return 256;
  }
  constructor() {
    this._elm = document.createElement('canvas');
    this._elm.width = Screen.WIDTH;
    this._elm.height = Screen.HEIGHT;
    this._elm.className = 'screen';
    this._elm.style.border = '1px solid #888';
    this._elm.style.imageRendering = 'pixelated';
    this._elm.style.width = `${this._elm.width * 2}px`;
    this._elm.style.height = `${this._elm.height * 2}px`;
    document.body.style.display = 'flex';
    document.body.style.justifyContent = 'center';
    document.body.appendChild(this._elm);
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
  beginFrame() {
    const ctx = this._elm.getContext('2d');
    this._imageData = ctx.getImageData(0, 0, 256, 256);
    this.clear();
  }
  endFrame() {
    const ctx = this._elm.getContext('2d');
    ctx.putImageData(this._imageData, 0, 0);
  }
  clear() {
    for (let i = 0; i < 256 * 256; ++i) {
      this._imageData.data[4 * i + 0] = 0;
      this._imageData.data[4 * i + 1] = 0;
      this._imageData.data[4 * i + 2] = 0;
      this._imageData.data[4 * i + 3] = 255;
    }
  }
  drawSquare(pos, width, color) {
    const cx = Math.floor(pos.x);
    const cy = Math.floor(pos.y);
    const hw = width / 2;
    let xs = cx - hw;
    let xe = cx + hw;
    let ys = cy - hw;
    let ye = cy + hw;
    if (xe < 0 || xs >= Screen.WIDTH || ye < 0 || ys >= Screen.HEIGHT) {
      return;
    }
    xs = Math.max(xs, 0);
    xe = Math.min(xe, Screen.WIDTH);
    ys = Math.max(ys, 0);
    ye = Math.min(ye, Screen.HEIGHT);
    for (let y = ys; y < ye; ++y) {
      for (let x = xs; x < xe; ++x) {
        const i = Screen.WIDTH * y + x;
        this._imageData.data[4 * i + 0] = color[0];
        this._imageData.data[4 * i + 1] = color[1];
        this._imageData.data[4 * i + 2] = color[2];
      }
    }
  }
  drawCircle(pos, radius, color) {
    const cx = Math.round(pos.x);
    const cy = Math.round(pos.y);
    const r = Math.round(radius);
    let ys = cy - r;
    let ye = cy + r;
    if (ye < 0 || ys >= Screen.HEIGHT) {
      return;
    }
    ys = Math.max(ys, 0);
    ye = Math.min(ye, Screen.HEIGHT);
    for (let y = ys; y < ye; ++y) {
      const hx = Math.round(Math.sqrt(r * r - (y + 0.5 - cy) * (y  + 0.5 - cy)));
      let xs = cx - hx;
      let xe = cx + hx;
      if (xe < 0 || xs >= Screen.WIDTH) {
        continue;
      }
      xs = Math.max(xs, 0);
      xe = Math.min(xe, Screen.WIDTH);
      for (let x = xs; x < xe; ++x) {
        const i = Screen.WIDTH * y + x;
        this._imageData.data[4 * i + 0] = color[0];
        this._imageData.data[4 * i + 1] = color[1];
        this._imageData.data[4 * i + 2] = color[2];
      }
    }
  }
  drawText(pos, text, color) {
    Array.from(text).forEach(
      (ch, i) => this.drawChar(new Vector2(pos.x + 8 * i, pos.y), ch, color)
    );
  }
  drawChar(pos, ch, color) {
    let xs = Math.floor(pos.x);
    let xe = xs + 8;
    let ys = Math.floor(pos.y);
    let ye = ys + 8;
    if (xe < 0 || xs >= Screen.WIDTH || ye < 0 || ys >= Screen.HEIGHT) {
      return;
    }
    let sxs = Math.max(0, -xs);
    let sys = Math.max(0, -ys);
    xs = Math.max(xs, 0);
    xe = Math.min(xe, Screen.WIDTH);
    ys = Math.max(ys, 0);
    ye = Math.min(ye, Screen.HEIGHT);
    const charImageData = charImageDatas[ch];
    for (let y = ys, sy = sys; y < ye; ++y, ++sy) {
      for (let x = xs, sx = sxs; x < xe; ++x, ++sx) {
        const i = Screen.WIDTH * y + x;
        if (charImageData[sy][sx] === ' ') {
          continue;
        }
        this._imageData.data[4 * i + 0] = color[0];
        this._imageData.data[4 * i + 1] = color[1];
        this._imageData.data[4 * i + 2] = color[2];
      }
    }
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
    const enemiesData = stageData.enemies;
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
        const ch = this._table[y][x];
        const enemyData = enemiesData[ch];
        if (enemyData === undefined) {
          continue;
        }
        const pos = new Vector2(Stage.CELL_WIDTH * (x + 0.5), Stage.CELL_WIDTH * (y + 0.5));
        switch (enemyData.type) {
          case 'Enemy0':
            new Enemy0(pos);
            break;
          case 'Enemy1':
            new Enemy1(pos);
            break;
          case 'SurvivalModeManager':
            new SurvivalModeManager();
            break;
        }
      }
    }
  }
  update() {
    const cw = Stage.CELL_WIDTH;
    const wic = Stage.WIDTH_IN_CELL;
    for (let y = 0; y < wic; ++y) {
      for (let x = 0; x < wic; ++x) {
        if (this._table[y][x] === ' ') {
          continue;
        }
        if (this._table[y][x] === '#') {
          screen.drawSquare(new Vector2(cw * (x + 0.5), cw * (y + 0.5)), cw, [128, 128, 128]);
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
    vel.clampLength(0, 4);
    this._pos.add(vel);
    stage.pushOut(this._pos, 4);
    if (this._countToShot > 0) {
      this._countToShot--;
    }
    if (controller.isButtonHeld('MOUSE_BUTTON_LEFT') && this._countToShot === 0) {
      new Shot(this._pos, controller.mousePosition.clone().sub(this._pos).normalize().multiplyScalar(8));
      this._countToShot = 4;
    }
    screen.drawCircle(this._pos, 4, [224, 224, 255]);
  }
  isHit(pos) {
    return pos.clone().sub(this._pos).length() <= 4;
  }
  onHit(pos) {
    new Explosion(this._pos, 4);
    stage.goToFirstStage();
  }
}

class Enemy0 {
  constructor(pos) {
    this._pos = new Vector2(pos);
    this._hp = 1;
    this._count = 0;
    this._shouldFlash = false;
    enemies.append(this);
  }
  update() {
    this._count++;
    if (this._count > 10) {
      new Bullet(this._pos, ship.position.clone().sub(this._pos).normalize().multiplyScalar(8));
      this._count = 0;
    }
    let color = [224, 128, 128];
    if (this._shouldFlash) {
      color = [255, 255, 255];
      this._shouldFlash = false;
    }
    screen.drawCircle(this._pos, 4, color);
  }
  isHit(pos, offset = 0) {
    return pos.clone().sub(this._pos).length() <= 4 + offset;
  }
  onHit(pos) {
    this._hp--;
    this._shouldFlash = true;
    if (this._hp <= 0) {
      new Explosion(this._pos, 4);
      enemies.remove(this);
    }
  }
}

class Enemy1 {
  constructor(pos) {
    this._pos = new Vector2(pos);
    this._hp = 3;
    this._count = 0;
    this._shouldFlash = false;
    enemies.append(this);
  }
  update() {
    const vel = ship.position.clone().sub(this._pos).normalize().multiplyScalar(1);
    this._pos.add(vel);
    stage.pushOut(this._pos, 4);
    this._count++;
    if (this._count > 10) {
      new Bullet(this._pos, ship.position.clone().sub(this._pos).normalize().multiplyScalar(8));
      this._count = 0;
    }
    let color = [224, 128, 128];
    if (this._shouldFlash) {
      color = [255, 255, 255];
      this._shouldFlash = false;
    }
    screen.drawCircle(this._pos, 4, color);
  }
  isHit(pos, offset = 0) {
    return pos.clone().sub(this._pos).length() <= 4 + offset;
  }
  onHit(pos) {
    this._hp--;
    this._shouldFlash = true;
    if (this._hp <= 0) {
      new Explosion(this._pos, 4);
      enemies.remove(this);
    }
  }
}

class Enemy2 {
  constructor(pos) {
    this._pos = new Vector2(pos);
    this._hp = 6;
    this._count = 0;
    this._shouldFlash = false;
    enemies.append(this);
  }
  update() {
    const vel = ship.position.clone().sub(this._pos).normalize().multiplyScalar(1);
    this._pos.add(vel);
    stage.pushOut(this._pos, 4);
    this._count++;
    if (this._count > 10) {
      for (let i = -1; i <= 1; ++i) {
        new Bullet(this._pos, ship.position.clone().sub(this._pos).normalize().rotate(Math.PI / 8 * i).multiplyScalar(8));
      }
      this._count = 0;
    }
    let color = [255, 128, 128];
    if (this._shouldFlash) {
      color = [255, 255, 255];
      this._shouldFlash = false;
    }
    screen.drawCircle(this._pos, 4, color);
  }
  isHit(pos, offset = 0) {
    return pos.clone().sub(this._pos).length() <= 4 + offset;
  }
  onHit(pos) {
    this._hp--;
    this._shouldFlash = true;
    if (this._hp <= 0) {
      new Explosion(this._pos, 4);
      enemies.remove(this);
    }
  }
}

class SurvivalModeManager {
  constructor(pos) {
    this._count = 0;
    this._countToCreateEnemy = 0;
    this._createdEnemyCount = 0;
    enemies.append(this);
  }
  update() {
    this._countToCreateEnemy--;
    if (this._countToCreateEnemy <= 0) {
      let pos = new Vector2(
        Stage.CELL_WIDTH * ((Stage.WIDTH_IN_CELL - 2) * Math.random() + 1.5),
        Stage.CELL_WIDTH * (Math.floor(2 * Math.random()) === 0 ? 1.5 : Stage.WIDTH_IN_CELL - 1.5)
      );
      if (Math.floor(2 * Math.random()) === 0) {
        pos = new Vector2(pos.y, pos.x);
      }
      if (this._createdEnemyCount % 5 === 4) {
        new Enemy2(pos);
      } else {
        new Enemy1(pos);
      }
      this._createdEnemyCount++;
      if (this._count < 2 * 60 * 10) {
        this._countToCreateEnemy = 60 - Math.floor(40 * (this._count / (2 * 60 * 10)));
      } else {
        this._countToCreateEnemy = 20;
      }
    }
    this._count++;
    screen.drawText(new Vector2(16, 16), (this._count / 10).toFixed(1), [255, 255, 255]);
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
  findHit(pos, offset = 0) {
    return this._enemies.find(e => e.isHit && e.isHit(pos, offset));
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
      new Explosion(this._pos, 2);
      shots.remove(this);
      return;
    }
    {
      const hitEnemy = enemies.findHit(this._pos, 4);
      if (hitEnemy !== undefined) {
        hitEnemy.onHit();
        new Explosion(this._pos, 2);
        shots.remove(this);
        return;
      }
    }
    screen.drawCircle(this._pos, 2, [128, 128, 255]);
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
      new Explosion(this._pos, 2);
      bullets.remove(this);
      return;
    }
    if (ship.isHit(this._pos)) {
      ship.onHit();
      new Explosion(this._pos, 2);
      bullets.remove(this);
      return;
    }
    screen.drawCircle(this._pos, 2, [255, 192, 192]);
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

class Explosion {
  constructor(pos, sourceRadius) {
    this._pos = new Vector2(pos);
    this._sourceRadius = sourceRadius;
    this._count = 0;
    this._fragmentCount = Math.max(1, 4 * Math.floor(sourceRadius / 4));
    this._fragmentVel = (this._fragmentCount === 1) ? 0 : sourceRadius / 2;
    effects.append(this);
  }
  update() {
    if (this._count >= 4) {
      effects.remove(this);
      return;
    }
    for (let i = 0; i < this._fragmentCount; ++i) {
      screen.drawCircle(
        this._pos.clone().add((new Vector2(this._fragmentVel * this._count, 0)).rotate((i / this._fragmentCount) * 2 * Math.PI)),
        this._sourceRadius * 1.5 * (1 - (this._count / 4)),
        [255 - 64 * this._count, 255 - 64 * this._count, 255 - 64 * this._count]
      );
    }
    this._count++;
  }
}

class Effects {
  constructor() {
    this._effects = [];
  }
  reset() {
    this._effects = [];
  }
  append(effect) {
    this._effects.push(effect);
  }
  remove(effect) {
    this._effects = this._effects.filter(s => s !== effect);
  }
  update() {
    this._effects.forEach(effect => effect.update());
  }
}

let controller;
let screen;
let stage;
let ship;
let enemies;
let shots;
let bullets;
let effects;

function update() {
  if (enemies.isEmpty) {
    stage.goToNextStage();
  }
  screen.beginFrame();
  stage.update();
  ship.update();
  enemies.update();
  shots.update();
  bullets.update();
  effects.update();
  controller.updatePrev();
  screen.endFrame();
}

onload = () => {
  controller = new Controller();
  screen = new Screen();
  stage = new Stage();
  ship = new Ship();
  enemies = new Enemies();
  shots = new Shots();
  bullets = new Bullets();
  effects = new Effects();
  stage.reset();
  setInterval(update, 100);
};

