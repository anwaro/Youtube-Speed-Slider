import Component from './Component';
import {Dom} from './Dom';

export class SpeedMenuItem extends Component<'div'> {
    public static readonly ID = 'yts-speed-menu-item';
    private wrapper = Dom.element('div', 'ytp-menuitem-content');

    constructor() {
        super('div', {
            classes: 'ytp-menuitem',
            attrs: {
                id: SpeedMenuItem.ID,
            },
        });
    }

    addElement(
        icon: HTMLDivElement,
        label: HTMLDivElement,
        slider: HTMLInputElement,
        checkbox: HTMLInputElement,
    ) {
        this.element.append(icon, label, this.wrapper);
        this.wrapper.append(checkbox, slider);
    }
}
