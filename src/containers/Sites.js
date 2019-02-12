import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import Footer from '../components/Footer';
import '../../styles/containers/Sites.css';

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

  render() {
    return (
      <div>
        <div className={'sitesList'}>
          {
            toJS(this.props.sitesStore.sites).map(site => (
              <div className={'sitesListItem'}>
                <a className={'siteLink'} href={site.url}>{site.name}</a>
              </div>
            ))
          }
        </div>
        <Footer
          primaryAction={'edit'}
          secondaryAction={'add'}
          primaryActionOnClick={this.handleOnEditClick}
          secondaryActionOnClick={this.handleOnAddClick}
        />
      </div>
    );
  }
}

export default Sites;
