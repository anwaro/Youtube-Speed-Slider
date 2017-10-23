
var yts = {};

// yts.env = "dev";
yts.env = "prod";

yts.option = {
    timeoutBuild: 500,
    timeoutRemove: 1000,
    lastClick: 0
};

yts.elements = {
    menu : null,
    speedMenu: null,
    slider: null,
    sliderLabel: null,
    annot: null
};

yts.event = {
    speedRemove: false,
    playerObserve: false,
    addEnd: true
};

yts.modules = {
    'before':[
        'click',
        'setting',
        'i18n',
        'ad'
    ],
    'after':[
        'slider',
        'menu',
        'annot',
        'player',
        'appmenu'
    ],
    'spfdone':[
        'appmenu',
        'player',
        'annot'
    ]
};

/*************************************
 *          TRANSLATION              *
 ************************************/
yts.i18n = {};

yts.i18n.dic = {
    pl: {
        'Speed': 'Szybkość',
        'Settings': 'Ustawienia',
        'Language': 'Język',
        'Switch off advertisement': 'Wyłączaj reklamy',
        'Hide annotation': 'Ukryj adnotacje',
        'Remember speed': 'Pamiętaj szybkość'
    },
    de: {
        'Speed' : 'Geschwindigkeit',
        'Settings': 'Einstellungen',
        'Language': 'Sprache',
        'Switch off advertisement': 'Abschalten Werbung',
        'Hide annotation': 'Ausblenden Anmerkungen',
        'Remember speed': 'Erinnern Geschwindigkeit'
    },
    fr:{
        'Speed':'Vitesse',
        'Settings':'Paramètres',
        'Language': 'La langue',
        'Switch off advertisement': 'Désactiver la publicité',
        'Hide annotation': 'Cacher les annotations',
        'Remember speed': 'Rappelez-vous la vitesse'
    },
    en:{}
};

yts.i18n.opt = {
    lang: 'en',
    default: 'en',
    map:{
        pl: 'pl',
        pl_pl: 'pl',
        en: 'en',
        en_gb: 'en',
        de: 'de',
        fr: 'fr'
    }
};

yts.i18n.init = function () {
    yts.i18n.opt.lang = yts.i18n.getLang();
    yts.setting.change('lang', function (val) {
        yts.i18n.opt.lang = yts.i18n.getLang();
    });
};

yts.i18n.getLang = function () {
    var lang = yts.i18n.filter(yts.setting.get('lang'));
    if(lang !== '' && yts.i18n.isAllow(lang)){
        return yts.i18n.map(lang);
    }

    lang = yts.i18n.filter(yts.$.get('html').getAttribute('lang'));
    if(lang !== '' && yts.i18n.isAllow(lang)){
        return yts.i18n.map(lang);
    }

    return yts.i18n.opt.default;
};

yts.i18n.isAllow = function (lang) {
    return yts.i18n.opt.map.hasOwnProperty(lang);
};

yts.i18n.t = function (pattern) {
    if(yts.i18n.dic.hasOwnProperty(yts.i18n.opt.lang) &&
        yts.i18n.dic[yts.i18n.opt.lang].hasOwnProperty(pattern)){
        return yts.i18n.dic[yts.i18n.opt.lang][pattern];
    }
    else {
        return pattern;
    }
};

yts.i18n.filter = function (lang) {
    return lang ? lang.replace('-', '_').toLowerCase() : '';
};

yts.i18n.map = function (lang) {
    return  yts.i18n.opt.map[lang]
};

yts.i18n.all = function () {
    var ret=[];
    for(var p in yts.i18n.dic) if(yts.i18n.dic.hasOwnProperty(p)) ret.push(p);
    return ret;
};

/*************************************
 *          INIT                     *
 ************************************/
yts.init = function () {
    yts.log('Init App');
    yts.modules.before.forEach(function (module) {
        yts.run(module);
    });
    yts.$.event(document, "spfdone", function () {
        yts.modules.spfdone.forEach(function (module) {
            yts.run(module);
        });
    });

    yts.option.lastClick = (new Date()).getTime();
    yts.menu.reopen();
    yts.buildApp(0);
};

