import SitesStore from './SitesStore';
import LocalStorage from '../storage/LocalStorage';

export default {
  sitesStore: new SitesStore(new LocalStorage()),
};
