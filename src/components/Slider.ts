import Component from './Component';

export class Slider extends Component<'input'> {
    static MIN_VALUE = 0.5;
    static MAX_VALUE = 4;

    constructor(speed: number) {
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

    setSpeed(speed: number) {
        this.element.value = speed.toString();
    }

    getSpeed(): number {
        return parseFloat(this.element.value);
    }
}
