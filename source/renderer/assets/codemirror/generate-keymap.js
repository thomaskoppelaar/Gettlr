// This plugin applies specific line classes to markdown headings to enable you
// to enlargen them via CSS.

const CodeMirror = require('codemirror')

module.exports = function (editor) {
  let homeEndBehaviour = global.config.get('editor.homeEndBehaviour')
  let keymap = {}

  // Crossplatform shortcuts
  keymap['Enter'] = 'newlineAndIndentContinueMarkdownList'
  keymap['Tab'] = 'autoIndentMarkdownList'
  keymap['Shift-Tab'] = 'autoUnindentMarkdownList'
  keymap['Ctrl-Enter'] = (cm) => {
    // Implement middle-of-line insert line below behaviour (see #101)
    CodeMirror.commands['goLineEnd'](cm)
    CodeMirror.commands['newlineAndIndent'](cm)
  }
  keymap['Shift-Ctrl-Enter'] = (cm) => {
    // Implement middle-of-line insert line above behaviour (see #101)
    CodeMirror.commands['goLineUp'](cm)
    CodeMirror.commands['goLineEnd'](cm)
    CodeMirror.commands['newlineAndIndent'](cm)
  }

  // Swap lines in the editor (mostly useful for lists)
  keymap['Alt-Up'] = 'swapLineUp'
  keymap['Alt-Down'] = 'swapLineDown'

  
  // Windows/Linux/other shortcuts
  keymap['Ctrl-F'] = false // Disable the internal search
  // If homeEndBehaviour is true, use defaults (paragraph start/end), if it's
  // false, use visible lines.
  keymap['Home'] = (homeEndBehaviour) ? 'goLineStart' : 'goLineLeftSmart'
  keymap['End'] = (homeEndBehaviour) ? 'golineEnd' : 'goLineRight'
  keymap['Ctrl-Shift-V'] = (cm) => { editor.pasteAsPlain() }
  keymap['Ctrl-Alt-F'] = 'insertFootnote'
  keymap['Ctrl-T'] = 'markdownMakeTaskList'
  keymap['Shift-Ctrl-C'] = 'markdownComment'
  keymap['Shift-Ctrl-I'] = 'markdownImage'
  keymap['Ctrl-K'] = 'markdownLink'
  keymap['Ctrl-I'] = 'markdownItalic'
  keymap['Ctrl-B'] = 'markdownBold'
  
  keymap['Ctrl-/'] = (cm) => {
    CodeMirror.commands['commentLine'](cm)
  }

  // Returns a CodeMirror keymap for the main editor, aware of potential settings.
  return CodeMirror.normalizeKeyMap(keymap)
}
