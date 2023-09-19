const StepForm = class {
  #statusCanvas;
  #numberOfSteps = 0;
  #stepList = [];
  #submitName = "Submit";
  #url = null;
  #formMethod = null;
  #isGraphicalStepCounterEnabled = false;

  #cubeY = 15;
  #cubeWidth = 25;
  #cubeHeight = 25;
  #cubeRadius = [15];

  setSubmitName(submitName) {
    this.#submitName = submitName;
    return this;
  }

  setFormMethod(method, url) {
    this.#url = url;
    this.#formMethod = method;
    return this;
  }

  enableGraphicalStepCounter() {
    this.#isGraphicalStepCounterEnabled = true;
    return this;
  }

  /**
   *
   * @param {number} y position
   * @param {number} width
   * @param {number} height
   * @param {Array<number>} radius
   */
  setStepCounterSize(
    y,
    width,
    height,
    radius
  ) {
    this.#cubeY = y;
    this.#cubeWidth = width;
    this.#cubeHeight = height;

    if (Array.isArray(radius)) {
      this.#cubeRadius = radius;
    }

    return this;
  }

  /**
   *
   * @param {CallableFunction} callback
   */
  build(callback, onEvent) {
    this.#buildForm();

    if (callback !== undefined) {
      onEvent = (onEvent !== undefined) ? onEvent : 'submit';
      document.querySelector("#stepform form")
        .addEventListener(onEvent, callback);
    }

    this.#stepList = document.querySelectorAll('#stepform > form > div.step');
    this.#numberOfSteps = this.#stepList.length;

    if (this.#isGraphicalStepCounterEnabled === true) {
      this.#buildStatusField(document.getElementById('stepform'));
    }

    this.#stepList.forEach((step, index) => {
      this.#buildStepPage(step, index);
    });
  }

  #buildForm() {
    let form = document.createElement('form');

    if (
      this.#url !== undefined
      && this.#url != null
      && this.#formMethod !== undefined
      && this.#formMethod != null
    ) {
      form.setAttribute('method', this.#formMethod);
      form.setAttribute('action', this.#url);
    }

    document.querySelectorAll('#stepform div.step').forEach((step) => {
      form.appendChild(step)
    });
    document.getElementById('stepform').prepend(form);
  }

  /**
   *
   * @param {HTMLDivElement} step
   */
  #buildStepPage(step, index) {
    let wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'button-wrapper');

    const ctx = (this.#isGraphicalStepCounterEnabled) ? this.#statusCanvas.getContext("2d") : null;
    const canvas = (this.#isGraphicalStepCounterEnabled) ? this.#statusCanvas : null;
    const numberOfSteps = (this.#isGraphicalStepCounterEnabled) ? this.#numberOfSteps : null;
    const isGraphicalStepCounterEnabled = this.#isGraphicalStepCounterEnabled;

    const cubeY = this.#cubeY;
    const cubeWidth = this.#cubeWidth;
    const cubeHeight = this.#cubeHeight;
    const cubeRadius = this.#cubeRadius;

    if (index > 0) {
      step.style.display = 'none';

      let button = document.createElement('button');
      button.innerText = 'Back';

      const backEvent = function(event) {
        event.preventDefault();
        let nextStep = document.querySelectorAll('#stepform > form > div.step');
        nextStep[index-1].style.display = 'block';
        step.style.display = 'none';

        if (isGraphicalStepCounterEnabled === true) {
          //FIXME: This is really not optimal
          var x = (canvas.width / numberOfSteps) / 2 - cubeWidth / 3; //FIXME: this too
          var xStart = x;
          ctx.reset();

          for (let i = 0; i < numberOfSteps; i++) {
            ctx.fillStyle = "darkcyan";

            if (i > 0) {
              x = x + (canvas.width / numberOfSteps);
            }

            ctx.strokeStyle = "darkcyan";
            ctx.beginPath();
            ctx.roundRect(x, cubeY, cubeWidth, cubeHeight, cubeRadius);
            ctx.stroke();

            if (i < index) {
              ctx.fill();
              ctx.strokeStyle = "darkcyan";
              ctx.beginPath();
              ctx.moveTo(xStart, cubeHeight/2+cubeY);
              ctx.lineTo(x, cubeHeight/2+cubeY);
              ctx.stroke();
            }
          }
        }
      }

      button.addEventListener('click', backEvent);
      wrapper.appendChild(button);
    }

    if (index < this.#numberOfSteps - 1) {
      let button = document.createElement('button');
      button.innerText = 'Next';

      const nextEvent = function(event) {
        event.preventDefault();
        let nextStep = document.querySelectorAll('#stepform > form > div.step');
        nextStep[index+1].style.display = 'block';
        step.style.display = 'none';

        if (isGraphicalStepCounterEnabled === true) {
          //FIXME: This is really not optimal
          var x = (canvas.width / numberOfSteps) / 2 - cubeWidth / 3; //FIXME: this too
          var xStart = x;

          for (let i = 0; i < numberOfSteps; i++) {
            ctx.fillStyle = "darkcyan";

            if (i > 0) {
              x = x + (canvas.width / numberOfSteps);
            }

            ctx.strokeStyle = "darkcyan";
            ctx.beginPath();
            ctx.roundRect(x, cubeY, cubeWidth, cubeHeight, cubeRadius);
            ctx.stroke();

            if (index+1 == i) {
              ctx.fill();
              ctx.strokeStyle = "darkcyan";
              ctx.beginPath();
              ctx.moveTo(xStart, cubeHeight/2+cubeY);
              ctx.lineTo(x, cubeHeight/2+cubeY);
              ctx.stroke();
            }
          }
        }
      };

      button.addEventListener('click', nextEvent);
      wrapper.appendChild(button);
    }

    if (index == this.#numberOfSteps - 1) {
      let submitButton = document.createElement('input');
      submitButton.setAttribute('type', 'submit');
      submitButton.setAttribute('value', this.#submitName);

      wrapper.appendChild(submitButton);
      step.appendChild(wrapper);
    }

    const lastStepInBlock = step.querySelectorAll('div.step-content');
    lastStepInBlock[lastStepInBlock.length-1].appendChild(wrapper);
  }

  /**
   *
   * @param {HTMLDivElement} stepform
   * @returns {HTMLCanvasElement}
   */
  #buildStatusField(stepform) {
    let statusField = document.createElement('div');
    let statusCanvas = document.createElement('canvas');

    this.#statusCanvas = statusCanvas;

    statusField.setAttribute('class', 'status-field');

    stepform.appendChild(statusField);

    statusField = document.getElementsByClassName('status-field')[0];
    statusCanvas.setAttribute('height', 52);
    statusCanvas.setAttribute('width', statusField.clientWidth);
    statusField.appendChild(statusCanvas)

    const ctx = this.#statusCanvas.getContext("2d");
    var x = (this.#statusCanvas.width / this.#numberOfSteps) / 2 - this.#cubeWidth / 3; //FIXME: this too

    for (let i = 1; i <= this.#numberOfSteps; i++) {
      ctx.fillStyle = "darkcyan";

      if (i > 1) {
        x = x + (this.#statusCanvas.width / this.#numberOfSteps);
      }

      ctx.strokeStyle = "darkcyan";
      ctx.beginPath();
      ctx.roundRect(x, this.#cubeY, this.#cubeWidth, this.#cubeHeight, this.#cubeRadius);

      ctx.stroke();

      if (i == 1) {
        ctx.fill();
      }
    }

    return statusCanvas;
  }
};