yts.run = function (module) {
    try{
        yts.log('Init ' + module + ' module');
        yts[module].init();
    }
    catch (e){
        yts.log('Error in ' + module + ' module');
    }
};

yts.buildApp = function (num) {
    num++;
    yts.elements.menu = yts.$.get('.ytp-panel-menu');
    if (yts.elements.menu !== null) {
        yts.log('Init Build Menu after ' + num + ' attempt(s)');
        setTimeout(yts.menu.removeDefaultSpeed, yts.option.timeoutRemove);
        yts.modules.after.forEach(function (module) {
            yts.run(module);
        });
    }
    else {
        yts.log('Settimeout buildApp attempt: ' + num);
        setTimeout(yts.buildApp, yts.option.timeoutBuild, num);
    }
};


/*************************************
 *          MENU                    *
 ************************************/
yts.menu = {};

yts.menu.init = function () {

    var speedMenu = yts.$.new('div', {'className': 'ytp-menuitem', id:'yts-menu'});
    var right = yts.$.new('div', {'className': 'ytp-menuitem-content'});

    speedMenu.appendChild(yts.elements.sliderLabel);
    speedMenu.appendChild(right.appendChild(yts.elements.slider));
    yts.elements.menu.appendChild(speedMenu);
    yts.menu.event();
};

yts.menu.event = function () {
    yts.elements.menu.addEventListener('click', yts.menu.click);
};

yts.menu.removeDefaultSpeed = function(){
    var switchers = yts.$.getOpt(".ytp-menuitem", {role:'menuitemcheckbox'});
    var toRemove = null;

    if(!yts.player.hasClass('ad-interrupting') &&
        switchers &&
        switchers.length &&
        !yts.event.speedRemove
    ){
        toRemove = switchers[switchers.length-1].nextElementSibling;
        if(toRemove && toRemove.id !== 'yts-menu'){

            yts.log('Remove default speed menu item');
            yts.$.style(toRemove, 'display', 'none');
            yts.event.speedRemove = true;
        }
    }
};

yts.menu.reopen = function () {
    var settings_button = yts.$.get(".ytp-settings-button");
    settings_button && settings_button.click();
    settings_button && settings_button.click();
};

yts.menu.click = function () {
    yts.option.lastClick = (new Date()).getTime();
};

/*************************************
 *          SLIDER                   *
 ************************************/
yts.slider = {};

yts.slider.init = function () {
    var speed = yts.setting.get('speed') || 1;
    speed = yts.setting.get('rem') ? speed : 1;
    yts.elements.sliderLabel = yts.$.new('div', {'className': 'ytp-menuitem-label'});
    yts.elements.slider = yts.$.new('input', {
        'className': '',
        'type': 'range',
        'min': 0.5,
        'max': 4,
        'step': 0.1,
        'value': speed,
        style:{
            'width': '90%',
            'margin':'0 5%',
            'padding': '6px 0'
        }
    });
    yts.$.event(yts.elements.slider, 'change', yts.slider.change);
    yts.$.event(yts.elements.slider, 'input', yts.slider.move);
    yts.$.event(yts.elements.slider, 'wheel', yts.slider.wheel);

    yts.slider.updateLabel(speed);
};

yts.slider.move = function (event) {
    yts.slider.updateLabel(event.target.value);
};

yts.slider.wheel = function (event) {
    var val = parseFloat(event.target.value) + (event.wheelDelta > 0 ? 0.1 : -0.1);
    val = val < 0.5 ? 0.5 : (val > 4 ? 4 : val);
    if(event.target.value != val){
        event.target.value = val;
        yts.player.duration(val);
        yts.slider.updateLabel(val);
    }
    event.preventDefault();
};

yts.slider.change = function (event) {
    yts.player.duration(event.target.value);
};

yts.slider.updateLabel = function (val) {
    yts.elements.sliderLabel.innerHTML = yts.i18n.t('Speed') + ': ' + parseFloat(val).toFixed(1);
};


/*************************************
 *          PLAYER                   *
 ************************************/
yts.player = {};

