A simple HTML/Javascript structure that builds an interactible form with a step-by-step setup.


# DISCLAIMER
**This is a work-in-progress project. It is not finished!!**


## Required HTML format
```html
<div id="stepform">
  <form>
    <div class="step">
      <!-- Step 1 -->
    <div class="step">
      <!-- Step 2 -->
    </div>
  </form>
</div>
```

To enable the above HTML to use the step-form, you simply need to add the following to a script after HTML has been rendered.
```javascript
(new StepForm()).build();
```

## Example
```html
<div id="stepform">
  <form method="post" action="newEmployee.php">
    <div class="step">
      <input type="text" name="firstname" placeholder="Firstname">
      <input type="text" name="lastname" placeholder="Lastname">
    </div>
    <div class="step">
      <label for="employee">Employee position</label>
      <select id="employee">
        <option value="1">Doctor</option>
        <option value="2">Nurse</option>
        <option value="3">Janitor</option>
      </select>
    </div>
  </form>
</div>
<script src="./StepForm.js"></script>
<script>
  (new StepForm())
    .setSubmitName("Create Employee")
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
  Instead of setting a specific post directive in the attributes of the Form-element, you can provide a callback function to the `build`-function.
*/
stepForm.build(function(event) {
  event.preventDefault();
  console.log("Thing is posted!")
});
```