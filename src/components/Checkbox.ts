import Component from './Component';

export class Checkbox extends Component<HTMLInputElement> {

    constructor(checked: boolean) {
        super(document.createElement('input'));

        console.log({
            type: 'checkbox',
            title: 'Remember speed',
            checked: checked,
        })

        this.setParams({
            type: 'checkbox',
            title: 'Remember speed',
            checked: checked,
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
