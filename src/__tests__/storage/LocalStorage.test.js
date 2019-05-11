import localStorage from 'local-storage';
import LocalStorage from '../../storage/LocalStorage';

describe('LocalStorage should subscribe, unsubscribe, get and set data successfully', () => {
  const localStorageData = new Map();

  localStorage.on = jest.fn();
  localStorage.off = jest.fn();
  localStorage.get = jest.fn((key) => localStorageData.get(key));
  localStorage.set = jest.fn((key, value) => {
    localStorageData.set(key, value);
  });

  const localStorageInstance = new LocalStorage();
  const key = 'name';
  const value = 'crazyhitty';

  it('subscribe() should update the listenerMap internally', () => {
    const listener = jest.fn();

    localStorageInstance.subscribe(key, listener);

    expect(localStorageInstance.listenerMap.size).toEqual(1);
    expect(localStorageInstance.listenerMap.get(key)).toEqual(listener);
  });

  it('set() should update the data in local storage', async () => {
    await localStorageInstance.set(key, value);

    expect(localStorage.set.mock.calls[0][0]).toBe(key);
    expect(localStorage.set.mock.calls[0][1]).toBe(value);
    const listener = localStorageInstance.listenerMap.get(key);
    expect(listener.mock.calls[0][0]).toBe(value);
  });

  it('get() should return just added data from local storage', async () => {
    const data = await localStorageInstance.get(key);

    expect(data).toBe(value);
  });

  it('unsubscribe() should remove the listener for provided key', async () => {
    localStorageInstance.unsubscribe(key);

    const listener = localStorageInstance.listenerMap.get(key);
    expect(listener).toBe(undefined);
  });
});
