import defaultAC from "../app-controller";

/**
 * Wrapper function for fetch requests with a queue.
 * @param {string} url - The URL to fetch.
 * @param {RequestInit} [options] - Optional fetch options.
 * @returns {Promise<any>} - A promise that resolves with the fetch response.
 */
export class FetchQueue {
  constructor(appCtrl) {
    this.appCtrl = appCtrl;
    this.queue = [];
    this.isRunning = false;
  }

  /**
   * Add a fetch request to the queue.
   * @param {string} url - The URL to fetch.
   * @param {RequestInit} [options] - Optional fetch options.
   * @returns {Promise<any>} - A promise that resolves with the fetch response.
   */
  addRequest(url, options) {
    const index = this.queue.findIndex(f => f.url === url);
    if (index !== -1) {
      const repeated = this.queue[index];
      this.queue.splice(index, 1);
      repeated.reject({ success: false, error: true, reason: 'repeated' });
    }
    return new Promise((resolve, reject) => {
      this.queue.push({ url, options, resolve, reject });
      this.runQueue();
    });
  }

  /**
   * Run the queue of fetch requests.
   */
  async runQueue() {
    if (this.isRunning) return;
    this.isRunning = true;

    while (this.queue.length > 0) {
      const { url, options, resolve, reject } = this.queue.shift();
      try {
        const response = await this.appCtrl.fetch(url, options);
        resolve(response);
      } catch (error) {
        reject(error);
      }
    }

    this.isRunning = false;
  }
}

export default new FetchQueue(defaultAC);
