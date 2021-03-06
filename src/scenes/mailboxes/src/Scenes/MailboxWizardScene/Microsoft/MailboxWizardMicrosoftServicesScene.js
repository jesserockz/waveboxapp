import PropTypes from 'prop-types'
import React from 'react'
import MailboxWizardServicesScene from '../MailboxWizardServicesScene'

export default class MailboxWizardMicrosoftServicesScene extends React.Component {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        mailboxId: PropTypes.string.isRequired
      })
    })
  }
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render () {
    return (
      <MailboxWizardServicesScene nextUrl='/mailbox_wizard/complete' mailboxId={this.props.match.params.mailboxId} />
    )
  }
}
