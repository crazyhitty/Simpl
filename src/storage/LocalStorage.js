import localStorage from 'local-storage';

export const KEYS = Object.freeze({
  SAVED_SITES: 'savedSites',
});

/**
 * Manage local storage for our app.
 */
class LocalStorage {
  listenerMap = new Map();

  /**
   * Subscribe for listening any changes done on the data associated with the provided key.
   * @param {String} key - Unique identifier associated with the data object you want to access.
   * @param {Function} listener - Updated values will be provided via this listener.
   */
  subscribe = (key, listener) => {
    if (key && listener) {
      this.listenerMap.set(key, listener);
      localStorage.on(key, listener);
    } else {
      throw new Error(
        'Unable to subscribe as either key or listener is undefined',
      );
    }
  };

  /**
   * Stop listening for any changes done on the data associated with the provided key.
   * @param {String} key - Unique identifier associated with the data object.
   */
  unsubscribe = (key) => {
    if (this.listenerMap.has(key)) {
      const listener = this.listenerMap.get(key);
      localStorage.off(key, listener);
      this.listenerMap.delete(key);
    }
  };

  /**
   * Send an event to listener instance regarding data update. This will manually trigger a data
   * change event to the subscriber as the existing localStorage api will only send event to other
   * tabs and will never send any event to current tab if the current tab is the one making changes.
   * @param {String} key - Unique identifier associated with the data object.
   * @param {Object} data - Updated data.
   */
  sendEvent = (key, data) => {
    if (this.listenerMap.has(key)) {
      const listener = this.listenerMap.get(key);
      listener(data);
    }
  };

  /**
   * Get the data associated with the provided key.
   * @param {String} key - Unique identifier associated with the data object you want to access.
   * @return {Promise<Object>} Promise with data associated with the provided key.
   */
  get = (key) =>
    new Promise((resolve) => {
      const data = localStorage.get(key);
      resolve(data);
    });

  /**
   * Save the data associated with the provided key in local storage.
   * @param {String} key - Unique identifier for data object.
   * @param {Object} data - Data to be saved.
   * @return {Promise} Promise indicating that data was saved successfully or not.
   */
  set = (key, data) =>
    new Promise((resolve) => {
      localStorage.set(key, data);
      this.sendEvent(key, data);
      resolve();
    });
}

export default LocalStorage;
