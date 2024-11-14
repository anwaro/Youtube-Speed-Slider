// ==UserScript==
// @name         Youtube Player Speed Slider
// @namespace    youtube_player_speed_slider
// @version      1.0.0
// @description  Add Speed Slider to Youtube Player Settings
// @author       Łukasz
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(() => {
    'use strict';
    var _modules = {
        'Checkbox.ts': (_unused_module, exports, _require) => {
            Object.defineProperty(exports, '__esModule', {value: true});
            exports.Checkbox = void 0;
            const Component_1 = _require('Component.ts');
            class Checkbox extends Component_1.default {
                constructor(checked) {
                    super('input', {
                        styles: {
                            accentColor: '#f00',
                            width: '20px',
                            height: '20px',
                            margin: '0',
                            padding: '0',
                        },
                        attrs: {
                            type: 'checkbox',
                            title: 'Remember speed',
                            checked: checked,
                        },
                    });
                }
                getValue() {
                    return this.element.checked;
                }
            }
            exports.Checkbox = Checkbox;
        },

        'Component.ts': (_unused_module, exports, _require) => {
            Object.defineProperty(exports, '__esModule', {value: true});
            const Dom_1 = _require('Dom.ts');
            class Component {
                constructor(tag, props = {}) {
                    this.element = Dom_1.Dom.create({tag, ...props});
                }
                addClassName(...className) {
                    this.element.classList.add(...className);
                }
                event(event, callback) {
                    this.element.addEventListener(event, callback);
                }
                getElement() {
                    return this.element;
                }
                mount(parent) {
                    parent.appendChild(this.element);
                }
            }
            exports['default'] = Component;
        },

        'Dom.ts': (_unused_module, exports) => {
            Object.defineProperty(exports, '__esModule', {value: true});
            exports.Dom = void 0;
            class Dom {
                static create(data) {
                    const element = document.createElement(data.tag);
                    if (typeof data.children === 'string') {
                        element.innerHTML = data.children;
                    } else if (data.children) {
                        element.append(
                            ...Dom.array(data.children).map((item) =>
                                item instanceof HTMLElement ||
                                item instanceof SVGElement
                                    ? item
                                    : Dom.create(item),
                            ),
                        );
                    }
                    Dom.applyClass(element, data.classes);
                    Dom.applyAttrs(element, data.attrs);
                    Dom.applyEvents(element, data.events);
                    Dom.applyStyles(element, data.styles);
                    return element;
                }
                static element(tag, classes, children) {
                    return Dom.create({tag, classes, children});
                }
                static createSvg(data) {
                    const element = document.createElementNS(
                        'http://www.w3.org/2000/svg',
                        data.tag,
                    );
                    if (typeof data.children === 'string') {
                        element.innerHTML = data.children;
                    } else if (data.children) {
                        element.append(
                            ...Dom.array(data.children).map((item) =>
                                item instanceof SVGElement
                                    ? item
                                    : Dom.createSvg(item),
                            ),
                        );
                    }
                    Dom.applyClass(element, data.classes);
                    Dom.applyAttrs(element, data.attrs);
                    Dom.applyEvents(element, data.events);
                    Dom.applyStyles(element, data.styles);
                    return element;
                }
                static array(element) {
                    return Array.isArray(element) ? element : [element];
                }
                static elementSvg(tag, classes, children) {
                    return Dom.createSvg({tag, classes, children});
                }
                static applyAttrs(element, attrs) {
                    if (attrs) {
                        Object.entries(attrs).forEach(([key, value]) => {
                            if (value === undefined || value === false) {
                                element.removeAttribute(key);
                            } else {
                                element.setAttribute(key, `${value}`);
                            }
                        });
                    }
                }
                static applyStyles(element, styles) {
                    if (styles) {
                        Object.entries(styles).forEach(([key, value]) => {
                            const name = key.replace(
                                /[A-Z]/g,
                                (c) => `-${c.toLowerCase()}`,
                            );
                            element.style.setProperty(name, value);
                        });
                    }
                }
                static applyEvents(element, events) {
                    if (events) {
                        Object.entries(events).forEach(([name, callback]) => {
                            element.addEventListener(name, callback);
                        });
                    }
                }
                static applyClass(element, classes) {
                    if (classes) {
                        element.setAttribute('class', classes);
                    }
                }
            }
            exports.Dom = Dom;
        },

        'Icon.ts': (_unused_module, exports, _require) => {
            Object.defineProperty(exports, '__esModule', {value: true});
            exports.Icon = void 0;
            const Component_1 = _require('Component.ts');
            const Dom_1 = _require('Dom.ts');
            const iconPath =
                'M10.01,8v8l6-4L10,8L10,8z M6.3,5L5.7,4.2C7.2,3,9,2.2,11,2l0.1,1C9.3,3.2,7.7,3.9,6.3,5z M5,6.3L4.2,5.7C3,7.2,2.2,9,2,11 l1,.1C3.2,9.3,3.9,7.7,5,6.3z M5,17.7c-1.1-1.4-1.8-3.1-2-4.8L2,13c0.2,2,1,3.8,2.2,5.4L5,17.7z M11.1,21c-1.8-0.2-3.4-0.9-4.8-2 l-0.6,.8C7.2,21,9,21.8,11,22L11.1,21z M22,12c0-5.2-3.9-9.4-9-10l-0.1,1c4.6,.5,8.1,4.3,8.1,9s-3.5,8.5-8.1,9l0.1,1 C18.2,21.5,22,17.2,22,12z';
            class Icon extends Component_1.default {
                constructor() {
                    super('div', {
                        classes: 'ytp-menuitem-icon',
                        children: Dom_1.Dom.createSvg({
                            tag: 'svg',
                            attrs: {
                                height: '24',
                                width: '24',
                                viewBox: '0 0 24 24',
                            },
                            children: Dom_1.Dom.createSvg({
                                tag: 'path',
                                attrs: {
                                    fill: 'white',
                                    d: iconPath,
                                },
                            }),
                        }),
                    });
                }
            }
            exports.Icon = Icon;
        },

        'Label.ts': (_unused_module, exports, _require) => {
            Object.defineProperty(exports, '__esModule', {value: true});
            exports.Label = void 0;
            const Component_1 = _require('Component.ts');
            class Label extends Component_1.default {
                constructor(speed, label = 'Speed') {
                    super('div', {classes: 'ytp-menuitem-label'});
                    this.speed = '1.0';
                    this.label = label;
                    this.updateSpeed(speed);
                }
                updateLabel(label = 'Speed') {
                    this.label = label;
                    this.updateText();
                }
                updateSpeed(speed) {
                    this.speed = speed.toFixed(1);
                    this.updateText();
                }
                updateText() {
                    this.element.innerText = `${this.label}: ${this.speed}`;
                }
            }
            exports.Label = Label;
        },

        'Menu.ts': (_unused_module, exports, _require) => {
            Object.defineProperty(exports, '__esModule', {value: true});
            exports.Menu = void 0;
            const SpeedMenuItem_1 = _require('SpeedMenuItem.ts');
            const delay_1 = _require('delay.ts');
            class Menu {
                constructor() {
                    this.getMenu();
                }
                getMenu() {
                    return document.querySelector(
                        '.ytp-settings-menu .ytp-panel-menu',
                    );
                }
                getDefaultMenuItem() {
                    const defaultSpeedItem = [
                        ...document.querySelectorAll('.ytp-menuitem'),
                    ].filter((e) => {
                        var _a;
                        const path =
                            (_a = e.querySelector('.ytp-menuitem-icon path')) ===
                                null || _a === void 0
                                ? void 0
                                : _a.getAttribute('d');
                        return path === null || path === void 0
                            ? void 0
                            : path.startsWith('M10,8v8l6-4L10,');
                    });
                    if (defaultSpeedItem.length) {
                        return defaultSpeedItem[0];
                    }
                    return undefined;
                }
                getLabel() {
                    var _a;
                    const label =
                        (_a = this.getDefaultMenuItem()) === null || _a === void 0
                            ? void 0
                            : _a.querySelector('.ytp-menuitem-label');
                    return label === null || label === void 0
                        ? void 0
                        : label.innerText;
                }
                async reopenMenu() {
                    var _a, _b;
                    const menuButton = document.querySelector(
                        '.ytp-settings-button',
                    );
                    const menu = this.getMenu();
                    if (menu && this.menuHasCustomItem(menu)) {
                        return;
                    }
                    if (menuButton) {
                        (_a =
                            menu === null || menu === void 0
                                ? void 0
                                : menu.style) === null || _a === void 0
                            ? void 0
                            : _a.setProperty('opacity', '0');
                        menuButton.click();
                        await (0, delay_1.delay)(50);
                        menuButton.click();
                        (_b =
                            menu === null || menu === void 0
                                ? void 0
                                : menu.style) === null || _b === void 0
                            ? void 0
                            : _b.setProperty('opacity', '1');
                        await (0, delay_1.delay)(50);
                    }
                }
                menuHasCustomItem(menu) {
                    return Boolean(
                        menu.querySelector(`#${SpeedMenuItem_1.SpeedMenuItem.ID}`),
                    );
                }
                addCustomSpeedItem(item) {
                    var _a;
                    const menu = this.getMenu();
                    const defaultItem = this.getDefaultMenuItem();
                    if (menu === null) {
                        return false;
                    }
                    if (this.menuHasCustomItem(menu)) {
                        (_a =
                            defaultItem === null || defaultItem === void 0
                                ? void 0
                                : defaultItem.parentNode) === null || _a === void 0
                            ? void 0
                            : _a.removeChild(defaultItem);
                        return true;
                    }
                    if (defaultItem) {
                        defaultItem.replaceWith(item.getElement());
                    } else {
                        menu.appendChild(item.getElement());
                    }
                    return true;
                }
            }
            exports.Menu = Menu;
        },

        'Player.ts': (_unused_module, exports) => {
            Object.defineProperty(exports, '__esModule', {value: true});
            exports.Player = void 0;
            class Player {
                constructor(speed) {
                    this.speed = speed;
                    this.player = null;
                    this.setSpeed(this.speed);
                }
                getPlayer() {
                    if (!this.player) {
                        this.player = document.querySelector('.html5-main-video');
                        if (this.player) {
                            this.initEvent(this.player);
                        }
                    }
                    return this.player;
                }
                initEvent(player) {
                    if (!player.getAttribute(Player.READY_FLAG)) {
                        player.addEventListener(
                            'ratechange',
                            this.checkPlayerSpeed.bind(this),
                        );
                        player.setAttribute(Player.READY_FLAG, 'ready');
                    }
                }
                checkPlayerSpeed() {
                    const player = this.getPlayer();
                    if (
                        player &&
                        Math.abs(player.playbackRate - this.speed) > 0.01
                    ) {
                        player.playbackRate = this.speed;
                        setTimeout(this.checkPlayerSpeed.bind(this), 200);
                    }
                }
                setSpeed(speed) {
                    this.speed = speed;
                    const player = this.getPlayer();
                    if (player !== null) {
                        player.playbackRate = speed;
                    }
                }
            }
            exports.Player = Player;
            Player.READY_FLAG = 'yts-listener';
        },

        'Slider.ts': (_unused_module, exports, _require) => {
            Object.defineProperty(exports, '__esModule', {value: true});
            exports.Slider = void 0;
            const Component_1 = _require('Component.ts');
            class Slider extends Component_1.default {
                constructor(speed) {
                    super('input', {
                        attrs: {
                            type: 'range',
                            min: Slider.MIN_VALUE,
                            max: Slider.MAX_VALUE,
                            step: 0.05,
                            value: speed.toString(),
                        },
                        styles: {
                            accentColor: '#f00',
                            width: 'calc(100% - 30px)',
                            margin: '0 5px',
                            padding: '0',
                        },
                    });
                }
                setSpeed(speed) {
                    this.element.value = speed.toString();
                }
                getSpeed() {
                    return parseFloat(this.element.value);
                }
            }
            exports.Slider = Slider;
            Slider.MIN_VALUE = 0.5;
            Slider.MAX_VALUE = 4;
        },

        'SpeedMenuItem.ts': (_unused_module, exports, _require) => {
            Object.defineProperty(exports, '__esModule', {value: true});
            exports.SpeedMenuItem = void 0;
            const Component_1 = _require('Component.ts');
            const Dom_1 = _require('Dom.ts');
            class SpeedMenuItem extends Component_1.default {
                constructor() {
                    super('div', {
                        classes: 'ytp-menuitem',
                        attrs: {
                            id: SpeedMenuItem.ID,
                        },
                    });
                    this.wrapper = Dom_1.Dom.element('div', 'ytp-menuitem-content');
                }
                addElement(icon, label, slider, checkbox) {
                    this.element.append(icon, label, this.wrapper);
                    this.wrapper.append(checkbox, slider);
                }
            }
            exports.SpeedMenuItem = SpeedMenuItem;
            SpeedMenuItem.ID = 'yts-speed-menu-item';
        },

        'AppController.ts': (_unused_module, exports, _require) => {
            Object.defineProperty(exports, '__esModule', {value: true});
            exports.AppController = void 0;
            const Icon_1 = _require('Icon.ts');
            const Label_1 = _require('Label.ts');
            const Slider_1 = _require('Slider.ts');
            const Checkbox_1 = _require('Checkbox.ts');
            const Store_1 = _require('Store.ts');
            const SpeedMenuItem_1 = _require('SpeedMenuItem.ts');
            const Menu_1 = _require('Menu.ts');
            const Player_1 = _require('Player.ts');
            const Observer_1 = _require('Observer.ts');
            class AppController {
                constructor() {
                    this.rememberSpeed = new Store_1.Store('yts-remember-speed');
                    this.speed = new Store_1.Store('yts-speed');
                    const initialSpeed = this.getSpeed();
                    this.menu = new Menu_1.Menu();
                    this.player = new Player_1.Player(initialSpeed);
                    this.speedMenuItem = new SpeedMenuItem_1.SpeedMenuItem();
                    this.icon = new Icon_1.Icon();
                    this.label = new Label_1.Label(initialSpeed);
                    this.slider = new Slider_1.Slider(initialSpeed);
                    this.checkbox = new Checkbox_1.Checkbox(
                        this.rememberSpeed.get(false),
                    );
                    this.observer = new Observer_1.Observer();
                    this.speedMenuItem.addElement(
                        this.icon.getElement(),
                        this.label.getElement(),
                        this.slider.getElement(),
                        this.checkbox.getElement(),
                    );
                    this.initEvents();
                }
                initEvents() {
                    this.slider.event('change', this.sliderChangeEvent.bind(this));
                    this.slider.event('input', this.sliderChangeEvent.bind(this));
                    this.slider.event('wheel', this.sliderWheelEvent.bind(this));
                    this.checkbox.event('change', this.checkboxEvent.bind(this));
                    document.addEventListener('spfdone', this.initApp.bind(this));
                }
                sliderChangeEvent(_) {
                    this.updateSpeed(this.slider.getSpeed());
                }
                checkboxEvent(_) {
                    this.rememberSpeed.set(this.checkbox.getValue());
                }
                sliderWheelEvent(event) {
                    const current = this.slider.getSpeed();
                    const diff = event.deltaY > 0 ? -0.05 : 0.05;
                    const value = Math.max(
                        Slider_1.Slider.MIN_VALUE,
                        Math.min(current + diff, Slider_1.Slider.MAX_VALUE),
                    );
                    if (current != value) {
                        this.slider.setSpeed(value);
                        this.updateSpeed(value);
                    }
                    event.preventDefault();
                }
                updateSpeed(speed) {
                    this.speed.set(speed);
                    this.player.setSpeed(speed);
                    this.label.updateSpeed(speed);
                }
                getSpeed() {
                    return this.rememberSpeed.get() ? this.speed.get(1) : 1;
                }
                mutationCallback() {
                    this.initApp();
                }
                async initApp() {
                    this.player.setSpeed(this.getSpeed());
                    await this.menu.reopenMenu();
                    const label = this.menu.getLabel();
                    if (label) {
                        this.label.updateLabel(label);
                    }
                    const player = this.player.getPlayer();
                    if (player) {
                        this.observer.start(
                            player,
                            this.mutationCallback.bind(this),
                        );
                    }
                    return this.menu.addCustomSpeedItem(this.speedMenuItem);
                }
            }
            exports.AppController = AppController;
        },

        'Observer.ts': (_unused_module, exports) => {
            Object.defineProperty(exports, '__esModule', {value: true});
            exports.Observer = void 0;
            class Observer {
                stop() {
                    if (this.observer) {
                        this.observer.disconnect();
                    }
                }
                start(element, callback) {
                    this.stop();
                    this.observer = new MutationObserver(callback);
                    this.observer.observe(element, {
                        childList: true,
                        subtree: true,
                        attributes: true,
                        characterData: true,
                        attributeOldValue: true,
                        characterDataOldValue: true,
                    });
                }
            }
            exports.Observer = Observer;
        },

        'Store.ts': (_unused_module, exports) => {
            Object.defineProperty(exports, '__esModule', {value: true});
            exports.Store = void 0;
            class Store {
                constructor(key) {
                    this.key = key;
                }
                encode(val) {
                    return JSON.stringify(val);
                }
                decode(val) {
                    return JSON.parse(val);
                }
                set(value) {
                    try {
                        localStorage.setItem(this.key, this.encode(value));
                    } catch (e) {
                        return;
                    }
                }
                get(defaultValue = undefined) {
                    try {
                        const data = localStorage.getItem(this.key);
                        if (data) {
                            return this.decode(data);
                        }
                        return defaultValue;
                    } catch (e) {
                        return defaultValue;
                    }
                }
                remove() {
                    localStorage.removeItem(this.key);
                }
            }
            exports.Store = Store;
        },

        'delay.ts': (_unused_module, exports) => {
            Object.defineProperty(exports, '__esModule', {value: true});
            exports.delay = void 0;
            async function delay(ms = 1000) {
                return await new Promise((resolve) => {
                    setTimeout(resolve, ms);
                });
            }
            exports.delay = delay;
        },
    };

    var _module_cache = {};

    function _require(moduleId) {
        var cachedModule = _module_cache[moduleId];
        if (cachedModule !== undefined) {
            return cachedModule.exports;
        }

        var module = (_module_cache[moduleId] = {
            exports: {},
        });

        _modules[moduleId](module, module.exports, _require);

        return module.exports;
    }

    var _exports = {};

    (() => {
        var exports = _exports;
        var _unused_export;

        _unused_export = {value: true};
        const AppController_1 = _require('AppController.ts');
        const app = new AppController_1.AppController();
        async function init() {
            const ok = await app.initApp();
            if (!ok) {
                window.setTimeout(init, 2000);
            }
        }
        document.addEventListener('spfdone', init);
        init();
    })();
})();
