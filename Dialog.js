/**
 * Dialog module.
 * @module dialog.js
 * @version 1.0.0
 * @summary 06-06-2022
 * @author Jim Loo
 * @description Custom versions of `alert`, `confirm` and `prompt`, using `<dialog>`
 */
export default class Dialog {
    constructor(settings = {}) {
        this.setting = Object.assign({
            // DEFAULT SETTTING
        }, settings);

        this.init();
        this.getElements();
        this.setAria();
        this.bindEvents();
    }

    // 初始化弹窗
    init() {
        this.dialogSupported = typeof HTMLDialogElement === 'function';
        this.dialog = document.createElement('dialog');
        this.dialog.dataset.component = this.dialogSupported ? 'dialog' : 'no-dialog';
        this.dialog.role = 'dialog';

        this.dialog.innerHTML = `
        <form method="dialog" data-ref="form">
            <fieldset data-ref="fieldset" role="document">
                <legend data-ref="message" id="${(Math.round(Date.now())).toString(36)}">
                </legend>
                <div data-ref="template"></div>
            </fieldset>
            <menu>
                <button data-ref="cancel" value="cancel"></button>
                <button data-ref="accept" value="default"></button>
            </menu>
            <audio data-ref="soundAccept"></audio>
            <audio data-ref="soundOpen"></audio>
        </form>`;

        document.body.appendChild(this.dialog);
    }

    getElements() {
        this.elements = {};
        this.dialog.querySelectorAll('[data-ref]').forEach(el => this.elements[el.dataset.ref] = el);
    }

    setAria() {
        this.dialog.setAttribute('aria-labelledby', this.elements.message.id);
    }

    bindEvents() {
        this.elements.cancel.addEventListener('click', () => {
            this.dialog.dispatchEvent(new Event('cancel'));
        });

        this.elements.accept.addEventListener('click', () => {
            this.dialog.dispatchEvent(new Event('accept'));
        });
    }

    getFocusable() {
        const focusEleName = 'button,[href],select,textarea';
        return [
            ...this.dialog.querySelectorAll(focusEleName)
        ]
    }

    toggle(open = false) {
        if (this.dialogSupported && open) this.dialog.showModal();
    }

    // 打开弹窗
    open(settings = {}) {
        const dialog = Object.assign({}, this.settings, settings);
        this.dialog.className = dialog.dialogClass || '';

        this.elements.accept.innerText = dialog.accept;
        this.elements.cancel.innerText = dialog.cancel;
        this.elements.cancel.hidden = dialog.cancel === '';
        this.elements.message.innerText = dialog.message;

        this.elements.soundAccept.src = dialog.soundAccept || '';
        this.elements.soundOpen.src = dialog.soundOpen || '';

        this.elements.target = dialog.target || '';

        this.elements.template.innerHTML = dialog.template || '';

        this.focusable = this.getFocusable();
        this.hasFormData = this.elements.fieldset.elements.length > 0;

        if (dialog.soundOpen) {
            this.elements.soundOpen.play();
        }

        this.toggle(true);

        if (this.hasFormData) {
            this.focusable[0].focus();
            this.focusable[0].select();
        } else {
            this.elements.accept.focus();
        }
    }
}