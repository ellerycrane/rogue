var ROT = require('./rot.js');

console.log("Bah humbug");

class Combatant {
    constructor(name, state) {
        var self = this;
        self._name = name;
        self.hp = 100;
        self.hitChance = 0.75;
        self.gameState = state;
    }

    name() {
        return this._name;
    }

    takeDamage(damage) {
        var self = this,
            log = self.gameState.log,
            scheduler = self.gameState.scheduler;
        self.hp -= damage;
        if (self.hp <= 0) {
            self.isDead = true;
            console.log("%Name has died!".format(self));
            scheduler.remove(self);
        }
    }

    attack(monster) {
        var self = this,
            log = self.gameState.log;
        if (ROT.RNG.getUniform() <= self.hitChance) {
            var damage = Math.floor(ROT.RNG.getUniform() * 10) + 1;
            console.log("%Name hits %Name for %s damage!".format(self, monster, damage));
            monster.takeDamage(damage);
        } else {
            console.log("%Name misses %Name with an attack.".format(self, monster));
        }
    }

    act() {
        var self = this,
            monsters = self.gameState.monsters,
            scheduler = self.gameState.scheduler;
        if (monsters.length == 0) {
            scheduler.remove(self);
        } else {
            self.attack(monsters.random());
        }
    }
}

class MonsterCombatant extends Combatant {
    constructor(name, state) {
        super("MONSTER: "+name, state);
    }

    attack(player) {
        var self = this,
            log = self.gameState.log;
        if (ROT.RNG.getUniform() <= self.hitChance) {
            var damage = Math.floor(ROT.RNG.getUniform() * 10) + 1;
            console.log("%Name hits %Name for %s damage!".format(self, player, "" + damage));
            player.takeDamage(damage);
        } else {
            console.log("%Name misses %Name with an attack.".format(self, player));
        }
    }

    act() {
        var self = this,
            player = self.gameState.player,
            scheduler = self.gameState.scheduler;
        if (player.isDead) {
            scheduler.remove(self);
        } else {
            self.attack(player);
        }
    }

}

var monsterTypes = ['orc', 'goblin', 'giant rat', 'giant spider', 'kobold'];


var SHOW = function (str) {
    console.log(str);
};
//
//console.log(String.format("%s %s", "hello", "world"));
//console.log("%s %s".format("hello", "world"));

String.format.map.name = "name";

var scheduler = new ROT.Scheduler.Simple();
var engine = new ROT.Engine(scheduler);
var state = {
    log: [],
    monsters: [],
    scheduler: scheduler,
    engine: engine
};
var Player = function (name, gameState) {
    var self = this;
    self._name = name;
    self.hp = 100;
    self.hitChance = 0.75;
    self.gameState = gameState;
};
Player.prototype = {
    name: function () {
        return this._name;
    },
    takeDamage: function (damage) {
        var self = this,
            log = self.gameState.log,
            scheduler = self.gameState.scheduler;
        self.hp -= damage;
        if (self.hp <= 0) {
            self.isDead = true;
            console.log("%Name has died!".format(self));
            scheduler.remove(self);
        }
    },
    attack: function (monster) {
        var self = this,
            log = self.gameState.log;
        if (ROT.RNG.getUniform() <= self.hitChance) {
            var damage = Math.floor(ROT.RNG.getUniform() * 10) + 1;
            console.log("%Name hits %Name for %s damage!".format(self, monster, damage));
            monster.takeDamage(damage);
        } else {
            console.log("%Name misses %Name with an attack.".format(self, monster));
        }
    },

    act: function () {
        var self = this,
            monsters = self.gameState.monsters,
            scheduler = self.gameState.scheduler;
        if (monsters.length == 0) {
            scheduler.remove(self);
        } else {
            self.attack(monsters.random());
        }
    }
};

state.player = new Combatant("Hector", state);
scheduler.add(state.player, true);

var Monster = function (name, gameState) {
    var self = this;
    self._name = name;
    self.hp = 10;
    self.hitChance = 0.5;
    self.gameState = gameState;
};
Monster.prototype = {
    name: function () {
        return this._name;
    },
    takeDamage: function (damage) {
        var self = this,
            log = self.gameState.log,
            scheduler = self.gameState.scheduler;
        self.hp -= damage;
        if (self.hp <= 0) {
            self.isDead = true;
            console.log("%Name has died!".format(self));
            scheduler.remove(self);
            self.gameState.monsters.splice(self.gameState.monsters.indexOf(self), 1);
        }
    },
    attack: function (player) {
        var self = this,
            log = self.gameState.log;
        if (ROT.RNG.getUniform() <= self.hitChance) {
            var damage = Math.floor(ROT.RNG.getUniform() * 10) + 1;
            console.log("%Name hits %Name for %s damage!".format(self, player, "" + damage));
            player.takeDamage(damage);
        } else {
            console.log("%Name misses %Name with an attack.".format(self, player));
        }
    },

    act: function () {
        var self = this,
            player = self.gameState.player,
            scheduler = self.gameState.scheduler;
        if (player.isDead) {
            scheduler.remove(self);
        } else {
            self.attack(player);
        }
    }
};


