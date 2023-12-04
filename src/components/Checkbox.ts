import Component from './Component';
import {Store} from '../data/Store';

export class Checkbox extends Component<HTMLInputElement> {
    private store: Store<boolean>;

    constructor() {
        super(document.createElement('input'));
        this.store = new Store('yts-remember-speed');

        this.setParams({
            type: 'checkbox',
            title: 'Remember speed',
            checked: this.store.get(),
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
