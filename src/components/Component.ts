export default class Component<E extends HTMLElement> {
    protected element: E;

    constructor(element: E) {
        this.element = element;
    }

    setStyle(styles: Record<string, string | number>) {
        Object.entries(styles).forEach(([key, value]) => {
            this.element.style.setProperty(key, `${value}`);
        });
    }

    setParams(params: Record<string, string | number | boolean | undefined>) {
        Object.entries(params).forEach(([key, value]) => {
            let _value = `${value}`

            if (value === undefined || value === false) {
                _value = ''
            }

            this.element.setAttribute(key, _value);
        });
    }

    setClasName(clasName: string) {
        this.element.className = clasName;
    }

    event<K extends keyof HTMLElementEventMap>(
        event: K,
        callback: (this: HTMLElement, ev: HTMLElementEventMap[K]) => void,
    ) {
        this.element.addEventListener(event, callback);
    }

    getElement() {
        return this.element;
    }
}
