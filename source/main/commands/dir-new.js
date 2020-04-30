/**
 * @ignore
 * BEGIN HEADER
 *
 * Contains:        DirNew command
 * CVM-Role:        <none>
 * Maintainer:      Hendrik Erz
 * License:         GNU GPL v3
 *
 * Description:     This command creates a new directory.
 *
 * END HEADER
 */

const GettlrCommand = require('./gettlr-command')
const { trans } = require('../../common/lang/i18n')
const hash = require('../../common/util/hash')
const path = require('path')
const sanitize = require('sanitize-filename')

class DirNew extends GettlrCommand {
  constructor (app) {
    super(app, 'dir-new')
  }

  /**
    * Create a new directory.
    * @param {String} evt The event name
    * @param  {Object} arg An object containing hash of containing and name of new dir.
    */
  async run (evt, arg) {
    let sourceDir = this._app.findDir(arg.hash)
    if (!sourceDir) {
      global.log.error('Could not create directory: No source given.')
      this._app.window.prompt({
        type: 'error',
        title: trans('system.error.could_not_create_dir'),
        message: trans('system.error.could_not_create_dir')
      })
      return false
    }

    arg.name = sanitize(arg.name, { replacement: '-' })

    try {
      await this._app.getFileSystem().runAction('create-directory', {
        'source': sourceDir,
        'info': { 'name': arg.name }
      })
    } catch (e) {
      this._app.window.prompt({
        type: 'error',
        title: trans('system.error.could_not_create_dir'),
        message: e.message
      })
      return false
    }

    // Now the dir should be created -> Send an update to the renderer
    // and set the new dir as current.
    global.application.dirUpdate(sourceDir.hash, sourceDir.hash)
    let newDirHash = hash(path.join(sourceDir.path, arg.name))
    this._app.setCurrentDir(this._app.findDir(newDirHash))
  }
}

module.exports = DirNew
