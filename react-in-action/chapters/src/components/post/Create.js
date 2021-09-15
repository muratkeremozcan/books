import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Filter from 'bad-words';
const filter = new Filter();

// [5.1]
// Working with forms in React: receive events from event handlers, then use data from those events to update state or props
// onChange— This is fired when an input element changes. Access new value using event.target.value.
// onClick— This is fired when an element is clicked. You listen for it

class CreatePost extends Component {
  static propTypes = {};
  constructor(props) {
    super(props);

    this.state = {
      content: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePostChange = this.handlePostChange.bind(this);
  }
  handlePostChange(event) {
    // event.target is a reference to the DOM element that dispatched the event (in this case textarea element)
    // grab that value and use it to set state
    const content = filter.clean(event.target.value); // this is how you start form sanitation
    this.setState(() =>{
      return {
        content,
        valid: content.length <= 280 // this is how you start form validation
      };
    })
  }
  handleSubmit(event) {
    if (!this.state.valid) {
      return;
    }

    const newPost = {
      content: this.state.content
    }

    console.log(newPost);
  }
  render() {
    return (
      <div className="create-post">
        <button onClick={this.handleSubmit}>Post</button>
        <textarea
          value={this.state.content}
          onChange={this.handlePostChange}
          placeholder="What's on your mind?">
        </textarea>
      </div>
    );
  }
}

export default CreatePost;


/* Properties and methods available on a synthetic event in React

bubbles         boolean
cancelable      boolean
currentTarget   DOMEventTarget
defaultPrevented boolean
eventPhase      number
isTrusted       boolean
nativeEvent     DOMEvent
preventDefault()  
isDefaultPrevented() boolean
stopPropagation()  
isPropagationStopped() boolean
target          DOMEventTarget
timeStamp       number
*/
