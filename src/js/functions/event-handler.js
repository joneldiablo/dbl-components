/**
 * Class representing an event handler.
 */
export class EventHandler {
  /**
   * Creates an EventHandler instance.
   */
  constructor() {
    this.events = {};  // Object to hold direct event subscriptions
    this.patterns = [];  // Array to hold regex patterns for wildcard event subscriptions
    this.cache = {};  // Initialize cache for quick event dispatching
  }

  /**
   * Dispatches an event to all subscribed callbacks.
   * @param {string} event - The event name to dispatch.
   * @param {...any} data - Data to be passed to the callback function.
   */
  dispatch(event, ...data) {
    // Check if the event is in the cache first
    if (this.cache[event]) {
      this.cache[event].forEach(([callback, id]) => callback(...data, id));
      return;  // Finish since it was handled from the cache
    }

    // Check if the event is directly in this.events
    if (this.events[event]) {
      this.events[event].forEach(([callback, id]) => callback(...data, id));
      // Add to cache for future invocations
      this.cache[event] = this.events[event];
    } else {
      // Check in patterns for a match
      this.patterns.forEach(({ pattern, callbacks }) => {
        if (pattern.test(event)) {
          callbacks.forEach(([callback, id]) => callback(...data, id));
          // Add to cache if pattern matches
          if (!this.cache[event]) {
            this.cache[event] = [];
          }
          this.cache[event].push(...callbacks);
        }
      });
    }
  }

  /**
   * Subscribes to an event or events with optional wildcards.
   * @param {string} eventString - The event name or pattern to subscribe to.
   * @param {Function} callback - The callback function to execute when the event is dispatched.
   * @param {string} id - An identifier for the subscription, used for unsubscribing.
   */
  subscribe(eventString, callback, id) {
    let events = eventString.split(/[ ,]+/);
    events.forEach(e => {
      if (e.includes('*')) {
        // Convert wildcard event string to RegExp
        const regex = new RegExp('^' + e.split('*').map(this.escapeRegExp).join('.*') + '$');
        const existingPattern = this.patterns.find(p => p.pattern.source === regex.source);
        if (existingPattern) {
          existingPattern.callbacks.push([callback, id]);
        } else {
          this.patterns.push({ pattern: regex, callbacks: [[callback, id]] });
        }
      } else {
        // Handle direct event subscriptions
        if (!this.events[e]) this.events[e] = [];
        this.events[e].push([callback, id]);
        // Ensure the cache is also updated
        if (!this.cache[e]) this.cache[e] = [];
        this.cache[e].push([callback, id]);
      }
    });
  }

  /**
   * Unsubscribes from an event or events.
   * @param {string} eventString - The event name or pattern to unsubscribe from.
   * @param {string} id - The identifier for the subscription to be removed.
   */
  unsubscribe(eventString, id) {
    let events = eventString.split(/[ ,]+/);
    events.forEach(e => {
      if (e.includes('*')) {
        // No need to modify the cache here since patterns are not stored directly in it
      } else {
        if (!this.events[e]) return;
        const rest = this.events[e].filter(([, eventId]) => eventId != id);
        this.events[e] = rest;
        // Update the cache
        if (this.cache[e]) {
          this.cache[e] = this.cache[e].filter(([, eventId]) => eventId != id);
          if (this.cache[e].length === 0) {
            delete this.cache[e];  // Remove from cache if no callbacks are left
          }
        }
      }
    });
  }

  /**
   * Escapes special characters in a string for use in a regular expression.
   * @param {string} string - The string to escape.
   * @return {string} The escaped string.
   */
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');  // Escape special characters for RegExp
  }
}

export default new EventHandler;