for (var i = 0; i < 5; i++) {
    var name = monsterTypes.random();
    var monster = new MonsterCombatant(name, state);
    scheduler.add(monster, true);
    state.monsters.push(monster)
}
//
///* sample actor: pauses the execution when dead */
//var actor1 = {
//    lives: 3,
//    act: function() {
//        output.push(".");
//        this.lives--;
//        if (!this.lives) {
//            scheduler.remove(actor1);
//            engine.lock();              /* pause execution */
//            setTimeout(unlock, 500);    /* wait for 500ms */
//        }
//    }
//};
//scheduler.add(actor1, true);
//
//var unlock = function() {               /* called asynchronously */
//    var actor2 = {
//        act: function() {
//            output.push("@");
//        }
//    };
//
//    output = [];
//    scheduler.add(actor2, false);       /* add second (non-repeating) actor */
//    engine.unlock();                    /* continue execution */
//    SHOW(output.join(""));
//};

engine.start();
//SHOW(state.log.join("\n"));
//
//
//var Game = {
//    display: null,
//    map: {},
//    engine: null,
//    player: null,
//    pedro: null,
//    ananas: null,
//
//    init: function() {
//        this.display = new ROT.Display({spacing:1.1});
//        document.body.appendChild(this.display.getContainer());
//
//        this._generateMap();
//
//        var scheduler = new ROT.Scheduler.Simple();
//        scheduler.add(this.player, true);
//        scheduler.add(this.pedro, true);
//
//        this.engine = new ROT.Engine(scheduler);
//        this.engine.start();
//    },
//
//    _generateMap: function() {
//        var digger = new ROT.Map.Digger();
//        var freeCells = [];
//
//        var digCallback = function(x, y, value) {
//            if (value) { return; }
//
//            var key = x+","+y;
//            this.map[key] = ".";
//            freeCells.push(key);
//        }
//        digger.create(digCallback.bind(this));
//
//        this._generateBoxes(freeCells);
//        this._drawWholeMap();
//
//        this.player = this._createBeing(Player, freeCells);
//        this.pedro = this._createBeing(Pedro, freeCells);
//    },
//
//    _createBeing: function(what, freeCells) {
//        var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
//        var key = freeCells.splice(index, 1)[0];
//        var parts = key.split(",");
//        var x = parseInt(parts[0]);
//        var y = parseInt(parts[1]);
//        return new what(x, y);
//    },
//
//    _generateBoxes: function(freeCells) {
//        for (var i=0;i<10;i++) {
//            var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
//            var key = freeCells.splice(index, 1)[0];
//            this.map[key] = "*";
//            if (!i) { this.ananas = key; } /* first box contains an ananas */
//        }
//    },
//
//    _drawWholeMap: function() {
//        for (var key in this.map) {
//            var parts = key.split(",");
//            var x = parseInt(parts[0]);
//            var y = parseInt(parts[1]);
//            this.display.draw(x, y, this.map[key]);
//        }
//    }
//};
//
//var Player = function(x, y) {
//    this._x = x;
//    this._y = y;
//    this._draw();
//}
//
//Player.prototype.getSpeed = function() { return 100; }
//Player.prototype.getX = function() { return this._x; }
//Player.prototype.getY = function() { return this._y; }
//
//Player.prototype.act = function() {
//    Game.engine.lock();
//    window.addEventListener("keydown", this);
//}
//
//Player.prototype.handleEvent = function(e) {
//    var code = e.keyCode;
//    if (code == 13 || code == 32) {
//        this._checkBox();
//        return;
//    }
//
//    var keyMap = {};
//    keyMap[38] = 0;
//    keyMap[33] = 1;
//    keyMap[39] = 2;
//    keyMap[34] = 3;
//    keyMap[40] = 4;
//    keyMap[35] = 5;
//    keyMap[37] = 6;
//    keyMap[36] = 7;
//
//    /* one of numpad directions? */
//    if (!(code in keyMap)) { return; }
//
//    /* is there a free space? */
//    var dir = ROT.DIRS[8][keyMap[code]];
//    var newX = this._x + dir[0];
//    var newY = this._y + dir[1];
//    var newKey = newX + "," + newY;
//    if (!(newKey in Game.map)) { return; }
//
//    Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y]);
//    this._x = newX;
//    this._y = newY;
//    this._draw();
//    window.removeEventListener("keydown", this);
//    Game.engine.unlock();
//}
//
//Player.prototype._draw = function() {
//    Game.display.draw(this._x, this._y, "@", "#ff0");
//}
//
//Player.prototype._checkBox = function() {
//    var key = this._x + "," + this._y;
//    if (Game.map[key] != "*") {
//        alert("There is no box here!");
//    } else if (key == Game.ananas) {
//        alert("Hooray! You found an ananas and won this game.");
//        Game.engine.lock();
//        window.removeEventListener("keydown", this);
//    } else {
//        alert("This box is empty :-(");
//    }
//}
//
//var Pedro = function(x, y) {
//    this._x = x;
//    this._y = y;
//    this._draw();
//}
//
//Pedro.prototype.getSpeed = function() { return 100; }
//
//Pedro.prototype.act = function() {
//    var x = Game.player.getX();
//    var y = Game.player.getY();
//
//    var passableCallback = function(x, y) {
//        return (x+","+y in Game.map);
//    }
//    var astar = new ROT.Path.AStar(x, y, passableCallback, {topology:4});
//
//    var path = [];
//    var pathCallback = function(x, y) {
//        path.push([x, y]);
//    }
//    astar.compute(this._x, this._y, pathCallback);
//
//    path.shift();
//    if (path.length == 1) {
//        Game.engine.lock();
//        alert("Game over - you were captured by Pedro!");
//    } else {
//        x = path[0][0];
//        y = path[0][1];
//        Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y]);
//        this._x = x;
//        this._y = y;
//        this._draw();
//    }
//}
//
//Pedro.prototype._draw = function() {
//    Game.display.draw(this._x, this._y, "P", "red");
//}
//
//
//Game.init();
//
