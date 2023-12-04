import Component from './Component';

export class Label extends Component<HTMLDivElement> {
    private label: string;
    private speed: string = '1.0';

    constructor(speed: number, label = 'Speed') {
        super(document.createElement('div'));
        this.label = label;

        this.setClasName('ytp-menuitem-label');
        this.updateSpeed(speed);
    }

    updateLabel(label = 'Speed') {
        this.label = label;
        this.updateText();
    }

    updateSpeed(speed: number) {
        this.speed = speed.toFixed(1);
        this.updateText();
    }

    updateText() {
        this.element.innerHTML = `${this.label}: ${this.speed}`;
    }
}
