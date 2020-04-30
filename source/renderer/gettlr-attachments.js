/* global $ */
/**
 * @ignore
 * BEGIN HEADER
 *
 * Contains:        GettlrAttachments class
 * CVM-Role:        View
 * Maintainer:      Hendrik Erz
 * License:         GNU GPL v3
 * 
 * Description:     Displays the attachments of the current directory.
 *
 * END HEADER
 */

const { shell } = require('electron')

const { trans } = require('../common/lang/i18n.js')

const FILETYPES_IMG = [
  '.jpg',
  '.jpeg',
  '.svg',
  '.gif',
  '.png',
  '.tiff',
  '.tif'
]

/**
  * Handles both display of files in the attachment sidebar and the list of
  * references, if applicable.
  * @param {GettlrRenderer} parent The renderer.
  */
class GettlrAttachments {
  constructor (parent) {
    this._renderer = parent
    this._container = $('<div>').prop('id', 'attachments').css('display', 'none')

    this._tocContainer = $('<div>').prop('id', 'tocContainer')
    this._container.append($('<h1>').text(trans('gui.citeproc.toc_heading')))
    this._container.append(this._tocContainer)

    this._container.append(`<h1>${trans('gui.attachments')} <small id="open-dir-external" title="${trans('gui.attachments_open_dir')}">&#xf332;</small></h1>`)
    this._fileContainer = $('<div>').prop('id', 'files')
    this._container.append(this._fileContainer)
        
    $('body').append(this._container)
    this._open = false
    this._attachments = []

    this.refresh()

    this._act() // Activate both the directory toggle and the link
  }

  /**
    * Shows/hides the pane.
    */
  toggle () {
    // Toggles the display of the attachment pane
    if (!this._open) {
      this._tocContainer.text('')
      this.displayTOC()
      this._container.css('display', '')
      this._container.animate({ 'right': '0%' }, 0)
    } else {
      this._container.animate({ 'right': '-20%' }, 0, () => {
        this._container.css('display', 'none')
      })
    }

    this._open = !this._open
  }

  /**
    * Refreshes the list with new attachments on dir change.
    */
  refresh () {
    this._fileContainer.text('')
    // Grab the newest attachments and refresh
    if (!this._renderer.getCurrentDir()) {
      this._fileContainer.append($('<p>').text(trans('gui.no_attachments')))
      return // Don't activate in this instance
    }

    if (this._renderer.getCurrentDir().attachments.length === 0) {
      this._fileContainer.append($('<p>').text(trans('gui.no_attachments')))
    } else {
      this._attachments = this._renderer.getCurrentDir().attachments
      for (let a of this._attachments) {
        let link = $('<a>').text(a.name)
          .attr('data-link', a.path)
          .attr('data-hash', a.hash)
          .attr('title', a.path) // Make sure the user can always see the full title
          .attr('href', a.path) // Necessary for native drag&drop functionality
          
        // When dragging files from here onto the editor instance, users want
        // to have the appropriate link placed automatically, that is: images
        // should be wrapped in appropriate image tags, whereas documents
        // should be linked to enable click & open. We have to do this on
        // this end, because when trying to override data during drop it
        // won't work.
        let dragData = a.path
        if (FILETYPES_IMG.includes(a.ext.toLowerCase())) {
          // Override the drag data with a link to the image
          let uri = decodeURIComponent(a.path)
          dragData = `![${a.name}](${uri})`
        } else {
          // Standard file link
          let uri = decodeURIComponent(a.path)
          dragData = `[${a.name}](${uri})`
        }

        // Circumvent the jQuery event wrapping and use native events.
        link[0].ondragstart = (event) => { this.setDragData(dragData, event) }
        this._fileContainer.append(link)
      }
    }
    

  }

/**
    * Displays a table of content.
    * @return {void} (Point of) No return.
    */
   displayTOC () {
    //if (this._renderer.getCurrentFile() === null) return
    this._tocContainer.text('')

    let toc = this._renderer.getEditor().buildTOC()

    if (toc.length === 0) return

    let idUniquifier = Date.now()

    let cnt = $('<div id="toc-container-' + idUniquifier + '">')
    let h1 = 0
    let h2 = 0
    let h3 = 0
    let h4 = 0
    let h5 = 0
    let h6 = 0
    for (let entry of toc) {
      let level = ''
      let i = 0
      while (i < entry.level) {
        level += '  '
        i++
      }

      cnt.append(
        $('<a>')
        .text(level + entry.text)
          .attr('data-line', entry.line)
          .attr('href', '#')
          .addClass('toc-link')
          .css('overflow-wrap', 'break-word')
          .css('white-space', 'pre-wrap')
          .css('padding', '0px')
      )

      
    }

    this._tocContainer.append(cnt)

    // On click jump to line
    $('.toc-link').click((event) => {
      let elem = $(event.target)
      this._renderer.getEditor().jtl(elem.attr('data-line'))
    })

    // Sortable
    $('#toc-container-' + idUniquifier).sortable({
      axis: 'y',
      items: '> .toc-link',
      update: (event, ui) => {
        // The user has dropped the item someplace else.
        let newIndex = ui.item.index()
        let originalLine = parseInt(ui.item.attr('data-line'))
        let sumLength = $('#toc-container-' + idUniquifier + ' > .toc-link').length
        if (newIndex < sumLength - 1) {
          let elementBelow = $('#toc-container-' + idUniquifier + ' > .toc-link').eq(newIndex + 1)
          let aboveLine = parseInt(elementBelow.attr('data-line'))
          this._renderer.getEditor().moveSection(originalLine, aboveLine)
        } else {
          this._renderer.getEditor().moveSection(originalLine, -1)
        }

        // Cool, now destroy the sortable, rebuild the TOC, and re-fill the div
        // again.
        $('#toc-container-' + idUniquifier).sortable('destroy')
        this.displayTOC()
      }
    })
  }


  /**
   * Overwrites the text buffer of a DragEvent to modify what is being dragged.
   * @param {String} data The data to be written into the buffer
   * @param {DragEvent} event The drag event, whose buffer should be overwritten
   */
  setDragData (data, event) {
    event.dataTransfer.setData('text', data)
  }

  /**
    * Activates the event listeners on the attachment pane.
    */
  _act () {
    $('#attachments').on('click', 'a', (e) => {
      let elem = $(e.target)
      if (elem.attr('data-link')) shell.openItem(elem.attr('data-link'))
      e.preventDefault() // Don't follow the link
      e.stopPropagation()
    })

    $('#attachments #open-dir-external').click((e) => {
      if (this._renderer.getCurrentDir()) {
        shell.openItem(this._renderer.getCurrentDir().path)
      }
    })
  }
}

module.exports = GettlrAttachments
