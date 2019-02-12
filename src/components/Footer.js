import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/components/Footer.css'

class Footer extends React.Component {
  static propTypes = {
    primaryAction: PropTypes.string,
    secondaryAction: PropTypes.string,
    primaryActionOnClick: PropTypes.func,
    secondaryActionOnClick: PropTypes.func,
    primaryActionDisabled: PropTypes.bool,
    secondaryActionDisabled: PropTypes.bool,
  };

  render() {
    const {
      primaryAction,
      secondaryAction,
      primaryActionOnClick,
      secondaryActionOnClick,
      primaryActionDisabled,
      secondaryActionDisabled,
    } = this.props;

    return (
      <div className={'footerContainer'}>
        <button
          className={'footerButton'}
          onClick={primaryActionOnClick}
          disabled={primaryActionDisabled}
        >
          {primaryAction}
        </button>
        <button
          className={'footerButton'}
          onClick={secondaryActionOnClick}
          disabled={secondaryActionDisabled}
        >
          {secondaryAction}
        </button>
      </div>
    );
  }
}

export default Footer;
