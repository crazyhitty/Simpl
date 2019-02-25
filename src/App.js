import React from 'react';
import { observer, Provider } from 'mobx-react';
import { observable, computed } from 'mobx';
import stores from './stores';
import Sites from './containers/Sites';
import ManageSite, { MODES } from './containers/ManageSite';
import EditSites from './containers/EditSites';
import '../styles/fonts/Fonts.css';
import '../styles/containers/Common.css';

const UI_STATE = {
  sites: 'sites',
  manage: 'manage',
  edit: 'edit',
};

@observer
class App extends React.Component {
  @observable uiState = UI_STATE.sites;
  @observable selectedSite;
  @observable mode;

  handleSitesOnEditClick = () => {
    this.uiState = UI_STATE.edit;
  };

  handleSitesOnAddClick = () => {
    this.mode = MODES.add;
    this.uiState = UI_STATE.manage;
  };

  handleAddSiteOnDismiss = () => {
    this.uiState = UI_STATE.sites;
  };

  handleOnSiteClick = (site) => {
    this.selectedSite = site;
    this.mode = MODES.update;
    this.uiState = UI_STATE.manage;
  };

  sitesUi = () => (
    <Sites
      onEditClick={this.handleSitesOnEditClick}
      onAddClick={this.handleSitesOnAddClick}
    />
  );

  manageUi = () => (
    <ManageSite
      mode={this.mode}
      site={this.selectedSite}
      onDismiss={this.handleAddSiteOnDismiss}
    />
  );

  editUi = () => (
    <EditSites
      onSiteClick={this.handleOnSiteClick}
      onDismiss={this.handleAddSiteOnDismiss}
    />
  );

  @computed
  get ui() {
    switch (this.uiState) {
      case UI_STATE.sites:
        return this.sitesUi();
      case UI_STATE.manage:
        return this.manageUi();
      case UI_STATE.edit:
        return this.editUi();
      default:
        throw new Error(`mainUi: Invalid UiState: ${this.uiState}`);
    }
  }

  render() {
    return <Provider {...stores}>{this.ui}</Provider>;
  }
}

export default App;
