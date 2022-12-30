// The DOM has a type hierarchy that you can usually ignore while writing JavaScript.
/// But these types become more important in TypeScript. Understanding them will help you write TypeScript for the browser.
// Know the differences between Node, Element, HTMLElement, and EventTarget, as well as those between Event and MouseEvent.
// Either use a specific enough type for DOM elements and Events in your code or give TypeScript the context to infer it.

/*
Table 7-1. Types in the DOM Hierarchy 
Type              	Examples 
EventTarget 				window, XMLHttpRequest 
Node 								document, Text, Comment 
Element 						includes HTMLElements, SVGElements 
HTMLElement 				<i>, <b> 
HTMLButtonElement 	<button>

Plain Event is the most generic type of event. More specific types include: 
UIEvent 				Any sort of user interface event 
MouseEvent 			An event triggered by the mouse such as a click 
TouchEvent 			A touch event on a mobile device 
WheelEvent 			An event triggered by rotating the scroll wheel 
KeyboardEvent 	A key press
*/

{
  function handleDrag(eDown: Event) {
    const targetEl = eDown.currentTarget
    targetEl.classList.add('dragging')
    // ~~~~~~~           Object is possibly 'null'.
    //         ~~~~~~~~~ Property 'classList' does not exist on type 'EventTarget'
    const dragStart = [eDown.clientX, eDown.clientY]
    // ~~~~~~~                Property 'clientX' does not exist on 'Event'
    //                ~~~~~~~ Property 'clientY' does not exist on 'Event'
    const handleUp = (eUp: Event) => {
      targetEl.classList.remove('dragging')
      //  ~~~~~~~~           Object is possibly 'null'.
      //           ~~~~~~~~~ Property 'classList' does not exist on type 'EventTarget'
      targetEl.removeEventListener('mouseup', handleUp)
      //  ~~~~~~~~ Object is possibly 'null'
      const dragEnd = [eUp.clientX, eUp.clientY]
      // ~~~~~~~                Property 'clientX' does not exist on 'Event'
      //              ~~~~~~~   Property 'clientY' does not exist on 'Event'
      console.log(
        'dx, dy = ',
        [0, 1].map(i => dragEnd[i] - dragStart[i]),
      )
    }
    targetEl.addEventListener('mouseup', handleUp)
    // ~~~~~~~ Object is possibly 'null'
  }

  const div = document.getElementById('surface')
  div.addEventListener('mousedown', handleDrag)
  // ~~~ Object is possibly 'null'
}

// Inlining the mousedown handler gives TypeScript more information to work with and removes most of the errors.
// You can also declare the parameter type to be MouseEvent rather than Event.
{
  function addDragHandler(el: HTMLElement) {
    el.addEventListener('mousedown', eDown => {
      const dragStart = [eDown.clientX, eDown.clientY]
      const handleUp = (eUp: MouseEvent) => {
        el.classList.remove('dragging')
        el.removeEventListener('mouseup', handleUp)
        const dragEnd = [eUp.clientX, eUp.clientY]
        console.log(
          'dx, dy = ',
          [0, 1].map(i => dragEnd[i] - dragStart[i]),
        )
      }
      el.addEventListener('mouseup', handleUp)
    })
  }

  // The if statement at the end handles the possibility that there is no #surface element.
  // If you know that this element exists, you could use an assertion instead (div!).
  const div = document.getElementById('surface')
  if (div) {
    addDragHandler(div)
  }
}
