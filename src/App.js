import React, { Component, createRef } from 'react'

import Formulaire from './components/Formulaire';
import Message from './components/Message'
import moment from 'moment'
import 'moment/locale/fr'
import './App.css'
import './Animation.css'

// Firebase
import base from './base'

//Animation
import { CSSTransition, TransitionGroup } from 'react-transition-group'

class App extends Component {
  state = {
    messages: {},
    pseudo: this.props.match.params.pseudo
  }

  messagesRef = createRef()

  componentDidMount () {
    base.syncState('/', {
      context: this,
      state: 'messages'
    })
  }

  componentDidUpdate () {
    const ref = this.messagesRef.current
    ref.scrollTop = ref.scrollHeight
  }

  addMessage = message => {
    const messages = { ...this.state.messages }
    messages[`message-${Date.now()}`] = message
    Object
    .keys(messages)
    .slice(0, -20)
    .forEach(key => {
      messages[key] = null
    })
    this.setState({ messages })
  }

  isUser = pseudo => {
    return pseudo === this.state.pseudo
  }

  render () {
    const message = Object
      .keys(this.state.messages)
      .map(key => (
        <CSSTransition
          timeout={1000}
          classNames='fade'
          key={key}
          >
          <Message
            time={moment().format('Do/MM/YY à hh:mm:ss')}
            isUser={this.isUser}
            message={this.state.messages[key].message}
            pseudo={this.state.messages[key].pseudo}
          />
        </CSSTransition>
      ))
    return (
      <div className='box'>
        <div>
          <div className="messages" ref={this.messagesRef}>
            <TransitionGroup className='message'>
              { message }
            </TransitionGroup>
          </div>
        </div>
        <Formulaire
          length={140}
          pseudo={this.state.pseudo}
          addMessage={this.addMessage} />
      </div>
    )
  }
}

export default App
