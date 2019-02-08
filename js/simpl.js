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

const sitesUpdatedListener = (event) => {
  if (browserStorageChangeListener) {
    console.warn('sitesUpdatedListener: already initialized!!!');
    return;
  }

  console.log('sitesUpdatedListener: started listening for any changes done in savedSites');
  const browserStorageChangeEvent = (changes, area) => {
    console.log('sitesUpdatedListener', changes, area);
    event(changes.savedSites.newValue);
  };

  browserStorageChangeListener = browser.storage.onChanged.addListener(browserStorageChangeEvent);
};

// UI work starts from here.
const siteList = document.getElementById('siteList');
const noSitesContainer = document.getElementById('noSitesContainer');
const sitesContainer = document.getElementById('sitesContainer');
const addContainer = document.getElementById('addContainer');
const noSiteAddButton = document.getElementById('noSiteAddButton');
const addButton = document.getElementById('addButton');
const doneButton = document.getElementById('doneButton');
const cancelButton = document.getElementById('cancelButton');
const titleInput = document.getElementById('titleInput');
const urlInput = document.getElementById('urlInput');

noSiteAddButton.addEventListener('click', () => {
  noSitesContainer.className = 'noSitesContainer hide';
  addContainer.className = 'addContainer show';
});

addButton.addEventListener('click', () => {
  sitesContainer.className = 'sitesContainer hide';
  addContainer.className = 'addContainer show';
});

cancelButton.addEventListener('click', () => {
  addContainer.className = 'addContainer hide';
  if (siteList.hasChildNodes()) {
    // Sites available
    sitesContainer.className = 'sitesContainer show';
  } else {
    // No sites available.
    noSitesContainer.className = 'noSitesContainer show';
  }

  // Reset input values.
  titleInput.value = '';
  urlInput.value = '';
});

doneButton.addEventListener('click', async () => {
  // Add the input data.
  const title = titleInput.value;
  const url = urlInput.value;

  await addSite(title, url);

  addContainer.className = 'addContainer hide';
  sitesContainer.className = 'sitesContainer show';

  // Reset input values.
  titleInput.value = '';
  urlInput.value = '';
});

const addItemToSiteList = (site) => {
  const a = (title, url) => {
    const a = document.createElement('a');
    a.className = 'siteLink';
    a.innerText = title;
    a.href = url;
    return a;
  };

  const li = (a) => {
    const li = document.createElement('li');
    li.className = 'siteListItem';
    li.appendChild(a);
    return li;
  };

  const siteLink = a(site.title, site.url);
  const listItem = li(siteLink);

  siteList.appendChild(listItem);
};

const populateSiteList = (sites) => {
  // Clear all current siteList items.
  // Source on how to remove all child elements of an html element: https://stackoverflow.com/a/3955238
  while (siteList.firstChild) {
    siteList.removeChild(siteList.firstChild);
  }

  if (sites.length === 0) {
    sitesContainer.className = 'sitesContainer hide';
    noSitesContainer.className = 'noSitesContainer show';
  } else {
    noSitesContainer.className = 'noSitesContainer hide';
    sitesContainer.className = 'sitesContainer show';
  }

  sites.forEach((site) => {
    addItemToSiteList(site);
  });
};

const init = async () => {
  const sites = await getSites();
  populateSiteList(sites);
};

init()
  .then(() => {
    console.log('simpl initialized successfully');
    sitesUpdatedListener((updatedSites) => {
      console.log('Sites updated, re-populating siteList');
      populateSiteList(updatedSites);
    });
  })
  .catch((error) => console.log('simpl failed to initialized; cause:', error.message));