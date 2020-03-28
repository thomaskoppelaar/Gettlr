/**
 * @ignore
 * BEGIN HEADER
 *
 * Contains:        AppearanceProvider class
 * CVM-Role:        Service Provider
 * Maintainer:      Hendrik Erz
 * License:         GNU GPL v3
 *
 * Description:     Enables Gettlr to adapt its display mode according to user
 *                  settings.
 *
 * END HEADER
 */

const EventEmitter = require('events')
const { systemPreferences, nativeTheme } = require('electron')

/**
 * This class manages automatic changes in the appearance of the app. It won't
 * do anything, if the scheduler is set to off, listen to changes in the
 * operating system's appearance if set to system, and switch the mode on a given
 * time if set to schedule.
 */
class AppearanceProvider extends EventEmitter {
  /**
   * Create the instance on program start and initially load the settings.
   */
  constructor () {
    super()
    global.log.verbose('Appearance provider booting up ...')

    this._isDarkTheme = global.config.get('darkTheme')
    global.config.set('darkTheme', true)




    // Subscribe to configuration updates
    global.config.on('update', (option) => {
      if (option === 'darkTheme') this._isDarkTheme = global.config.get('darkTheme')
    })

  }

  /**
   * Shuts down the provider
   * @return {Boolean} Always returns true
   */
  shutdown () {
    global.log.verbose('Appearance provider shutting down ...')
    return true
  }
}

module.exports = new AppearanceProvider()
