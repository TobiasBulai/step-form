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

    if (index > 0) {
      step.style.display = 'none';

      let nextButton = document.createElement('button');
      nextButton.innerText = 'Back';

      nextButton.addEventListener('click', function(event) {
        event.preventDefault();
        let nextStep = document.querySelectorAll('#stepform > form > div.step');
        nextStep[index-1].style.display = 'block';
        step.style.display = 'none';
      });

      wrapper.appendChild(nextButton);
      step.appendChild(wrapper);
    }

    if (index < this.#numberOfSteps - 1) {
      let nextButton = document.createElement('button');
      nextButton.innerText = 'Next';

      nextButton.addEventListener('click', function(event) {
        event.preventDefault();
        let nextStep = document.querySelectorAll('#stepform > form > div.step');
        nextStep[index+1].style.display = 'block';
        step.style.display = 'none';
      });

      wrapper.appendChild(nextButton);
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

    statusField.append(statusCanvas);
    stepform.prepend(statusField);

    const ctx = this.#statusCanvas.getContext("2d");
    for (let i = 1; i <= this.#numberOfSteps; i++) {

      ctx.fillStyle = "darkcyan";

      // console.log(this.#statusCanvas.width / this.#numberOfSteps)
      let x = (i == 1)
        ? 25
        : i * (this.#statusCanvas.width / this.#numberOfSteps);

      // console.log(x)

      ctx.fillRect(x, 25, 100, 100);
    }

    return statusCanvas;
  }

  #renderProgress(progress)
  {
    const ctx = this.#statusCanvas.getContext("2d");
    ctx.fillStyle = "darkcyan";
    ctx.fillRect(25, 25, 100, 100);
  }
};