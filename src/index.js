const YTS_BUILD_TIMEOUT = 500;
const YTS_REMOVE_TIMEOUT = 1000;

const el = {
    menu: null,
    icon: null,
    label: null,
    check: null,
    slider: null,
    player: null,
}


let yts_event_em_speed = false;
let yts_event_player = false;

const yts_r = 'yts_r';
const yts_s = 'yts_s';


/*************************************
 *          INIT                     *
 ************************************/
function ytsInit() {
    $yts.event(document, "spfdone", function () {
        ytsInitPlayer();
    });
    ytsReopenMenu();
    ytsBuildApp();
}

function ytsBuildApp() {

    el.menu = $yts.get('.ytp-panel-menu');
    console.log(el.menu);
    if (el.menu !== null) {
        setTimeout(ytsRemoveDefaultSpeed, YTS_REMOVE_TIMEOUT);
        ytsInitSlider();
        ytsInitMenu();
        ytsInitPlayer();
    } else {
        setTimeout(ytsBuildApp, YTS_BUILD_TIMEOUT);
    }
}


/*************************************
 *          MENU                    *
 ************************************/

function ytsInitMenu() {
    el.icon.innerHTML = '<svg height="24" viewBox="0 0 24 24" width="24"><path d="M10,8v8l6-4L10,8L10,8z M6.3,5L5.7,4.2C7.2,3,9,2.2,11,2l0.1,1C9.3,3.2,7.7,3.9,6.3,5z M5,6.3L4.2,5.7C3,7.2,2.2,9,2,11 l1,.1C3.2,9.3,3.9,7.7,5,6.3z            M5,17.7c-1.1-1.4-1.8-3.1-2-4.8L2,13c0.2,2,1,3.8,2.2,5.4L5,17.7z            M11.1,21c-1.8-0.2-3.4-0.9-4.8-2 l-0.6,.8C7.2,21,9,21.8,11,22L11.1,21z            M22,12c0-5.2-3.9-9.4-9-10l-0.1,1c4.6,.5,8.1,4.3,8.1,9s-3.5,8.5-8.1,9l0.1,1 C18.2,21.5,22,17.2,22,12z" fill="white"></path></svg>'
    const speedMenu = $yts.new('div', {'className': 'ytp-menuitem', id: 'yts-menu'});
    const right = $yts.new('div', {'className': 'ytp-menuitem-content'});
    right.appendChild(el.check);
    right.appendChild(el.slider);
    speedMenu.appendChild(el.icon);
    speedMenu.appendChild(el.label);
    speedMenu.appendChild(right);
    el.menu.appendChild(speedMenu);
}

function ytsRemoveDefaultSpeed() {
    const switchers = $yts.getOpt(".ytp-menuitem", {role: 'menuitemcheckbox'});
    let toRemove = null;

    if (!ytsPlayerHasClass('ad-interrupting') && switchers && switchers.length && !yts_event_em_speed) {
        toRemove = switchers[switchers.length - 1].nextElementSibling;
        if (toRemove && toRemove.id !== 'yts-menu') {
            $yts.style(toRemove, 'display', 'none');
            yts_event_em_speed = true;
        }
    }
}

function ytsReopenMenu() {
    const settings_button = $yts.get(".ytp-settings-button");
    settings_button && settings_button.click();
    settings_button && settings_button.click();
}


/*************************************
 *          SLIDER                   *
 ************************************/

function ytsInitSlider() {
    const rem = ytsParam(yts_r);
    let speed = ytsParam(yts_s) || 1;
    speed = rem ? speed : 1;

    el.icon = $yts.new('div', {'className': 'ytp-menuitem-icon'});
    el.label = $yts.new('div', {'className': 'ytp-menuitem-label'});
    el.check = $yts.new('input', {
        'type': 'checkbox',
        'title': 'Remember speed',
        style: {
            'accent-color': '#f00',
            'width': '20px',
            'height': '20px',
            'margin': '0',
            'padding': '0'
        }
    });
    el.slider = $yts.new('input', {
        'type': 'range',
        'min': 0.5,
        'max': 4,
        'step': 0.1,
        'value': speed,
        style: {
            'accent-color': '#f00',
            'width': 'calc(100% - 30px)',
            'margin': '0 5px',
            'padding': '0'
        }
    });
    if (rem) {
        el.check.checked = true;
    }
    $yts.event(el.slider, 'change', ytsChangeSlider);
    $yts.event(el.check, 'change', ytsChangeRemember);
    $yts.event(el.slider, 'input', ytsChangeSlider);
    $yts.event(el.slider, 'wheel', ytsWheelSlider);

    ytsUpdateSliderLabel(speed);
}


