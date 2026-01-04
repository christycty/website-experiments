// js/systems/StateMachine.js
// Simple state machine for animations and game states

export class StateMachine {
  constructor(initialState = 'idle') {
    this.currentState = initialState;
    this.previousState = null;
    this.states = new Map();
    this.transitions = new Map();
  }

  // Register a state with enter, update, and exit callbacks
  registerState(name, callbacks = {}) {
    this.states.set(name, {
      onEnter: callbacks.onEnter || (() => {}),
      onUpdate: callbacks.onUpdate || (() => {}),
      onExit: callbacks.onExit || (() => {}),
    });
  }

  // Register a transition between states
  registerTransition(fromState, toState, condition = () => true) {
    const key = `${fromState}->${toState}`;
    this.transitions.set(key, condition);
  }

  // Change to a new state
  changeState(newState) {
    if (!this.states.has(newState)) {
      console.warn(`State '${newState}' not registered`);
      return false;
    }

    // Check if transition is allowed
    const transitionKey = `${this.currentState}->${newState}`;
    if (this.transitions.has(transitionKey)) {
      const condition = this.transitions.get(transitionKey);
      if (!condition()) {
        console.warn(`Transition from '${this.currentState}' to '${newState}' not allowed`);
        return false;
      }
    }

    // Exit current state
    const currentStateCallbacks = this.states.get(this.currentState);
    if (currentStateCallbacks) {
      currentStateCallbacks.onExit();
    }

    // Update state
    this.previousState = this.currentState;
    this.currentState = newState;

    // Enter new state
    const newStateCallbacks = this.states.get(newState);
    if (newStateCallbacks) {
      newStateCallbacks.onEnter();
    }

    return true;
  }

  // Update current state
  update(deltaTime) {
    const stateCallbacks = this.states.get(this.currentState);
    if (stateCallbacks) {
      stateCallbacks.onUpdate(deltaTime);
    }
  }

  // Get current state
  getCurrentState() {
    return this.currentState;
  }

  // Get previous state
  getPreviousState() {
    return this.previousState;
  }

  // Check if in a specific state
  isInState(stateName) {
    return this.currentState === stateName;
  }
}

