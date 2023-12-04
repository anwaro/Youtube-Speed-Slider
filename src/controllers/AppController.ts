import {Icon} from '../components/Icon';
import {Label} from '../components/Label';
import {Slider} from '../components/Slider';
import {Checkbox} from '../components/Checkbox';
import {Store} from '../data/Store';
import {SpeedMenuItem} from '../components/SpeedMenuItem';
import {Menu} from '../components/Menu';
import {Player} from '../components/Player';
import {Observer} from './Observer';

export class AppController {
    private menu: Menu;
    private readonly speedMenuItem: SpeedMenuItem;
    private player: Player;
    private icon: Icon;
    private label: Label;
    private slider: Slider;
    private checkbox: Checkbox;
    private observer: Observer;

    private rememberSpeed: Store<boolean>;
    private speed: Store<number>;

    constructor() {
        this.rememberSpeed = new Store('yts-remember-speed');
        this.speed = new Store('yts-speed');
        const initialSpeed = this.getSpeed();

        this.menu = new Menu();
        this.player = new Player(initialSpeed);
        this.speedMenuItem = new SpeedMenuItem();
        this.icon = new Icon();
        this.label = new Label(initialSpeed);
        this.slider = new Slider(initialSpeed);
        this.checkbox = new Checkbox();
        this.observer = new Observer();

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

    sliderChangeEvent(_: Event) {
        this.updateSpeed(this.slider.getSpeed());
    }

    checkboxEvent(_: Event) {
        this.rememberSpeed.set(this.checkbox.getValue());
    }

    sliderWheelEvent(event: WheelEvent) {
        const current = this.slider.getSpeed();
        const diff = event.deltaY > 0 ? -0.05 : 0.05;
        const value = Math.max(
            this.slider.min,
            Math.min(current + diff, this.slider.max),
        );

        if (current != value) {
            this.slider.setSpeed(value);
            this.updateSpeed(value);
        }
        event.preventDefault();
    }

    updateSpeed(speed: number) {
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
            this.observer.start(player, this.mutationCallback.bind(this));
        }

        return this.menu.addCustomSpeedItem(this.speedMenuItem);
    }
}
