/**
 * @ignore
 * BEGIN HEADER
 *
 * Contains:        RootClose command
 * CVM-Role:        <none>
 * Maintainer:      Hendrik Erz
 * License:         GNU GPL v3
 *
 * Description:     This command closes a root file or directory.
 *
 * END HEADER
 */

const GettlrCommand = require('./gettlr-command')

class RootClose extends GettlrCommand {
  constructor (app) {
    super(app, 'root-close')
  }

  /**
   * Closes (not removes) either a directory or a file.
   * @param {String} evt The event name
   * @param  {Object} arg The hash of a root directory or file.
   */
  run (evt, arg) {
    let root = this._app.getFileSystem().find(arg)
    if (!root) {
      console.log(`No root for arg ${arg} found. Cannot close.`)
      return false
    }

    // We got a root, so now we need to unload it and remove it from config
    try {
      this._app.getFileSystem().unloadPath(root)
      global.config.removePath(root.path)
      // We do not need to update the renderer, will be done automatically.
    } catch (e) {
      global.log.error('Could not unload root!', e)
    }
    return true
  }
}

module.exports = RootClose
