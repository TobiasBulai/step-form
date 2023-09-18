const StepForm = class {
  #statusCanvas;
  #numberOfSteps;
  #stepList;
  #submitName = "Submit";

  setSubmitName(submitName)
  {
    this.#submitName = submitName;
    return this;
  }

  /**
   *
   * @param {CallableFunction} callback
   */
  build(callback) {
    if (callback !== undefined) {
      document.querySelector("#stepform form")
        .addEventListener('submit', callback);
    }

    this.#stepList = document.querySelectorAll('#stepform > form > div.step');
    this.#numberOfSteps = this.#stepList.length;
    this.#buildStatusField(document.getElementById('stepform'));

    this.#stepList.forEach((step, index) => {
      this.#buildStepPage(step, index, callback);
    });
  }

  /**
   *
   * @param {HTMLDivElement} step
   */
  #buildStepPage(step, index) {
    let wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'button-wrapper');

    const ctx = this.#statusCanvas.getContext("2d");
    const canvas = this.#statusCanvas;
    const numberOfSteps = this.#numberOfSteps;

    if (index > 0) {
      step.style.display = 'none';

      let button = document.createElement('button');
      button.innerText = 'Back';

      const backEvent = function(event) {
        event.preventDefault();
        let nextStep = document.querySelectorAll('#stepform > form > div.step');
        nextStep[index-1].style.display = 'block';
        step.style.display = 'none';

        var x = (canvas.width / numberOfSteps) / 2 - 35;
        var xStart = x;
        ctx.reset();

        for (let i = 0; i < numberOfSteps; i++) {
          ctx.fillStyle = "darkcyan";

          if (i > 0) {
            x = x + (canvas.width / numberOfSteps);
          }

          ctx.strokeStyle = "darkcyan";
          ctx.beginPath();
          ctx.roundRect(x, 1, 50, 50, [25]);
          ctx.stroke();

          if (i < index) {
            ctx.fill();
            ctx.strokeStyle = "darkcyan";
            ctx.beginPath();
            ctx.moveTo(xStart, 25);
            ctx.lineTo(x, 25);
            ctx.stroke();
          }
        }
      }

      button.addEventListener('click', backEvent);

      wrapper.appendChild(button);
      step.appendChild(wrapper);
    }

    if (index < this.#numberOfSteps - 1) {
      let button = document.createElement('button');
      button.innerText = 'Next';

      const nextEvent = function(event) {
        event.preventDefault();
        let nextStep = document.querySelectorAll('#stepform > form > div.step');
        nextStep[index+1].style.display = 'block';
        step.style.display = 'none';

        var x = (canvas.width / numberOfSteps) / 2 - 35;
        var xStart = x;

        for (let i = 0; i < numberOfSteps; i++) {
          ctx.fillStyle = "darkcyan";

          if (i > 0) {
            x = x + (canvas.width / numberOfSteps);
          }

          ctx.strokeStyle = "darkcyan";
          ctx.beginPath();
          ctx.roundRect(x, 1, 50, 50, [25]);
          ctx.stroke();

          if (index+1 == i) {
            ctx.fill();
            ctx.strokeStyle = "darkcyan";
            ctx.beginPath();
            ctx.moveTo(xStart, 25);
            ctx.lineTo(x, 25);
            ctx.stroke();
          }
        }
      };

      button.addEventListener('click', nextEvent);

      wrapper.appendChild(button);
      step.appendChild(wrapper);
    }

    if (index == this.#numberOfSteps - 1) {
      let submitButton = document.createElement('input');
      submitButton.setAttribute('type', 'submit');
      submitButton.setAttribute('value', this.#submitName);

      wrapper.appendChild(submitButton);
      step.appendChild(wrapper);
    }
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

    stepform.prepend(statusField);

    statusField = document.getElementsByClassName('status-field')[0];
    statusCanvas.setAttribute('height', 52);
    statusCanvas.setAttribute('width', statusField.clientWidth);
    statusField.appendChild(statusCanvas)

    const ctx = this.#statusCanvas.getContext("2d");
    var x = (this.#statusCanvas.width / this.#numberOfSteps) / 2 - 35;
    var xStart = x;

    for (let i = 1; i <= this.#numberOfSteps; i++) {
      ctx.fillStyle = "darkcyan";

      if (i > 1) {
        x = x + (this.#statusCanvas.width / this.#numberOfSteps);
      }

      ctx.strokeStyle = "darkcyan";
      ctx.beginPath();
      ctx.roundRect(x, 1, 50, 50, [25]);
      ctx.stroke();

      if (i == 1) {
        ctx.fill();
      }
    }

    return statusCanvas;
  }
};
