import { observable } from 'mobx';
import { randomKey } from '../Utils';

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

  delete = (key) => (
    this.get()
      .then((sites) => {
        const siteIndexToUpdate = sites.findIndex(site => site.key === key);
        sites.splice(siteIndexToUpdate, 1);
        return browser.storage.local.set({ savedSites: sites });
      })
  );

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
