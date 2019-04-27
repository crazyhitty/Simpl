import SitesStore from '../../stores/SitesStore';

const stubMockMemberFunction = (object, functionName, functionValue) => {
  Object.defineProperty(object, functionName, {
    value: functionValue,
    writable: true,
  });
};

describe('SitesStore should add, get, update, delete and swap sites successfully', () => {
  const googleSite = {
    name: 'google',
    url: 'https://www.google.com',
  };

  const redditSite = {
    name: 'reddit',
    url: 'https://www.reddit.com',
  };

  let sites = [];

  const sitesStore = new SitesStore();

  const stubBrowserLocalStorageApi = () => {
    const getBrowser = jest.fn(() => ({
      storage: {
        local: {
          get: () => Promise.resolve({ savedSites: sites }),
          set: (obj) => {
            sites = obj.savedSites;
          },
        },
      },
    }));
    stubMockMemberFunction(sitesStore, 'getBrowser', getBrowser);
  };

  stubBrowserLocalStorageApi();

  it('add() should not crash', async () => {
    const addGoogleSitePromise = sitesStore.add(
      googleSite.name,
      googleSite.url,
    );
    const addRedditSitePromise = sitesStore.add(
      redditSite.name,
      redditSite.url,
    );

    const result = await Promise.all([
      addGoogleSitePromise,
      addRedditSitePromise,
    ]);
    expect(result.length).toEqual(2);
    expect(result).toEqual([undefined, undefined]);
  });

  it('get() should return just added sites', async () => {
    const sites = await sitesStore.get();
    expect(sites.length).toEqual(2);
    expect(sites[0].name).toEqual(googleSite.name);
    expect(sites[0].url).toEqual(googleSite.url);
    expect(sites[1].name).toEqual(redditSite.name);
    expect(sites[1].url).toEqual(redditSite.url);
  });

  it('update() should not crash', async () => {
    googleSite.name = 'google india';
    googleSite.url = 'https://www.google.in';
    const result = await sitesStore.update(
      sites[0].key,
      googleSite.name,
      googleSite.url,
    );
    expect(result).toEqual(undefined);
  });

  it('get() should return updated sites', async () => {
    const sites = await sitesStore.get();
    expect(sites.length).toEqual(2);
    expect(sites[0].name).toEqual(googleSite.name);
    expect(sites[0].url).toEqual(googleSite.url);
    expect(sites[1].name).toEqual(redditSite.name);
    expect(sites[1].url).toEqual(redditSite.url);
  });

  it('swap() should not crash', async () => {
    const result = await sitesStore.swap(sites[0].key, sites[1].key);
    expect(result).toEqual(undefined);
  });

  it('get() should return sites with swapped order', async () => {
    const sites = await sitesStore.get();
    expect(sites.length).toEqual(2);
    expect(sites[0].name).toEqual(redditSite.name);
    expect(sites[0].url).toEqual(redditSite.url);
    expect(sites[1].name).toEqual(googleSite.name);
    expect(sites[1].url).toEqual(googleSite.url);
  });

  it('delete() should not crash', async () => {
    const result = await sitesStore.delete(sites[0].key);
    expect(result).toEqual(undefined);
  });

  it('get() should not return deleted sites', async () => {
    const sites = await sitesStore.get();
    expect(sites.length).toEqual(1);
    expect(sites[0].name).toEqual(googleSite.name);
    expect(sites[0].url).toEqual(googleSite.url);
  });
});
