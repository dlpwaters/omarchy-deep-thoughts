import QtQuick
import Quickshell
import Quickshell.Io
import qs.Commons
import qs.Ui

Panel {
  id: root
  moduleName: "dlpwaters.deep-thoughts"
  ipcTarget: "dlpwaters.deep-thoughts"
  manageIpc: false

  property var anchorItem: null
  property var hostWidget: null
  readonly property var barIdentity: hostWidget || root
  readonly property color contentForeground: bar ? bar.foreground : Color.foreground
  readonly property string contentFontFamily: bar ? bar.fontFamily : Style.font.family
  readonly property string helperPath: Qt.resolvedUrl("next-thought").toString().replace(/^file:\/\//, "")
  readonly property int desiredWidth: Style.space(520)
  readonly property int maximumHeight: Style.space(520)

  property bool loading: false
  property bool hasThought: false
  property string errorMessage: ""
  property var thought: ({})
  property string copiedText: ""

  function open() {
    root.controller.show()
    root.nextThought()
    Qt.callLater(function() { keyCatcher.forceActiveFocus() })
  }

  function close() { root.controller.hide() }

  function nextThought() {
    if (thoughtProc.running) return
    root.loading = true
    root.errorMessage = ""
    thoughtProc.command = [root.helperPath]
    thoughtProc.running = true
  }

  function copyThought() {
    if (!root.thought.text) return
    var output = String(root.thought.text)
      + " — " + String(root.thought.creator || "Omarchy Deep Thoughts")
    Quickshell.execDetached(["wl-copy", output])
    root.copiedText = "Copied"
    copiedTimer.restart()
  }

  function switchPanel(direction) {
    if (root.bar && typeof root.bar.switchPanelFrom === "function")
      return root.bar.switchPanelFrom(root.barIdentity, direction)
    return false
  }

  Process {
    id: thoughtProc
    stdout: StdioCollector { id: thoughtOutput; waitForEnd: true }
    stderr: StdioCollector { id: thoughtError; waitForEnd: true }
    onExited: function(exitCode) {
      root.loading = false
      if (exitCode !== 0) {
        root.hasThought = false
        root.errorMessage = String(thoughtError.text || "Could not load a thought.").trim()
        return
      }
      try {
        root.thought = JSON.parse(thoughtOutput.text)
        root.hasThought = true
      } catch (error) {
        root.hasThought = false
        root.errorMessage = "The thought collection could not be read."
      }
      Qt.callLater(function() { keyCatcher.forceActiveFocus() })
    }
  }

  Timer {
    id: copiedTimer
    interval: 1400
    onTriggered: root.copiedText = ""
  }

  KeyboardPanel {
    id: thoughtPanel
    anchorItem: root.anchorItem
    owner: root.barIdentity
    bar: root.bar
    open: root.opened
    centerOnBar: true
    focusTarget: keyCatcher
    contentWidth: thoughtPanel.fittedContentWidth(root.desiredWidth)
    contentHeight: thoughtPanel.fittedContentHeight(contentColumn.implicitHeight, root.maximumHeight)

    PanelKeyCatcher {
      id: keyCatcher
      anchors.fill: parent
      onCloseRequested: root.close()
      onTabRequested: function(direction) { root.switchPanel(direction) }
      Keys.onPressed: function(event) {
        if (event.key === Qt.Key_Space || event.key === Qt.Key_Return || event.key === Qt.Key_Enter
            || event.key === Qt.Key_N || event.key === Qt.Key_R) {
          root.nextThought()
          event.accepted = true
        } else if (event.key === Qt.Key_C) {
          root.copyThought()
          event.accepted = true
        }
      }

      Column {
        id: contentColumn
        width: parent.width
        spacing: Style.space(16)

        Row {
          width: parent.width
          spacing: Style.space(12)

          Text {
            text: "󰧑"
            color: Color.accent
            font.family: root.contentFontFamily
            font.pixelSize: Style.font.display
          }

          Column {
            width: parent.width - Style.space(60)
            anchors.verticalCenter: parent.verticalCenter
            spacing: Style.space(2)

            Text {
              width: parent.width
              text: "Deep Thoughts"
              color: root.contentForeground
              font.family: root.contentFontFamily
              font.pixelSize: Style.font.title
              font.bold: true
            }

            Text {
              width: parent.width
              text: root.loading ? "THINKING…" : "A SHUFFLED TOUR OF THE ABSURD"
              color: Qt.darker(root.contentForeground, 1.4)
              font.family: root.contentFontFamily
              font.pixelSize: Style.font.caption
              font.bold: true
              font.letterSpacing: 1.1
            }
          }
        }

        PanelSeparator { foreground: root.contentForeground }

        Column {
          width: parent.width
          spacing: Style.space(12)

          Text {
            visible: root.errorMessage === "" && root.hasThought
            width: parent.width
            text: "“" + String(root.thought.text || "") + "”"
            color: root.contentForeground
            font.family: root.contentFontFamily
            font.pixelSize: Style.font.subtitle
            font.italic: true
            lineHeight: 1.2
            wrapMode: Text.WordWrap
          }

          Text {
            visible: root.errorMessage === "" && root.hasThought
            width: parent.width
            text: "— " + String(root.thought.title || "Deep Thought")
            color: Qt.darker(root.contentForeground, 1.35)
            font.family: root.contentFontFamily
            font.pixelSize: Style.font.body
            wrapMode: Text.WordWrap
          }

          Text {
            visible: root.errorMessage !== ""
            width: parent.width
            text: root.errorMessage
            color: Color.urgent
            font.family: root.contentFontFamily
            font.pixelSize: Style.font.body
            wrapMode: Text.WordWrap
          }
        }

        PanelSeparator { foreground: root.contentForeground }

        Row {
          width: parent.width
          spacing: Style.space(8)

          Button {
            text: root.loading ? "Thinking…" : "Another thought"
            foreground: root.contentForeground
            enabled: !root.loading
            onClicked: root.nextThought()
          }

          Button {
            text: root.copiedText === "" ? "Copy" : root.copiedText
            foreground: root.contentForeground
            enabled: !root.loading && root.hasThought
            onClicked: root.copyThought()
          }

          Item { width: Math.max(0, parent.width - Style.space(270)); height: 1 }

          Text {
            anchors.verticalCenter: parent.verticalCenter
            text: root.thought.total
              ? String(root.thought.remaining_in_cycle) + " of " + String(root.thought.total) + " unseen"
              : ""
            color: Qt.darker(root.contentForeground, 1.55)
            font.family: root.contentFontFamily
            font.pixelSize: Style.font.caption
          }
        }

        Text {
          width: parent.width
          text: "space/enter next · c copy · esc close"
          color: Qt.darker(root.contentForeground, 1.7)
          font.family: root.contentFontFamily
          font.pixelSize: Style.font.caption
          horizontalAlignment: Text.AlignRight
        }
      }
    }
  }
}
