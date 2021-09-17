import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Filter from 'bad-words';
const filter = new Filter();

// [5.1]
// Working with forms in React: receive events from event handlers, then use data from those events to update state or props
// onChange — This is fired when an input element changes. Access new value using event.target.value.
// onClick — This is fired when an element is clicked. You listen for it

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
    console.log('handledPostChange');
  }

  handleSubmit(event) {
    event.preventDefault(); // prevents page from reloading

    if (!this.state.valid) {
      return;
    }

    // [6.1]
    // make sure there is a property to work with (can make up any name for it, ex: onMurat instead of onSubmit)
    // the prop just looks like an attribute at the component instance which is at the parent: <CreatePost onSubmit../>
    if (this.props.onSubmit) {
      const newPost = {
        date: Date.now(),
        id: Date.now(), // assign a temp key, the api will create a real one for us
        content: this.state.content
      };

      this.props.onSubmit(newPost); // call onSubmit, passed via props from the parent

      this.setState({ // reset state to initial form so user has visual que that post was submitted
        content: '',
        valid: null
      });
    }
    else {
      console.log('no onSubmit callback exists');
    }

    console.log('handleSubmit');
  }
  render() {
    return (
      <div className="create-post">
        <button onClick={this.handleSubmit}>Post</button>
        <textarea
          placeholder="What's on your mind?"
          value={this.state.content}
          onChange={this.handlePostChange}>
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
