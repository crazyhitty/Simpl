import { observable } from 'mobx';
import { KEYS } from '../storage/LocalStorage';
import { randomKey } from '../Utils';

/**
 * Class responsible for managing sites.
 */
class SitesStore {
  @observable sites = [];

  localStorage;

  constructor(localStorage) {
    this.localStorage = localStorage;

    this.get().then((sites) => {
      this.sites = sites;
      this.sitesUpdatedListener((updatedSites) => {
        this.sites = updatedSites;
      });
    });
  }

  /**
   * Listen for any change in localStorage.
   * @param {Function} event - Contains updated values.
   */
  sitesUpdatedListener = (event) => {
    console.log(
      'sitesUpdatedListener: started listening for any changes done in savedSites',
    );
    const localStorageChangeEvent = (value) => {
      console.log('sitesUpdatedListener', value);
      event(value);
    };
    this.localStorage.subscribe('savedSites', localStorageChangeEvent);
  };

  /**
   * Get all the sites available in localStorage.
   * @returns {Promise<Array>} Promise will always resolve with sites array. If no sites are
   * available, then promise will still resolve, but the value will be an empty array.
   */
  get = () =>
    new Promise((resolve) => {
      this.localStorage
        .get(KEYS.SAVED_SITES)
        .then((data) => {
          console.log('getSites', data);
          resolve(data || []);
        })
        .catch((error) => {
          console.error(
            'Error while fetching savedSites; cause: ',
            error.message,
          );
          resolve([]);
        });
    });

  /**
   * Add a new site.
   * @param {String} name - Name of the site.
   * @param {String} url - Site link.
   * @returns {Promise} Promise indicating if the site is added successfully or not.
   */
  add = (name, url) =>
    this.get().then((sites) => {
      sites.push({
        key: randomKey(),
        name,
        url,
      });
      return this.localStorage.set(KEYS.SAVED_SITES, sites);
    });

  /**
   * Update the site metadata.
   * @param {String} key - Key of the site which is required to be updated.
   * @param {String} name - Name of the site.
   * @param {String} url - Site link.
   * @returns {Promise} Promise indicating if the site is updated successfully or not.
   */
  update = (key, name, url) =>
    this.get().then((sites) => {
      const sitesToBeUpdated = sites;
      const siteIndexToUpdate = sites.findIndex((site) => site.key === key);
      sitesToBeUpdated[siteIndexToUpdate] = {
        key,
        name,
        url,
      };
      return this.localStorage.set(KEYS.SAVED_SITES, sites);
    });

  /**
   * Delete the site from local storage.
   * @param {String} key - Key of the site which is required to be deleted.
   * @returns {Promise} Promise indicating if the site is deleted successfully or not.
   */
  delete = (key) =>
    this.get().then((sites) => {
      const siteIndexToUpdate = sites.findIndex((site) => site.key === key);
      sites.splice(siteIndexToUpdate, 1);
      return this.localStorage.set(KEYS.SAVED_SITES, sites);
    });

  /**
   * Swap the sites to change their display order.
   * @param {String} fromKey - Key of the site which user wants at new position.
   * @param {String} toKey - Key of the site which user wants to replace.
   * @returns {Promise} Promise indicating if sites are swapped successfully or not.
   */
  swap = (fromKey, toKey) =>
    this.get().then((sites) => {
      const sitesToBeUpdated = sites;
      const fromSiteIndex = sites.findIndex((site) => site.key === fromKey);
      const toSiteIndex = sites.findIndex((site) => site.key === toKey);
      // Swap the data b/w fromSiteIndex and toSiteIndex.
      [sitesToBeUpdated[fromSiteIndex], sitesToBeUpdated[toSiteIndex]] = [
        {
          key: toKey,
          name: sites[toSiteIndex].name,
          url: sites[toSiteIndex].url,
        },
        {
          key: fromKey,
          name: sites[fromSiteIndex].name,
          url: sites[fromSiteIndex].url,
        },
      ];
      return this.localStorage.set(KEYS.SAVED_SITES, sitesToBeUpdated);
    });
}

export default SitesStore;