function ytsWheelSlider(event) {
    let val = parseFloat(event.target.value) + (event.wheelDelta > 0 ? 0.1 : -0.1);
    val = val < 0.5 ? 0.5 : (val > 4 ? 4 : val);
    if (event.target.value !== val) {
        event.target.value = val;
        ytsUpdateSliderLabel(val);
    }
    event.preventDefault();
}

function ytsChangeSlider(event) {
    ytsUpdateSliderLabel(event.target.value);
}

function ytsChangeRemember() {
    ytsParam(yts_r, ytsParam(yts_r) ? 0 : 1);
}


function ytsUpdateSliderLabel(val) {
    ytsSetPlayerDuration(val);
    el.label.innerHTML = 'Speed: ' + parseFloat(val).toFixed(1);
}


/*************************************
 *          PLAYER                   *
 ************************************/

function ytsInitPlayer() {
    el.player = $yts.get('.html5-main-video');
    ytsObservePlayer();
    if (ytsParam(yts_s) && ytsParam(yts_r)) {
        ytsSetPlayerDuration(ytsParam(yts_s));
        ytsUpdateSliderLabel(ytsParam(yts_s));
    }

}

function ytsPlayerHasClass(cls) {
    ytsInitPlayer();
    return el.player && el.player.classList.contains(cls)
}

function ytsSetPlayerDuration(value) {
    ytsParam(yts_s, value);
    if (el.player) {
        el.player.playbackRate = value;
    }
}

function ytsObservePlayer() {
    if (!yts_event_player) {
        ytsObserver(el.player.parentNode.parentNode, function (mutation) {
            if (/html5-video-player/.test(mutation.target.className) && !yts_event_em_speed) {
                ytsRemoveDefaultSpeed();
            }
        });
        yts_event_player = true;
    }
}


/************************************
 *                DOM                *
 ************************************/
$yts = {
    'event': function (obj, event, callback) {
        obj.addEventListener(event, callback);
    },
    'new': function (tag, option) {
        const element = document.createElement(tag);
        for (let param in option) {
            if (param === 'data' || param === 'style' || param === 'attr') {
                for (let data in option[param]) {
                    $yts[param](element, data, option[param][data]);
                }
            } else {
                element[param] = option[param];
            }
        }
        return element;
    },
    'get': function (tselector, all) {
        all = all || false;
        const type = tselector.substring(0, 1);
        const selector = tselector.substring(1);
        let elements;
        if (type === "#") {
            return document.getElementById(selector);
        } else if (type === ".") {
            elements = document.getElementsByClassName(selector);
        } else {
            elements = document.querySelectorAll(tselector);
        }

        if (all) {
            return elements;
        } else {
            return elements.length ? elements[0] : null;
        }
    },
    'data': function (elem, key, val) {
        key = key.replace(/-(\w)/gi, function (x) {
            return x.charAt(1).toUpperCase()
        });
        if (typeof val !== 'undefined') {
            elem.dataset[key] = val;
        }
        return elem.dataset[key];

    },
    'style': function (elem, key, val, priority) {
        priority = priority || '';
        if (typeof val !== 'undefined') {
            elem.style.setProperty(key, val, priority);
        }
        return elem.style.getPropertyValue(key);

    },
    'attr': function (elem, key, val) {
        if (typeof val !== 'undefined') {
            elem.setAttribute(key, val);
        }
        return elem.getAttribute(key);

    },
    'getOpt': function (selector, option) {
        const el = $yts.get(selector, true);
        const pass = [];
        let correct;
        for (let i = 0; i < el.length; i++) {
            correct = true;
            for (let prop in option) {
                if (!$yts.has(el[i], prop, option[prop])) {
                    correct = false;
                    break;
                }
            }
            if (correct) {
                pass.push(el[i]);
            }
        }
        return pass;
    },
    'has': function (elem, key, val) {
        if (elem.hasAttribute(key)) {
            const attr = elem.getAttribute(key);
            if (val !== null) {
                return attr === val;
            }
            return true;
        }
        return false;
    }
};

/*************************************
 *          OBSERVER                 *
 ************************************/
function ytsObserver(element, callback) {
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    if (MutationObserver) {
        const obs = new MutationObserver(function (mutations) {
            callback(mutations[0]);
        });

        obs.observe(element, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true,
            attributeOldValue: true,
            characterDataOldValue: true
        });
    }
}

function ytsParam(key, val) {
    if (typeof val !== 'undefined') {
        localStorage.setItem(key, val);
    }
    return parseFloat(localStorage.getItem(key));
}


ytsInit();
