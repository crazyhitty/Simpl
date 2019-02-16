import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import Footer from '../components/Footer';
import '../../styles/containers/Common.css';
import '../../styles/containers/Sites.css';

@inject('sitesStore')
@observer
class EditSites extends React.Component {
  static propTypes = {
    onSiteClick: PropTypes.func,
    onDismiss: PropTypes.func,
    sitesStore: PropTypes.object,
  };

  onDoneClick = () => {
    if (this.props.onDismiss) this.props.onDismiss();
  };

  onSiteLinkClick = (site) => {
    if (this.props.onSiteClick) this.props.onSiteClick(site);
  };

  siteList = sites => (
    <div className={'sitesList'}>
      {
        sites.map((site, index) => (
          <div id={`site${index}`} className={'sitesListItem'}>
            <a
              className={'siteLinkEdit'}
              href={'#'}
              onClick={() => { this.onSiteLinkClick(site); }}
            >
              {site.name}
            </a>
          </div>
        ))
      }
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
