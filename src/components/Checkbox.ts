import Component from './Component';

export class Checkbox extends Component<HTMLInputElement> {

    constructor(checked: boolean) {
        super(document.createElement('input'));

        this.element.checked = checked

        this.setParams({
            type: 'checkbox',
            title: 'Remember speed',
        });

        this.setStyle({
            'accent-color': '#f00',
            width: '20px',
            height: '20px',
            margin: '0',
            padding: '0',
        });
    }

    getValue() {
        return this.element.checked;
    }
}
