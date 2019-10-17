(function() {
    var helper = {
        objToCss: function(obj) {
            var cstr = '';
            for(var key in obj) {
                cstr += key + ':' + obj[key] + ';';
            }
            return cstr;
        },
        objReplace: function(obja, objb) {
            for(var key in objb) {
                if(objb[key] instanceof Array) obja[key] = objb[key];

                if(objb[key] instanceof Object) this.objReplace(obja[key], objb[key])

                if(!(objb[key] instanceof Object)) obja[key] = objb[key];
            }
            return obja;
        },
        rand: function(range) {
            return Math.floor(Math.random() * range);
        }
    };

    // Root scope
    var g_this_gif;

    function gif() {
        g_this_gif = this;

        this.clock = 0;
        this.tickSec = 1000;
        this.tick = 10;
        this.sec = 0;
        this.intervalId = 0;
        this.config = {
            src: '',
            width: 400,
            height: 400,
            entities: []
        };
        this.dom = {
            container: document.getElementById('gif-container'),
            img: {}
        }
        this.entities = [];
        this.oEntities = [];
    }

    gif.prototype.main = function(config) {
        // todo: param check
        // ...

        this.config = helper.objReplace(this.config, config);

        this._load(this.config, false);
    }

    gif.prototype._load = function(config, cache) {
        var that = this;
        var img = new Image();

        this.dom.container.style.display = 'none';
        img.onload = function () {
            that.dom.container.style.display = 'block';
            that.dom.container.append(img);

            // Main entities
            for(var key in config.entities) that.entities.push(new entity(config.entities[key]));

            that.oEntities = JSON.stringify(config.entities);

            // Tick...
            clearInterval(that.intervalId);
            that.intervalId = setInterval(function() {
                that.render();
            }, that.tick);

            // Register events
            gif.events.register();

            gif.listeners.execute.call(that, 'onLoad');
        };

        img.src = config.src + '?v=' + ((cache) ? '1' : helper.rand(1000));
        img.width = config.width;
        img.height = config.height;

        img.setAttribute('id', 'gif-img');
        this.dom.img = img;
    }

    gif.listeners = {
        onLoad: [],
        onRender: [],

        onMouseDown: [],
        onMouseUp: [],

        onKeyDown: [],
        onKeyUp: [],

        execute: function(methodName) {
            for(var i = 0; i < gif.listeners[methodName].length; i++)
                gif.listeners[methodName][i].apply(this);
        }
    };

    gif.events = {
        mouse: {
            x: 0,
            y: 0,
            pressed: false,
            down: function(e) {
                gif.events.mouse.pressed = true;

                gif.events.mouse.x = e.pageX - g_this_gif.dom.container.offsetLeft;
                gif.events.mouse.y = e.pageY - g_this_gif.dom.container.offsetTop;

                gif.listeners.execute.call(g_this_gif, 'onMouseDown');
            },
            up: function(e) {
                gif.events.mouse.pressed = false;
                gif.listeners.execute.call(g_this_gif, 'onMouseUp');
            }
        },
        key: {
            pressed: false,
            code: 0,
            char: '',
            down: function(e) {
                gif.events.key.pressed = true;
                gif.events.key.code = e.keyCode;
                gif.events.key.char = String.fromCharCode(e.keyCode);
                gif.listeners.execute.call(g_this_gif, 'onKeyDown');
            },
            up: function(e) {
                gif.events.key.pressed = false;
                gif.listeners.execute.call(g_this_gif, 'onKeyUp');
            }
        },
        register: function() {
            var img = document.getElementById('gif-img');

            img.removeEventListener('mousedown', this.mouse.down);
            img.addEventListener('mousedown', this.mouse.down);

            img.removeEventListener('mouseup', this.mouse.up);
            img.addEventListener('mouseup', this.mouse.up);

            window.removeEventListener('keydown', this.key.down);
            window.addEventListener('keydown', this.key.down);

            window.removeEventListener('keyup', this.key.up);
            window.addEventListener('keyup', this.key.up);
        }
    };

    gif.prototype.render = function() {
        this.clock += this.tick;

        if(this.clock % 1000 === 0) this.sec++; // console.log(this.sec);

        for(var key in this.entities) this.entities[key].visibleFrame(this.clock, this.sec);

        // gif.listeners.execute.call(this, 'onRender');
    }

    // note: doesn't work properly
    // todo: fix
    gif.prototype.reset = function() {
        this.clock = 0; this.sec = 0;

        this.config.entities = JSON.parse(this.oEntities);

        for(var key in this.entities) {
            document.getElementById(this.entities[key].config.id).remove();
        }
        this.entities = [];

        // Main entities
        for(var key in this.config.entities) this.entities.push(new entity(this.config.entities[key]));

        // reset the dom...
        // this._load(this.config, true);
    }

    function entity(config) {
        gif.call(this)

        this.config = {
            id: 'id' + Math.floor(Math.random() * 100),
            value: '',
            showFrame: 0,
            delay: 1,
            show: true,
            style: {
                left: 0,
                top: 0,
                display: 'none',
                opacity: 0
            }, // css
            animation: {
                fade: {
                    init: true,
                    opacity: 0,
                    inc: 1 // 1 or -1
                }
            }
        };

        this.config.value = this.config.id;

        this.config = helper.objReplace(this.config, config);

        this.hit = false;
        this.hitFrame = 0;

        console.log(this.config);

        this.entity = document.createElement('div');
        this.entity.setAttribute('id', this.config.id);
        this.entity.setAttribute('class', 'tag ' + this.config.id);

        this.style = helper.objToCss(this.config.style);

        this.entity.setAttribute('style', this.style);

        this.entity.innerHTML = this.config.value;

        this.dom.container.appendChild(this.entity);
    }

    entity.prototype = Object.create(gif.prototype);
    entity.prototype.constructor = gif;

    entity.prototype.buildConfig = function() {
        this.entity.setAttribute('style', helper.objToCss(this.config.style));
    }

    entity.prototype.show = function(show) {
        var anim = this.config.animation;
        this.config.style.opacity = 0;

        if(anim.fade.init) {
            var inc =  this.tick / this.tickSec;
            anim.fade.opacity += inc * anim.fade.inc;
            anim.fade.opacity = anim.fade.opacity.toFixed(2);
            anim.fade.opacity = parseFloat(anim.fade.opacity);

            if(show) {
                anim.fade.inc *= Math.abs(anim.fade.inc);
            } else {
                if(anim.fade.inc > 0) anim.fade.inc *= -1;
            };

            anim.fade.opacity = Math.min(anim.fade.opacity, 1);

            this.config.style.display = 'block';
            this.config.style.opacity += anim.fade.opacity;
        }

        this.buildConfig();

        return this;
    };

    entity.prototype.setPos = function(x, y) {
        this.config.style.left = x;
        this.config.style.top = y;

        this.buildConfig();

        return this;
    }

    entity.prototype.setValue = function(value) {
      this.entity.innerHTML = value;
      return this;
    };

    entity.prototype.visibleFrame = function(clock, tick) {
        var hit = this.config.showFrame * this.tickSec == clock;

        if(hit) { this.hit = hit; this.hitFrame = clock; console.log('hitFrame ' + this.hitFrame); }

        if(this.hit) {
            var hideFrame = this.hitFrame + (this.config.delay * this.tickSec);

            if(hideFrame <= clock) {
                // console.log(hideFrame, clock, (hideFrame + this.tickSec), (hideFrame + this.tickSec) < clock);
                if((hideFrame + this.tickSec) < clock) this.hit = false;

                this.show(false);
            } else {
                this.show(true);
            }

        }

    };

    // note: not good, I'll research js scopes a little more
    var g_this_gifBuilder;

    function gifBuilder(cgif) {
        g_this_gifBuilder = this;

        this.cgif = cgif;
        this.eConf = {
            style: {
                left: 0,
                top: 0,
                'font-size': '20px',
                'color': '#000',
                'font-weight': 'bold'
            }
        };
        this.entities = [];

        this.dom = {
            container: document.getElementById('gif-builder'),
            textArea: {}
        };

        // This will be called by the gif class, they pass their scopes with them
        // when they call 'this' scope of this function will be invalid, so
        // we use the mgical global g_this_gifBuilder. :)
        gif.listeners.onLoad.push(this.main);
        gif.listeners.onMouseDown.push(this.onMouseDown);
        gif.listeners.onKeyDown.push(this.onKeyDown);
    }

    gifBuilder.prototype.main = function() {
        var that = g_this_gifBuilder;
        that.dom.textArea = document.createElement('textarea');

        that.dom.textArea.style = 'margin: 0px; width: ' + that.cgif.config.width
        + '; height: 256px';

        // Have to use the global scope
        that.dom.container.appendChild(that.dom.textArea);
    }

    gifBuilder.prototype.onMouseDown = function() {
        var that = g_this_gifBuilder;

        console.log('onMouseDown');
        console.log(that.cgif.clock);

        that.eConf.showFrame = that.cgif.clock / that.cgif.tickSec;
        that.eConf.style.left = gif.events.mouse.x;
        that.eConf.style.top = gif.events.mouse.y;
    }

    gifBuilder.prototype.onKeyDown = function() {
        var that = g_this_gifBuilder;

        console.log('onMouseDown');
        console.log(that.cgif);

        if(gif.events.key.char === 'S') {
            console.log(that.eConf);

            var eConf = JSON.parse(JSON.stringify(that.eConf));

            eConf.delay = (that.cgif.clock - that.eConf.showFrame) / that.cgif.tickSec;

            that.entities.push(eConf);

            that.dom.textArea.innerText = JSON.stringify(that.entities);
        }

        console.log(that.eConf);
    }

    window.gif = gif;
    window.gifBuilder = gifBuilder;

})();
