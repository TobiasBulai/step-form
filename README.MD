A simple HTML/Javascript structure that builds an interactible form with a step-by-step setup.


# DISCLAIMER
**This is a work-in-progress project. It is not finished!!**


## Required HTML format
The header is not a **required** field, _**but**_ the `step-content` one is!

```html
<div id="stepform">
  <div class="step">
    <div class="step-header">
        <!-- Some header -->
      </div>
      <div class="step-content">
        <!-- Some content -->
      </div>
    </div>
  <div class="step">
    <div class="step-content">
        <!-- Some content -->
      </div>
  </div>
</div>
```

To enable the above HTML to use the step-form, you simply need to add the following to a script after HTML has been rendered.
```javascript
(new StepForm()).build();
```

## Example
```html
<div id="stepform">
  <div class="step">
    <div class="step-header">
      <p>Name of employee</p>
    </div>
    <div class="step-content">
      <input type="text" name="firstname" placeholder="Firstname">
      <input type="text" name="lastname" placeholder="Lastname">
    </div>
  </div>
  <div class="step">
    <div class="step-header">
      <p>Position of employee</p>
    </div>
    <div class="step-content">
      <label for="employee">Employee position</label>
      <select id="employee">
        <option value="1">Doctor</option>
        <option value="2">Nurse</option>
        <option value="3">Janitor</option>
      </select>
    </div>
  </div>
</div>
<script src="./StepForm.js"></script>
<script>
  (new StepForm())
    .setSubmitName('Create Employee')
    .setFormMethod('post', 'newEmployee.php')
    .build();
</script>
```

## Script use-cases
```javascript
let stepForm = new StepForm();

/*
  Define another submit-button name
*/
stepForm.setSubmitName("Create Employee")

/*
  Instead of setting a specific post directive in
  the attributes of the Form-element, you can provide a
  callback function to the `build`-function.
*/
stepForm.build(function(event) {
  event.preventDefault();
  console.log("Thing is posted!")
});

/*
  You can still use the function `setFormMethod` as a final destination,
  and perform pre-actions, like validations, with the callback function.
*/
stepForm
  .setFormMethod('post', 'newEmployee.php')
  .build(function(event) {
    event.preventDefault();
    // Do some cool pre-actions
  });

/*
  To enable the graphical step-counter, use the following
*/
stepForm.enableGraphicalStepCounter();

/*
  To tweak the graphical step-counter size (WARNING, this could break things), use the following
*/
stepForm.setStepCounterSize(
  y: number,
  width: number,
  height: number,
  [radius]: array
);

```