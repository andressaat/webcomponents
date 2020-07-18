class TimeComponent extends HTMLElement {
  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: 'open' });
    this._time = null;
  }

  get time() {
    return this._time;
  }

  set time(val) {
    this.setAttribute('time', val);
  }

  static get observedAttributes() {
    return ['time'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    switch (name) {
      case 'time':
        this._time = new Date(newVal) || null;
    }
  }

  countSteps(val, step, overflow) {
    return overflow ? ~~(Math.floor(val / step) % overflow) : Math.floor(val / step);
  }

  parseMs(ms) {
    return {
      milliseconds: this.countSteps(ms, 1, 1000),
      seconds: this.countSteps(ms, 1000, 60),
      minutes: this.countSteps(ms, 60000, 60),
      hours: this.countSteps(ms, 3600000, 24),
      days: this.countSteps(ms, 86400000)
    };
  }

  startTime() {
    var innerTime = this.shadow.querySelector('.time-component-inner');

    var timeInterval = setInterval(() => {
      let ms = this.time - new Date().getTime();
      let diff = this.parseMs(ms);
      if (ms > 0) {
        innerTime.innerHTML = `
        ${diff.days} dias e ${diff.hours}:${diff.minutes}:${diff.seconds}:${diff.milliseconds}
      `;
      } else {
        clearInterval(timeInterval);
        innerTime.innerHTML = 'ATRASADO';
      }
    }, 1000);
  }
  connectedCallback() {
    var template = `
        <div class="time-component">
          <div class="time-component-inner"></div>
        </div>
      `;

    this.shadow.innerHTML = template;
    this.startTime();
  }
}

window.customElements.define('time-component', TimeComponent);
