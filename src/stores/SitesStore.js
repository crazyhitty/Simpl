import { observable } from 'mobx';
import { randomKey } from '../Utils';

/**
 * Class responsible for managing sites.
 */
class SitesStore {
  @observable sites = [];

  browserStorageChangeListener;

  constructor() {
    this.get().then((sites) => {
      this.sites = sites;
      this.sitesUpdatedListener((updatedSites) => {
        this.sites = updatedSites;
      })
    });
  }

  /**
   * Listen for any change in localStorage.
   * @param {Object} event - Contains updated values.
   */
  sitesUpdatedListener = (event) => {
    if (this.browserStorageChangeListener) {
      console.warn('sitesUpdatedListener: already initialized!!!');
      return;
    }

    console.log('sitesUpdatedListener: started listening for any changes done in savedSites');
    const browserStorageChangeEvent = (changes, area) => {
      console.log('sitesUpdatedListener', changes, area);
      event(changes.savedSites.newValue);
    };

    this.browserStorageChangeListener = browser.storage.onChanged.addListener(browserStorageChangeEvent);
  };

  /**
   * Get all the sites available in localStorage.
   * @returns {Promise<Array>} Promise will always resolve with sites array. If no sites are
   * available, then promise will still resolve, but the value will be an empty array.
   */
  get = () => new Promise((resolve) => {
    browser.storage.local.get('savedSites')
      .then((data) => {
        console.log('getSites', data.savedSites);
        resolve(data.savedSites || []);
      })
      .catch((error) => {
        console.error('Error while fetching savedSites; cause: ', error.message);
        resolve([]);
      });
  });

  /**
   * Add a new site.
   * @param {String} name - Name of the site.
   * @param {String} url - Site link.
   * @returns {Promise} Promise indicating if the site is added successfully or not.
   */
  add = (name, url) => (
    this.get()
      .then((sites) => {
        sites.push({
          key: randomKey(),
          name,
          url,
        });
        return browser.storage.local.set({ savedSites: sites });
      })
  );

  /**
   * Update the site metadata.
   * @param {String} key - Key of the site which is required to be updated.
   * @param {String} name - Name of the site.
   * @param {String} url - Site link.
   * @returns {Promise} Promise indicating if the site is updated successfully or not.
   */
  update = (key, name, url) => (
    this.get()
      .then((sites) => {
        const siteIndexToUpdate = sites.findIndex(site => site.key === key);
        sites[siteIndexToUpdate] = {
          key,
          name,
          url,
        };
        return browser.storage.local.set({ savedSites: sites });
      })
  );

  /**
   * Delete the site from local storage.
   * @param {String} key - Key of the site which is required to be deleted.
   * @returns {Promise} Promise indicating if the site is deleted successfully or not.
   */
  delete = (key) => (
    this.get()
      .then((sites) => {
        const siteIndexToUpdate = sites.findIndex(site => site.key === key);
        sites.splice(siteIndexToUpdate, 1);
        return browser.storage.local.set({ savedSites: sites });
      })
  );

  /**
   * Swap the sites to change their display order.
   * @param {String} fromKey - Key of the site which user wants at new position.
   * @param {String} toKey - Key of the site which user wants to replace.
   * @returns {Promise} Promise indicating if sites are swapped successfully or not.
   */
  swap = (fromKey, toKey) => (
    this.get()
      .then((sites) => {
        const fromSiteIndex = sites.findIndex(site => site.key === fromKey);
        const toSiteIndex = sites.findIndex(site => site.key === toKey);
        // Swap the data b/w fromSiteIndex and toSiteIndex.
        [sites[fromSiteIndex], sites[toSiteIndex]] = [
          {
            key: toKey,
            name: sites[toSiteIndex].name,
            url: sites[toSiteIndex].url,
          },
          {
            key: fromKey,
            name: sites[fromSiteIndex].name,
            url: sites[fromSiteIndex].url,
          }
        ];
        return browser.storage.local.set({ savedSites: sites });
      })
  );
}

export default SitesStore;
