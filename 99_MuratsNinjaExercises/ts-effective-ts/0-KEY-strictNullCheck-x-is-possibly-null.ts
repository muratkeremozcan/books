// Use strictNullChecks to prevent “undefined is not an object”-style runtime errors.
// tsConfig: {"noImplicitAny":true,"strictNullChecks":true}

const el = document.getElementById('status')
el.textContent = 'Ready'
// ~~ Object is possibly 'null'

// KEY: to fix this, we need to conditionally access the property
if (el) {
  el.textContent = 'Ready' // OK, null has been excluded
}
el!.textContent = 'Ready' // OK, we've asserted that el is non-null
