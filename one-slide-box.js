import {OneClass, html} from '@alexmtur/one-class'

export class OneSlideBox extends OneClass {
    static get properties() {return {
        // width: {type: String,value: "100%"},
        // height: {type: String,value: "auto"},
        // aspectRatio: {type: String,value: ""},
        transitionDuration: Number,
        endlessTransition: Boolean,
        //bullets: Boolean,
        //bulletArray: Array,
        //arrows:  Number,
        selectedIndex: Number,
        bulletNumber: Number, //use it to read the bullet number

    }}
    constructor() {
        super(); 
        this.endlessTransition = false;
        //this.bullets = false;
        //this.arrows = false;
        this.selectedIndex = 0;
        this.bulletNumber = 0;
        this.bulletArray = [''];
    }
    _propertiesChanged(props, changedProps, prevProps) {
        super._propertiesChanged(props, changedProps, prevProps);
        if(changedProps['selectedIndex'] >= 0) {
            let selectedIndex = changedProps['selectedIndex'];
            let oldSelectedIndex = prevProps['selectedIndex'];
            this.bulletNumber = this.id('content').children[0].assignedNodes().length;
            if(!this.endlessTransition) {
                this.id('nextButton').disabled = (selectedIndex === this.bulletNumber - 1);
                this.id('previousButton').disabled = (selectedIndex === 0);        
            }
            this.id('content').children[0].assignedNodes()[selectedIndex].setAttribute('selected', '');
            this.id('bullets').children[selectedIndex].setAttribute('selected', '');
            if(oldSelectedIndex === undefined) return;
            this.id('content').children[0].assignedNodes()[oldSelectedIndex].removeAttribute('selected');
            this.id('bullets').children[oldSelectedIndex].removeAttribute('selected');
        }
    }
    _firstRendered() {
        super._firstRendered();
        this.bulletArray = Array(this.id('content').children[0].assignedNodes().length).fill('');
        if(this.transitionDuration)
            setInterval(_ => this.next(), this.transitionDuration);
    }
    next() {
        this.bulletNumber = this.id('content').children[0].assignedNodes().length;
        if (this.selectedIndex < this.bulletNumber - 1) {
            this.selectedIndex += 1;
        } else if(this.endlessTransition) {
            this.selectedIndex = 0;
        }
    }
    previous() {
        this.bulletNumber = this.id('content').children[0].assignedNodes().length;
        if (this.selectedIndex) {
            this.selectedIndex -= 1;
        } else if(this.endlessTransition) {
            this.selectedIndex = this.bulletNumber - 1;
        }
    }
    isSelected(index) {
        return index == this.selectedIndex;
    }
    selectBullet(e) {
        this.selectedIndex = Number(e.target.value);
    }
    _render() {return html`
        <style>
        :host {
            display: block;
            position: relative;
            overflow: hidden;
            background: none;
            min-width: 50px;
            min-height: 50px;
        }
        :host(:not([arrows])) #previousButton, :host(:not([arrows])) #nextButton {
           display: none !important;
        }
        :host(:not([bullets])) #bullets {
           display: none !important;
        }
        #content > ::slotted(*) {
            position: absolute;
            opacity: 0;
            transition: opacity 1s;
        }
        #content > ::slotted([selected]) {
             opacity: 1;
             position: relative;
        }
        #content > ::slotted(:not([selected])) {
        }
        button {
            position: absolute;
            top: calc(50% - 20px);
            padding: 0;
            line-height: 40px;
            border: none;
            background: none;
            color: #DDD;
            font-size: 40px;
            font-weight: bold;
            opacity: 0.7;
            z-index: 200;
        }
        button:hover, button:focus {
            opacity: 1;
        }
        #previousButton {
            left: 12px;
        }
        #nextButton {
            right: 12px;
        }
        button[disabled] {
            opacity: 0.4;
        }
        #bullets {
            position: absolute;
            bottom: 0px;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .bullet {
            opacity: 0.3;
            cursor: pointer;
            font-size: 25px;
            padding: 5px;
            z-index: 100;
        }
        .bullet:hover {
            opacity: 0.8;
        }
        .bullet[selected] {
            opacity: 1.0;
        }
        </style>
        <div id="content">
            <slot style="display: flex; justify-content: center;"></slot>
        </div>
        <button id="previousButton" on-click=${(e)=>{this.previous()}}>&#x276E;</button>
        <button id="nextButton" on-click=${(e)=>{this.next()}}>&#x276F;</button>
        <div id="bullets">
            ${this.bulletArray.map((item, index) => html`
                <div on-click=${(e)=>{this.selectBullet(e)}} class="bullet" selected=${this.isSelected(index)} value=${index}>
                &#9679;</div>`)}
        </div>`;
    }
}
customElements.define('one-slide-box', OneSlideBox);
