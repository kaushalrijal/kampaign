export interface ActiveState {
  bold: boolean
  italic: boolean
  underline: boolean
  strikethrough: boolean
  h1: boolean
  h2: boolean
  h3: boolean
  alignLeft: boolean
  alignCenter: boolean
  alignRight: boolean
  bulletList: boolean
  numberedList: boolean
  link: boolean
  code: boolean
}

export function runExecCommand(command: string, value?: string) {
  // execCommand is deprecated but still widely supported; keep for parity
  if (typeof document.execCommand === "function") {
    document.execCommand(command, false, value)
  }
}

export function computeActiveState(editorEl: HTMLElement): ActiveState {
  const newState: ActiveState = {
    bold: document.queryCommandState("bold"),
    italic: document.queryCommandState("italic"),
    underline: document.queryCommandState("underline"),
    strikethrough: document.queryCommandState("strikeThrough"),
    h1: false,
    h2: false,
    h3: false,
    alignLeft: document.queryCommandState("justifyLeft"),
    alignCenter: document.queryCommandState("justifyCenter"),
    alignRight: document.queryCommandState("justifyRight"),
    bulletList: document.queryCommandState("insertUnorderedList"),
    numberedList: document.queryCommandState("insertOrderedList"),
    link: false,
    code: false,
  }

  if (!newState.alignLeft && !newState.alignCenter && !newState.alignRight) {
    newState.alignLeft = true
  }

  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    let node: Node | null = range.startContainer

    while (node && node !== editorEl) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = (node as Element).tagName.toLowerCase()
        if (tagName === "h1") newState.h1 = true
        if (tagName === "h2") newState.h2 = true
        if (tagName === "h3") newState.h3 = true
        if (tagName === "a") newState.link = true
        if (tagName === "pre") newState.code = true
      }
      node = node.parentNode
    }
  }

  return newState
}

export function toggleFormatBlock(editorEl: HTMLElement, tag: string) {
  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    let node: Node | null = range.startContainer
    let isCurrentlyInTag = false

    while (node && node !== editorEl) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = (node as Element).tagName.toLowerCase()
        if (tagName === tag) {
          isCurrentlyInTag = true
          break
        }
      }
      node = node.parentNode
    }

    if (isCurrentlyInTag) {
      runExecCommand("formatBlock", "<p>")
    } else {
      runExecCommand("formatBlock", `<${tag}>`)
    }
  } else {
    runExecCommand("formatBlock", `<${tag}>`)
  }
}

export function saveSelection(): Range | null {
  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    return selection.getRangeAt(0).cloneRange()
  }
  return null
}

export function restoreSelection(savedSelection: Range | null) {
  if (!savedSelection) return
  const selection = window.getSelection()
  if (selection) {
    selection.removeAllRanges()
    selection.addRange(savedSelection)
  }
}

export function getCaretCoordinates(editorEl: HTMLElement) {
  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    const editorRect = editorEl.getBoundingClientRect()
    return {
      top: rect.bottom - editorRect.top + 4,
      left: rect.left - editorRect.left,
    }
  }
  return { top: 0, left: 0 }
}

export function getCurrentWord(): string {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return ""

  const range = selection.getRangeAt(0)
  const node = range.startContainer

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || ""
    const offset = range.startOffset
    const beforeCaret = text.slice(0, offset)
    const lastBraceIndex = beforeCaret.lastIndexOf("{")
    const lastSpaceIndex = beforeCaret.lastIndexOf(" ")

    if (lastBraceIndex !== -1 && lastBraceIndex > lastSpaceIndex) {
      return "{" + beforeCaret.slice(lastBraceIndex + 1)
    }

    const words = beforeCaret.split(/\s/)
    return words[words.length - 1] || ""
  }
  return ""
}

export function insertHeaderAtCursor(editorEl: HTMLElement, header: string) {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) {
    const textNode = document.createTextNode(`{${header}} `)
    editorEl.appendChild(textNode)

    const range = document.createRange()
    range.selectNodeContents(editorEl)
    range.collapse(false)
    selection?.removeAllRanges()
    selection?.addRange(range)
    return
  }

  const range = selection.getRangeAt(0)
  const textNode = document.createTextNode(`{${header}}`)

  range.deleteContents()
  range.insertNode(textNode)

  const spaceNode = document.createTextNode(" ")
  range.setStartAfter(textNode)
  range.insertNode(spaceNode)
  range.setStartAfter(spaceNode)
  range.collapse(true)
  selection.removeAllRanges()
  selection.addRange(range)
}

export function replaceCurrentWordWithHeader(header: string) {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return

  const range = selection.getRangeAt(0)
  const node = range.startContainer

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || ""
    const offset = range.startOffset
    const beforeCaret = text.slice(0, offset)
    const afterCaret = text.slice(offset)

    const lastSpaceIndex = beforeCaret.lastIndexOf(" ")
    const wordStart = lastSpaceIndex === -1 ? 0 : lastSpaceIndex + 1
    const beforeWord = text.slice(0, wordStart)

    const headerText = `{${header}}`

    const beforeTextNode = document.createTextNode(beforeWord)
    const headerTextNode = document.createTextNode(headerText)
    const afterTextNode = document.createTextNode(" " + afterCaret)

    const parent = node.parentNode
    if (parent) {
      parent.insertBefore(beforeTextNode, node)
      parent.insertBefore(headerTextNode, node)
      parent.insertBefore(afterTextNode, node)
      parent.removeChild(node)

      const newRange = document.createRange()
      newRange.setStartAfter(afterTextNode)
      newRange.collapse(true)
      selection.removeAllRanges()
      selection.addRange(newRange)
    }
  }
}
