import Component from './Component';

export class Slider extends Component<HTMLInputElement> {
    public min = 0.5;
    public max = 4;

    constructor(speed: number) {
        super(document.createElement('input'));

        this.setParams({
            type: 'range',
            min: this.min,
            max: this.max,
            step: 0.05,
            value: speed.toString(),
        });

        this.setStyle({
            'accent-color': '#f00',
            width: 'calc(100% - 30px)',
            margin: '0 5px',
            padding: '0',
        });
    }

    setSpeed(speed: number) {
        this.element.value = speed.toString();
    }

    getSpeed(): number {
        return parseFloat(this.element.value);
    }
}