yts.player.init = function(){
    yts.elements.player = yts.$.get('.html5-main-video');
    yts.player.observe();
    if(yts.setting.get('speed') && yts.setting.get('rem')){
        yts.player.duration(yts.setting.get('speed'));
        yts.slider.updateLabel(yts.setting.get('speed'));
    }

};

yts.player.hasClass = function (cls) {
    yts.player.init();
    return yts.elements.player && yts.elements.player.classList.contains(cls)
};

yts.player.duration = function(value){
    yts.setting.set('speed', value);
    yts.elements.player.playbackRate = value;
};

yts.player.observe = function () {
    if(!yts.event.playerObserve){
        yts.observer.init(yts.elements.player.parentNode.parentNode, function (mutation) {
            if(/html5-video-player/.test(mutation.target.className) && !yts.event.speedRemove) {
                yts.menu.removeDefaultSpeed();
            }
        });
        yts.event.playerObserve = true;
    }
};

/*************************************
 *          ANNOTATION               *
 ************************************/
yts.annot = {};
yts.annot.init = function(){
    yts.elements.annot = yts.$.get('.video-annotations');
    if(yts.setting.get('annot')){
        yts.annot.switch("off");
    }
    yts.setting.change('annot', function (val) {
        if(val){
            yts.annot.switch("off");
        }
        else{
            yts.annot.switch("on");
        }
    });
};

yts.annot.change = function (mutation) {
    if(mutation.type == "attributes" && mutation.target.getAttribute('role')=="menuitemcheckbox"){
        yts.annot.switch("off");
    }
};

yts.annot.switch = function(type){
    if(yts.elements.annot && type == 'off'){
        yts.$.style(yts.elements.annot, 'display', 'none', 'important');
    }
    else if(yts.elements.annot && type == 'on'){
        yts.$.style(yts.elements.annot, 'display', 'block');
    }
};

/*************************************
 *          COOKIE                   *
 ************************************/
yts.cookie ={};

yts.cookie.set = function (name, value, option) {
    var d = new Date();
    option = option || {};
    option.expires = option.expires || 366;
    d.setTime(d.getTime() + (option.expires*24*60*60*1000));
    option.expires =  d.toUTCString();
    option.path = option.path || '/';

    var cookie = name + "=" + value + "; ";
    for(var prop in option){
        cookie += prop + "=" + option[prop] +"; ";
    }
    document.cookie = cookie;
};

yts.cookie.get = function (name) {
    name += "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return null;
};

/************************************
 *                DOM                *
 ************************************/
yts.$ = {};

yts.$.event = function (obj, event, callback) {
    obj.addEventListener(event, callback);
};

yts.$.new = function (tag, option) {
    var element = document.createElement(tag);
    for (var param in option) {
        if(param == 'data' || param == 'style'|| param == 'attr'){
            for(var data in option[param]){
                yts.$[param](element, data, option[param][data]);
            }
        }
        else{
            element[param] = option[param];
        }
    }
    return element;
};

yts.$.get = function (tselector, all) {
    all = all || false;
    var type = tselector.substring(0, 1);
    var selector = tselector.substring(1);
    var elements;
    if (type == "#") {
        return document.getElementById(selector);
    }
    else if (type == ".") {
        elements = document.getElementsByClassName(selector);
    }
    else{
        elements = document.querySelectorAll(tselector);
    }

    if (all) {
        return elements;
    }
    else {
        return elements.length ? elements[0] : null;
    }
};

yts.$.data = function (elem, key, val) {
    key = key.replace(/-(\w)/gi, function(x){return x.charAt(1).toUpperCase()});
    if(typeof val !== 'undefined'){
        elem.dataset[key] = val;
    }
    return elem.dataset[key];

};

yts.$.style = function (elem, key, val, priority) {
    priority = priority || '';
    if(typeof val !== 'undefined'){
        elem.style.setProperty(key, val, priority);
    }
    return elem.style.getPropertyValue(key);

};

yts.$.attr = function (elem, key, val) {
    if(typeof val !== 'undefined'){
        elem.setAttribute(key, val);
    }
    return elem.getAttribute(key);

};

