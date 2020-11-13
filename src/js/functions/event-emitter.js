class EventEmitter {
  constructor() {
    this.events = {};
  }
  dispatch(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach(([callback]) => callback(data));
  }
  subscribe(eventString, callback, id) {
    let events = eventString.split(/[ ,]+/);
    events.forEach(e => {
      if (!this.events[e]) this.events[e] = [];
      this.events[e].push([callback, id]);
    });
  }
  unsubscribe(eventString, id) {
    let events = eventString.split(/[ ,]+/);
    events.forEach(e => {
      if (!this.events[e]) return;
      let rest = this.events[e].filter(([, eventId]) => eventId != id);
      this.events[e] = rest;
    });
  }
}

export default new EventEmitter;