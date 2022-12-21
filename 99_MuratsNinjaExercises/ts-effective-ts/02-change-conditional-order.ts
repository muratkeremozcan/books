function getElement(elOrId: string | HTMLElement | null): HTMLElement {
  if (typeof elOrId === 'object') {
    return elOrId
    // ~~~~~~~~~~~~~~ 'HTMLElement | null' is not assignable to 'HTMLElement'
  } else if (elOrId === null) {
    return document.body
  } else {
    const el = document.getElementById(elOrId)
    return el
    // ~~~~~~~~~~ 'HTMLElement | null' is not assignable to 'HTMLElement'
  }
}

function getElement2(elOrId: string | HTMLElement | null) {
  if (elOrId === null) {
    // handle the null case first
    return document.body
  } else if (typeof elOrId === 'object') {
    return elOrId
  } else {
    const el = document.getElementById(elOrId as string)
    if (el != null) return el // handle the null case here
  }
}
