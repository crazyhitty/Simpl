let browserStorageChangeListener;

const getSites = async () => {
  try {
    const data = await browser.storage.local.get('savedSites');
    console.log('getSites', data.savedSites);
    return data.savedSites || [];
  } catch (error) {
    console.error('getSites', 'Unable to fetch sites', error.message);
    return [];
  }
};

const addSite = async (title, url) => {
  const currentSites = await getSites();
  currentSites.push({
    title,
    url,
  });

  // Save in storage.
  await browser.storage.local.set({
    savedSites: currentSites
  });
};

const removeSite = () => {

};

const updateSite = () => {

};

const clearAllSites = () => {

};

const sitesUpdatedListener = (event) => {
  if (browserStorageChangeListener) {
    console.warn('sitesUpdatedListener: already initialized!!!');
    return;
  }

  console.warn('sitesUpdatedListener: started listening for any changes done in savedSites');
  const browserStorageChangeEvent = (changes, area) => {
    console.log(changes, area);
  };

  browserStorageChangeListener = browser.storage.onChanged.addListener(browserStorageChangeEvent);
};

module.exports = { getSites, addSite, sitesUpdatedListener };