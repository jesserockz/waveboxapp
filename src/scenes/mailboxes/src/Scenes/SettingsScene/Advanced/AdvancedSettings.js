import PropTypes from 'prop-types'
import React from 'react'
import { Toggle, Paper, SelectField, MenuItem, FlatButton, FontIcon } from 'material-ui'
import { settingsStore, settingsActions } from 'stores/settings'
import { updaterActions } from 'stores/updater'
import { SEGMENTS } from 'shared/Models/Settings/SettingsIdent'
import AppSettings from 'shared/Models/Settings/AppSettings'
import styles from '../SettingStyles'
import shallowCompare from 'react-addons-shallow-compare'
import AcceleratorSettings from './AcceleratorSettings'
import { Row, Col } from 'Components/Grid'

export default class AdvancedSettings extends React.Component {
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static propTypes = {
    showRestart: PropTypes.func.isRequired
  }

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  componentDidMount () {
    settingsStore.listen(this.settingsChanged)
  }

  componentWillUnmount () {
    settingsStore.unlisten(this.settingsChanged)
  }

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  /**
  * Generates the state from the settings
  * @param store=settingsStore: the store to use
  */
  generateState (settingsState = settingsStore.getState()) {
    return {
      app: settingsState.app,
      accelerators: settingsState.accelerators
    }
  }

  state = (() => {
    return this.generateState()
  })()

  settingsChanged = (store) => {
    this.setState(this.generateState(store))
  }

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render () {
    const { app, accelerators } = this.state
    const { showRestart, ...passProps } = this.props

    return (
      <div {...passProps}>
        <Row>
          <Col md={6}>
            <Paper zDepth={1} style={styles.paper}>
              <Toggle
                toggled={app.ignoreGPUBlacklist}
                label='Ignore GPU Blacklist (Requires Restart)'
                labelPosition='right'
                onToggle={(evt, toggled) => {
                  showRestart()
                  settingsActions.ignoreGPUBlacklist(toggled)
                }} />
              <Toggle
                toggled={app.enableUseZoomForDSF}
                label='Use Zoom For DSF (Requires Restart)'
                labelPosition='right'
                onToggle={(evt, toggled) => {
                  showRestart()
                  settingsActions.enableUseZoomForDSF(toggled)
                }} />
              <Toggle
                toggled={app.disableSmoothScrolling}
                label='Disable Smooth Scrolling (Requires Restart)'
                labelPosition='right'
                onToggle={(evt, toggled) => {
                  showRestart()
                  settingsActions.disableSmoothScrolling(toggled)
                }} />
              <Toggle
                toggled={app.useExperimentalWindowOpener}
                label='Use experimental window opener (Requires Restart)'
                labelPosition='right'
                onToggle={(evt, toggled) => {
                  showRestart()
                  settingsActions.update(SEGMENTS.APP, '3_1_8_useExperimentalWindowOpener', toggled)
                }} />
            </Paper>
          </Col>
          <Col md={6}>
            <Paper zDepth={1} style={styles.paper}>
              <div>
                <FlatButton
                  label='Check for update now'
                  icon={<FontIcon className='material-icons'>system_update_alt</FontIcon>}
                  onTouchTap={() => updaterActions.userCheckForUpdates()} />
              </div>
              <br />
              <div>
                <Toggle
                  toggled={app.checkForUpdates}
                  label='Check for updates'
                  labelPosition='right'
                  onToggle={(evt, toggled) => {
                    showRestart()
                    settingsActions.checkForUpdates(toggled)
                  }} />
              </div>
              <SelectField
                fullWidth
                floatingLabelText='Update channel'
                value={app.updateChannel}
                onChange={(evt, index, channel) => {
                  settingsActions.setUpdateChannel(channel)
                  updaterActions.checkForUpdates()
                }}>
                {Object.keys(AppSettings.UPDATE_CHANNELS).map((channel) => {
                  if (channel === AppSettings.UPDATE_CHANNELS.STABLE) {
                    return (<MenuItem key={channel} value={channel} primaryText='Stable' />)
                  } else if (channel === AppSettings.UPDATE_CHANNELS.BETA) {
                    return (<MenuItem key={channel} value={channel} primaryText='Beta' />)
                  }
                })}
              </SelectField>
            </Paper>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <AcceleratorSettings accelerators={accelerators} />
          </Col>
        </Row>
      </div>
    )
  }
}