yts.$.getOpt = function(selector, option){
    var el = yts.$.get(selector, true);
    var pass = [];
    var correct;
    for(var i =0; i< el.length; i++){
        correct = true;
        for(var prop in option){
            if(!yts.$.has(el[i], prop, option[prop])){
                correct = false;
                break;
            }
        }
        if(correct){
            pass.push(el[i]);
        }
    }
    return pass;
};

yts.$.has = function (elem, key, val) {
    if(elem.hasAttribute(key)){
        var attr = elem.getAttribute(key);
        if(val !== null){
            return attr == val;
        }
        return true;
    }
    return false;
};


/*************************************
 *          OBSERVER                 *
 ************************************/
yts.observer= {};

yts.observer.obj = null;

yts.observer.get = function () {
    return window.MutationObserver || window.WebKitMutationObserver;
};

yts.observer.init = function (element, callback) {
    var MutationObserver = yts.observer.get();
    if( MutationObserver ){
        var obs = new MutationObserver(function(mutations, observer){
            callback(mutations[0]);
        });

        obs.observe( element, {
            childList: true,
            subtree: true,
            attributes:true,
            characterData:true,
            attributeOldValue:true,
            characterDataOldValue:true
        });
    }
};


/*************************************
 *          SETTINGS                 *
 ************************************/
yts.setting = {};
yts.setting.item = {
    rem:{
        label: 'Remember speed',
        type: 'switcher'
    },
    annot:{
        label: 'Hide annotation',
        type: 'switcher'
    },
    ad:{
        label: 'Switch off advertisement',
        type: 'switcher'
    },
    lang:{
        label: 'Language',
        type: 'radio',
        items: yts.i18n.all()
    }
};
yts.setting.settings = null;
yts.setting.event = {};

yts.setting.init = function(){
    var setting = localStorage.getItem('yts');
    yts.setting.settings = JSON.parse(setting === null ? '{}' : setting);
};

yts.setting.set = function(key, val){
    yts.setting.settings[key] = val;

    if(yts.setting.event.hasOwnProperty(key)){
        yts.setting.event[key](val);
    }
    localStorage.setItem('yts', JSON.stringify(yts.setting.settings));
};

yts.setting.get = function(kay){
    return yts.setting.settings.hasOwnProperty(kay) ?
        yts.setting.settings[kay] : null;
};

yts.setting.change = function(key, callback){
    yts.setting.event[key] = callback;
};

/*************************************
 *          CLICK                    *
 ************************************/
yts.click = {};
yts.click.fun = [];
yts.click.init = function(){
    yts.$.event(yts.$.get('body'), 'click', function(event){
        for(var i =0; i<yts.click.fun.length; i++){
            yts.click.fun[i](event);
        }
    })
};

yts.click.add = function(fun){
    yts.click.fun.push(fun);
};

/*************************************
 *          LOGGER                   *
 ************************************/

yts.log = function (text, type) {
    if(yts.env == 'prod') return 1;
    type = type || 'l';
    var app = "[YT SPEED SLIDER] ";
    if(type == "l") console.log(app, text);
    else if(type == "e") console.error(app, text);
    else if(type == "i") console.info(app, text);
    else if(type == "w") console.warn(app, text);
};

/*************************************
 *          ADVERTISEMENT            *
 ************************************/
yts.ad = {};
yts.ad.init = function(){
    if(yts.setting.get('ad')){
        yts.ad.switch('off');
    }
    yts.setting.change('ad', function (val) {
        if(val){
            yts.ad.switch('off');
        }
        else{
            yts.ad.switch('on');
        }
    });
};

yts.ad.switch = function (type) {
    var ad = yts.$.get(".video-ads");
    if(type == "off"){
        yts.cookie.set("VISITOR_INFO1_LIVE", "oKckVSqvaGw", {domain: "youtube.com"});
        ad && yts.$.style(ad, 'display', 'none', 'important');
    }
    else {
        yts.cookie.set("VISITOR_INFO1_LIVE", "", {domain: "youtube.com", expires: -1});
        ad && yts.$.style(ad, 'display', 'block');
    }
};


/*************************************
 *          APP MENU                 *
 ************************************/
yts.appmenu = {};

