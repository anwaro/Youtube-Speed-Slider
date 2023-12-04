import Component from './Component';

export class SpeedMenuItem extends Component<HTMLDivElement> {
    public static readonly ID = 'yts-speed-menu-item';
    private sliderWrapper = document.createElement('div');

    constructor() {
        super(document.createElement('div'));

        this.setParams({id: SpeedMenuItem.ID});
        this.setClasName('ytp-menuitem');

        this.sliderWrapper.className = 'ytp-menuitem-content';
    }

    addElement(
        icon: HTMLDivElement,
        label: HTMLDivElement,
        slider: HTMLInputElement,
        checkbox: HTMLInputElement,
    ) {
        this.element.appendChild(icon);
        this.element.appendChild(label);
        this.sliderWrapper.appendChild(checkbox);
        this.sliderWrapper.appendChild(slider);
        this.element.appendChild(this.sliderWrapper);
    }
}
