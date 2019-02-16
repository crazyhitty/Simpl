import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { observable, computed } from 'mobx';
import { validateUrl } from '../Utils';
import Footer from '../components/Footer';
import '../../styles/containers/Common.css';
import '../../styles/containers/ManageSite.css';

export const MODES = {
  add: 'add',
  update: 'update',
};

@inject('sitesStore')
@observer
class ManageSite extends React.Component {
  @observable name = '';
  @observable url = '';

  urlInput;

  static propTypes = {
    site: PropTypes.object,
    mode: PropTypes.oneOf(MODES.add, MODES.edit),
    onDismiss: PropTypes.func,
    sitesStore: PropTypes.object,
  };

  static defaultProps = {
    mode: MODES.add,
  };

  constructor(props) {
    super(props);
    if (props.mode === MODES.update) {
      this.name = props.site.name;
      this.url = props.site.url;
    }
  }

  handleOnNameChange = (event) => {
    this.name = event.target.value;
  };

  handleOnUrlChange = (event) => {
    this.url = event.target.value;
  };

  handleOnNameKeyPress = (event) => {
    if(event.key === 'Enter'){
      this.urlInput.focus();
    }
  };

  onCancelClick = () => {
    if (this.props.onDismiss) this.props.onDismiss();
  };

  onDoneClick = () => {
    if (this.isDoneButtonDisabled) return;
    switch (this.props.mode) {
      case MODES.add:
        this.props.sitesStore.add(this.name, this.url);
        break;
      case MODES.update:
        this.props.sitesStore.update(this.props.site.key, this.name, this.url);
        break;
    }
    if (this.props.onDismiss) this.props.onDismiss();
  };

  @computed
  get isDoneButtonDisabled() {
    return this.name === '' || !validateUrl(this.url);
  }

  render() {
    return (
      <div className={'container'}>
        <div className={'addContainer'}>
          <div className={'siteInputContainer'}>
            <input
              className={'siteInput'}
              type="text"
              placeholder="Website name"
              maxLength="20"
              value={this.name}
              onChange={this.handleOnNameChange}
              onKeyPress={this.handleOnNameKeyPress}
            />
          </div>
          <div className={'siteInputContainer'}>
            <input
              ref={(input) => { this.urlInput = input; }}
              className={'siteInput'}
              type="url"
              placeholder="Website url"
              value={this.url}
              onChange={this.handleOnUrlChange}
            />
          </div>
        </div>
        <Footer
          primaryAction={'cancel'}
          secondaryAction={'done'}
          primaryActionOnClick={this.onCancelClick}
          secondaryActionOnClick={this.onDoneClick}
          secondaryActionDisabled={this.isDoneButtonDisabled}
        />
      </div>
    );
  }
}

export default ManageSite;
