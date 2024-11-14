import Component from './Component';

export class Checkbox extends Component<'input'> {
    constructor(checked: boolean) {
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
