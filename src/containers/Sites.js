import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import Footer from '../components/Footer';
import '../styles/containers/Common.css';
import '../styles/containers/Sites.css';

@inject('sitesStore')
@observer
class Sites extends React.Component {
  static propTypes = {
    onEditClick: PropTypes.func,
    onAddClick: PropTypes.func,
    sitesStore: PropTypes.object,
  };

  handleOnEditClick = () => {
    if (this.props.onEditClick) this.props.onEditClick();
  };

  handleOnAddClick = () => {
    if (this.props.onAddClick) this.props.onAddClick();
  };

  emptyView = () => (
    <div className="emptyContainer">
      <button className="emptyButton" onClick={this.handleOnAddClick}>
        {"Looks like you haven't added any website yet, click here to add one."}
      </button>
    </div>
  );

  siteList = (sites) => (
    <div className="sitesList">
      {sites.map((site, index) => (
        <div key={index} className="sitesListItem">
          <a className="siteLink" href={site.url}>
            {site.name}
          </a>
        </div>
      ))}
    </div>
  );

  @computed
  get sitesUi() {
    const { sites } = this.props.sitesStore;
    if (sites.length === 0) {
      return this.emptyView();
    }
    return this.siteList(sites);
  }

  @computed
  get isEditButtonDisabled() {
    return this.props.sitesStore.sites.length === 0;
  }

  render() {
    return (
      <div className="container">
        {this.sitesUi}
        <Footer
          primaryAction="edit"
          secondaryAction="add"
          primaryActionOnClick={this.handleOnEditClick}
          secondaryActionOnClick={this.handleOnAddClick}
          primaryActionDisabled={this.isEditButtonDisabled}
        />
      </div>
    );
  }
}

export default Sites;