yts.appmenu.init = function(){
    yts.appmenu.build();
};

yts.appmenu.build = function(){

    yts.appmenu.panel();
    var menu = yts.$.get("#watch8-secondary-actions");
    if(menu){
        menu.appendChild(yts.appmenu.button());
    }
};

yts.appmenu.button = function(){
    var button = yts.$.new('button', {
        'className':'yt-uix-button yt-uix-button-opacity action-panel-trigger yt-uix-button-toggled',
        'title' : yts.i18n.t('Settings'),
        'type':'button',
        'innerHTML':'<span class="yt-uix-button-content">Yts</span>',
        'data': {
            'tooltip-text':yts.i18n.t('Settings'),
            'button-toggle':'true',
            'trigger-for':'action-panel-yts'
        }
    });

    return button;
};

yts.appmenu.panel = function(){
    var panel = yts.$.new('div', {
        'id':'action-panel-yts',
        'className':'action-panel-content',
        data: {'panel-loaded':'true'},
        style: {'display':'none'}
    });

    var list = yts.$.new('ul', {'className':'yt-uix-kbd-nav yt-uix-kbd-nav-list'});
    yts.appmenu.addSettingItems(list);
    panel.appendChild(list);
    var panels = yts.$.get('#watch-action-panels');
    if(panels){
        panels.appendChild(panel);
    }
};

yts.appmenu.addSettingItems = function (list) {
    for(var item in yts.setting.item){
        var li = yts.$.new('li', {
            'className':'ytp-menuitem',
            'role':"menuitemcheckbox",
            attr: {
                'aria-checked': yts.setting.get(item) ? "true" : "false",
            }
        });
        var type = yts.setting.item[item].type;
        if(type === 'switcher'){
            li = yts.appmenu.switcherItem(li, item);
        }
        if(type === 'radio'){
            li = yts.appmenu.radioItem(li, item);
        }

        list.appendChild(li);
    }
};


yts.appmenu.switcherItem = function(li, item){
    var switcher = yts.$.new('div', {
        'className':'ytp-menuitem-toggle-checkbox',
        style: {
            'background-color':'#d2d2d2',
            'margin-left': '10px'
        },
        data: {
            'name': item
        },
        'onclick' : function (event) {
            var el = event.target;
            var parent = el.parentNode;
            var stat = parent.getAttribute('aria-checked');
            if(stat == 'false'){
                yts.$.attr(parent, 'aria-checked' , 'true');
                yts.setting.set(yts.$.data(el, 'name'), true);
            }
            else{
                yts.$.attr(parent, 'aria-checked' , 'false');
                yts.setting.set(yts.$.data(el, 'name'), false);
            }
        }
    });
    var span = yts.$.new('span', {'innerHTML':yts.i18n.t(yts.setting.item[item].label)});


    li.appendChild(switcher);
    li.appendChild(span);
    return li;
};

yts.appmenu.radioItem = function(li, item){
    var list = yts.setting.item[item].items;
    var checked = yts.setting.get(item);
    li.appendChild(yts.$.new('div',{'innerHTML':yts.i18n.t(yts.setting.item[item].label), style:{'margin-bottom':'5px'}}));

    for(var i =0; i< list.length; i++){
        var label = yts.$.new('label',{style:{'margin-right':'5px'}});
        var spanInput = yts.$.new('span', {
            'className': 'yt-uix-form-input-radio-container'
        });
        var input = yts.$.new('input', {
            'type': 'radio',
            'name': 'yts-' + item,
            'checked': list[i] == checked,
            data: {
                'name': item,
                'val': list[i]
            },
            'onchange': function (event) {
                var el = event.target;
                yts.setting.set(yts.$.data(el, 'name'), yts.$.data(el, 'val'));
            }
        });
        var spanCheck = yts.$.new('span', {'className': 'yt-uix-form-input-radio-element'});
        var spanLabel = yts.$.new('span', {'innerHTML': list[i]});

        spanInput.appendChild(input);
        spanInput.appendChild(spanCheck);

        label.appendChild(spanInput);
        label.appendChild(spanLabel);

        li.appendChild(label);

    }
    return li;
};


yts.init();