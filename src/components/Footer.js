import React from 'react';
import PropTypes from 'prop-types';
import '../styles/components/Footer.css';

class Footer extends React.Component {
  static propTypes = {
    primaryAction: PropTypes.string,
    secondaryAction: PropTypes.string,
    tertiaryAction: PropTypes.string,
    primaryActionOnClick: PropTypes.func,
    secondaryActionOnClick: PropTypes.func,
    tertiaryActionOnClick: PropTypes.func,
    primaryActionDisabled: PropTypes.bool,
    secondaryActionDisabled: PropTypes.bool,
    tertiaryActionDisabled: PropTypes.bool,
  };

  render() {
    const {
      primaryAction,
      secondaryAction,
      tertiaryAction,
      primaryActionOnClick,
      secondaryActionOnClick,
      tertiaryActionOnClick,
      primaryActionDisabled,
      secondaryActionDisabled,
      tertiaryActionDisabled,
    } = this.props;

    return (
      <div className={'footerContainer'}>
        <div className={'footerContainerStart'}>
          {tertiaryAction ? (
            <button
              className={'footerButton'}
              onClick={tertiaryActionOnClick}
              disabled={tertiaryActionDisabled}
            >
              {tertiaryAction}
            </button>
          ) : (
            undefined
          )}
        </div>
        <div className={'footerContainerEnd'}>
          {primaryAction ? (
            <button
              className={'footerButton'}
              onClick={primaryActionOnClick}
              disabled={primaryActionDisabled}
            >
              {primaryAction}
            </button>
          ) : (
            undefined
          )}
          {secondaryAction ? (
            <button
              className={'footerButton'}
              onClick={secondaryActionOnClick}
              disabled={secondaryActionDisabled}
            >
              {secondaryAction}
            </button>
          ) : (
            undefined
          )}
        </div>
      </div>
    );
  }
}

export default Footer;
