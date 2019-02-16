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

  add = (name, url) => {
    this.get()
      .then((sites) => {
        sites.push({
          key: randomKey(),
          name,
          url,
        });
        return browser.storage.local.set({ savedSites: sites });
      })
      .catch((error) => {
        console.error('Error while adding new site; cause:', error.message);
      });
  };

  update = (key, name, url) => {
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
      .catch((error) => {
        console.error('Error while adding new site; cause:', error.message);
      });
  };
}

export default SitesStore;
