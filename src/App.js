import React from 'react';
import { observer, Provider } from 'mobx-react';
import { observable, computed } from 'mobx';
import stores from './stores';
import Sites from './containers/Sites';
import AddSite from './containers/AddSite';
import '../styles/fonts/Fonts.css';

const UiState = {
  sites: 'sites',
  add: 'add',
};

@observer
class App extends React.Component {
  @observable uiState = UiState.sites;

  handleSitesOnEditClick = () => {
    this.uiState = UiState.edit;
  };

  handleSitesOnAddClick = () => {
    this.uiState = UiState.add;
  };

  handleAddSiteOnDismiss = () => {
    this.uiState = UiState.sites;
  };

  sitesUi = () => (
    <Sites
      onEditClick={this.handleSitesOnEditClick}
      onAddClick={this.handleSitesOnAddClick}
    />
  );

  addUi = () => (
    <AddSite
      onDismiss={this.handleAddSiteOnDismiss}
    />
  );

  @computed
  get ui() {
    switch(this.uiState) {
      case UiState.sites:
        return this.sitesUi();
      case UiState.add:
        return this.addUi();
      default:
        throw new Error(`mainUi: Invalid UiState: ${this.uiState}`);
    }
  };

  render() {
    return (
      <Provider {...stores}>
        {this.ui}
      </Provider>
    );
  }
}

export default App;
