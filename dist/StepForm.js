const FORM_STEP_NEXT = 1;
const FORM_STEP_BACK = 2;

const Cube = class
{
  width;
  height;
  radius;
  yPos;

  /**
   *
   * @param {number} width
   * @param {number} height
   * @param {Array<number>} radius
   * @param {number} yPos
   */
  constructor(width, height, radius, yPos) {
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.yPos = yPos;
  }
}

const DrawEventHandler = class
{
    #ctx;
    #canvas;
    #numSteps;

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {HTMLCanvasElement} canvas
   * @param {number} numSteps
   */
  constructor(
    ctx,
    canvas,
    numSteps
  ) {
    this.#ctx = ctx;
    this.#canvas = canvas;
    this.#numSteps = numSteps;
  }

  /**
   *
   * @param {Cube} cube
   */
  drawInit(cube)
  {
    let x = 0;
    let spacing = this.#calculateSpacing(cube);

    for (let i = 1; i <= this.#numSteps; i++) {
      this.#ctx.fillStyle = "darkcyan";

      x += spacing;

      if (i > 1) {
        x += cube.width;
      }

      this.#ctx.strokeStyle = "darkcyan";
      this.#ctx.beginPath();
      this.#ctx.roundRect(x, cube.yPos, cube.width, cube.height, cube.radius);
      this.#ctx.stroke();

      if (i == 1) {
        this.#ctx.fill();
      }
    }
  }

  /**
   *
   * @param {Cube} cube
   * @returns {number} spacing
   */
  #calculateSpacing(cube)
  {
    let totalWidthOfCubes = cube.width * (this.#numSteps);
    let spaceLeft = this.#canvas.width - totalWidthOfCubes;
    return (spaceLeft / (this.#numSteps + 1));
  }

  /**
   *
   * @param {number} buttonActionId
   * @param {number} index
   * @param {Cube} cube
   */
  drawStep(
    buttonActionId,
    index,
    cube
  ) {
    let x = 0;
    let spacing = this.#calculateSpacing(cube);

    if (buttonActionId == FORM_STEP_BACK) {
      this.#ctx.reset();
    }

    for (let cursor = 0; cursor < this.#numSteps; cursor++) {
      this.#ctx.fillStyle = "darkcyan";

      x += spacing;

      if (cursor > 0) {
        x += cube.width;
      }

      this.#ctx.strokeStyle = "darkcyan";
      this.#ctx.beginPath();
      this.#ctx.roundRect(x, cube.yPos, cube.width, cube.height, cube.radius);
      this.#ctx.stroke();

      if (buttonActionId == FORM_STEP_NEXT) {
        if (index + 1 == cursor) {
          this.#ctx.fill();
          this.#ctx.strokeStyle = "darkcyan";
          this.#ctx.beginPath();
          this.#ctx.moveTo(spacing, cube.height / 2 + cube.yPos);
          this.#ctx.lineTo(x, cube.height / 2 + cube.yPos);
          this.#ctx.stroke();
        }
      }

      if (buttonActionId == FORM_STEP_BACK) {
        if (cursor < index) {
          this.#ctx.fill();
          this.#ctx.strokeStyle = "darkcyan";
          this.#ctx.beginPath();
          this.#ctx.moveTo(spacing, cube.height / 2 + cube.yPos);
          this.#ctx.lineTo(x, cube.height / 2 + cube.yPos);
          this.#ctx.stroke();
        }
      }
    }
  }
};


const StepForm = class {
  #canvas;
  #numSteps;
  #stepList;
  #submitName;
  #url;
  #formMethod;
  #isGraphicalStepCounterEnabled;
  #formWidth;
  #formHeight;
  #cube;

  constructor() {
    this.#cube = new Cube(25, 25, [13], 13)
    this.#numSteps = 0;
    this.#stepList = [];
    this.#submitName = "Submit";
    this.#url = null;
    this.#formMethod = null;
    this.#isGraphicalStepCounterEnabled = false;
    this.#formWidth = 'auto';
    this.#formHeight = 'auto';
  }

  /**
   *
   * @param {number} width
   */
  setWidth(width)
  {
    this.#formWidth = (width == null) ? this.#formWidth : width;
    return this;
  }

  /**
   *
   * @param {string} submitName
   */
  setSubmitName(submitName) {
    this.#submitName = submitName;
    return this;
  }

  /**
   *
   * @param {string} method
   * @param {string} url
   */
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
   * @param {number} width
   * @param {number} height
   * @param {Array<number>} radius
   */
  setStepCounterSize(
    width,
    height,
    radius
  ) {
    if (!Array.isArray(radius)) {
      radius = null;
    } else {
      radius.forEach((radii, index) => {
        if (!Number.isSafeInteger(radii)) {
          throw new Error(`Radius #${index} (${radii}) is not a number or float`);
        }
      });
    }

    [width, height].forEach((number, index) => {
      if (!Number.isInteger(number)) {
        throw new Error(`Parameter #${index} (${number}) is not a number`);
      }
    })

    this.#cube = new Cube(width, height, radius, Math.ceil(height/2));

    return this;
  }

  /**
   *
   * @param {CallableFunction} callback
   */
  build(callback, onEvent) {
    this.#configureFormWrapper();
    this.#buildForm();

    if (callback !== undefined) {
      onEvent = (onEvent !== undefined) ? onEvent : 'submit';
      document.querySelector("#stepform form")
        .addEventListener(onEvent, callback);
    }

    this.#stepList = document.querySelectorAll('#stepform > form > div.step');
    this.#numSteps = this.#stepList.length;

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

    document.querySelectorAll('#stepform div.step:not(.header, .content)').forEach((step) => {
      form.appendChild(step)
    });
    document.getElementById('stepform').prepend(form);
  }

  #configureFormWrapper()
  {
    const stepForm = document.getElementById('stepform');
    stepForm.style.width = this.#formWidth;
    stepForm.style.height = this.#formHeight;
  }

  /**
   *
   * @param {HTMLDivElement} step
   */
  #buildStepPage(step, index) {
    let wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'button-wrapper');

    const ctx = (this.#isGraphicalStepCounterEnabled) ? this.#canvas.getContext("2d") : null;
    const canvas = (this.#isGraphicalStepCounterEnabled) ? this.#canvas : null;
    const numSteps = (this.#isGraphicalStepCounterEnabled) ? this.#numSteps : null;
    const isGraphicalStepCounterEnabled = this.#isGraphicalStepCounterEnabled;
    const cube = this.#cube;

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
          (new DrawEventHandler(ctx, canvas, numSteps))
            .drawStep(FORM_STEP_BACK, index, cube);
        }
      }

      button.addEventListener('click', backEvent);
      wrapper.appendChild(button);
    }

    if (index < this.#numSteps - 1) {
      let button = document.createElement('button');
      button.innerText = 'Next';

      const nextEvent = function(event) {
        event.preventDefault();
        let nextStep = document.querySelectorAll('#stepform > form > div.step');
        nextStep[index+1].style.display = 'block';
        step.style.display = 'none';

        if (isGraphicalStepCounterEnabled === true) {
          (new DrawEventHandler(ctx, canvas, numSteps))
            .drawStep(FORM_STEP_NEXT, index, cube);
        }
      };

      button.addEventListener('click', nextEvent);
      wrapper.appendChild(button);
    }

    if (index == this.#numSteps - 1) {
      let submitButton = document.createElement('input');
      submitButton.setAttribute('type', 'submit');
      submitButton.setAttribute('value', this.#submitName);

      wrapper.appendChild(submitButton);
      step.appendChild(wrapper);
    }

    const lastStepInBlock = step.querySelectorAll('div.step.content');
    lastStepInBlock[lastStepInBlock.length-1].appendChild(wrapper);
  }

  /**
   *
   * @param {HTMLDivElement} stepform
   * @returns {HTMLCanvasElement}
   */
  #buildStatusField(stepform) {
    let statusField = document.createElement('div');
    let canvas = document.createElement('canvas');

    statusField.setAttribute('class', 'status-field');

    stepform.appendChild(statusField);

    statusField = document.getElementsByClassName('status-field')[0];
    canvas.setAttribute('height', 52);
    canvas.setAttribute('width', statusField.clientWidth);
    statusField.appendChild(canvas);

    this.#canvas = canvas;

    (new DrawEventHandler(this.#canvas.getContext("2d"), this.#canvas, this.#numSteps))
      .drawInit(this.#cube);
  }
};
