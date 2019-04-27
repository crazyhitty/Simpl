import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import Footer from '../components/Footer';
import '../styles/containers/Common.css';
import '../styles/containers/Sites.css';

@inject('sitesStore')
@observer
class EditSites extends React.Component {
  static propTypes = {
    onSiteClick: PropTypes.func,
    onDismiss: PropTypes.func,
    sitesStore: PropTypes.object,
  };

  onDragStart = (key) => (event) => {
    console.log('onDragStart: called; dragging key:', key);
    event.dataTransfer.setData('dragItemKey', key);
  };

  onDragOver = (key) => (event) => {
    console.log('onDragOver: called; dragging key:', key);
    event.preventDefault(); // Necessary. Allows us to drop.
    return false;
  };

  onDrop = (toKey) => (event) => {
    console.log('onDrop: called; dragged on item with key:', toKey);
    event.preventDefault();

    const fromKey = event.dataTransfer.getData('dragItemKey');

    if (fromKey !== toKey) {
      console.log('onDrop: swapping fromKey:', fromKey, '; toKey:', toKey);
      this.props.sitesStore.swap(fromKey, toKey);
    }
    return false;
  };

  onDoneClick = () => {
    if (this.props.onDismiss) this.props.onDismiss();
  };

  onSiteLinkClick = (site) => () => {
    if (this.props.onSiteClick) this.props.onSiteClick(site);
  };

  siteList = (sites) => (
    <div className={'sitesList'}>
      {sites.map((site) => (
        <div className={'sitesListItem'}>
          <a
            id={site.key}
            className={'siteLinkEdit'}
            draggable
            onDragStart={this.onDragStart(site.key)}
            onDragOver={this.onDragOver(site.key)}
            onDrop={this.onDrop(site.key)}
            onClick={this.onSiteLinkClick(site)}
          >
            {site.name}
          </a>
        </div>
      ))}
    </div>
  );

  @computed
  get sitesUi() {
    const { sites } = this.props.sitesStore;
    return this.siteList(sites);
  }

  render() {
    return (
      <div className={'container'}>
        {this.sitesUi}
        <Footer
          primaryAction={'done'}
          primaryActionOnClick={this.onDoneClick}
        />
      </div>
    );
  }
}

export default EditSites;
