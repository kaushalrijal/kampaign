"use client";

import type React from "react";
import {
  useState,
  useRef,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Code,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ActiveState,
  runExecCommand,
  computeActiveState,
  toggleFormatBlock,
  saveSelection as utilsSaveSelection,
  restoreSelection as utilsRestoreSelection,
  getCaretCoordinates as utilsGetCaretCoordinates,
  getCurrentWord as utilsGetCurrentWord,
  insertHeaderAtCursor as utilsInsertHeaderAtCursor,
  replaceCurrentWordWithHeader as utilsReplaceCurrentWordWithHeader,
} from "@/lib/rich-text-utils";
import { useKampaignStore } from "@/lib/store/kampaign-store";

interface RichTextEditorProps {
  headers?: string[];
}

const SHORTCUTS = {
  bold: { key: "b", modifier: true, label: "⌘B" },
  italic: { key: "i", modifier: true, label: "⌘I" },
  underline: { key: "u", modifier: true, label: "⌘U" },
  strikethrough: { key: "s", modifier: true, shift: true, label: "⌘⇧S" },
  h1: { key: "1", modifier: true, alt: true, label: "⌘⌥1" },
  h2: { key: "2", modifier: true, alt: true, label: "⌘⌥2" },
  h3: { key: "3", modifier: true, alt: true, label: "⌘⌥3" },
  alignLeft: { key: "l", modifier: true, shift: true, label: "⌘⇧L" },
  alignCenter: { key: "e", modifier: true, label: "⌘E" },
  alignRight: { key: "r", modifier: true, shift: true, label: "⌘⇧R" },
  bulletList: { key: "8", modifier: true, shift: true, label: "⌘⇧8" },
  numberedList: { key: "7", modifier: true, shift: true, label: "⌘⇧7" },
  link: { key: "k", modifier: true, label: "⌘K" },
  code: { key: "`", modifier: true, shift: true, label: "⌘⇧`" },
} as const;

export interface RichTextEditorRef {
  insertHeader: (header: string) => void;
}

export const RichTextEditor = forwardRef<
  RichTextEditorRef,
  RichTextEditorProps
>(({ headers = [] }, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  // const [htmlOutput, setHtmlOutput] = useState("")
  const { htmlOutput, setHtmlOutput } = useKampaignStore();

  useEffect(() => {
    if (editorRef.current && htmlOutput) {
      editorRef.current.innerHTML = htmlOutput; // restore saved content
    }
  }, [htmlOutput]);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });
  const [currentWord, setCurrentWord] = useState("");
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);
  const [activeState, setActiveState] = useState<ActiveState>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    h1: false,
    h2: false,
    h3: false,
    alignLeft: false,
    alignCenter: false,
    alignRight: false,
    bulletList: false,
    numberedList: false,
    link: false,
    code: false,
  });

  const checkActiveState = useCallback(() => {
    if (!editorRef.current) return;
    const state = computeActiveState(editorRef.current);
    setActiveState(state);
  }, []);

  const updateOutput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setHtmlOutput(html);
    }
  }, []);

  const execCommand = useCallback(
    (command: string, value?: string) => {
      runExecCommand(command, value);
      editorRef.current?.focus();
      updateOutput();
      checkActiveState();
    },
    [updateOutput, checkActiveState]
  );

  const formatBlock = useCallback(
    (tag: string) => {
      if (editorRef.current) {
        toggleFormatBlock(editorRef.current, tag);
      }
      editorRef.current?.focus();
      updateOutput();
      checkActiveState();
    },
    [updateOutput, checkActiveState]
  );

  const saveSelection = useCallback(() => {
    setSavedSelection(utilsSaveSelection());
  }, []);

  const restoreSelection = useCallback(() => {
    utilsRestoreSelection(savedSelection);
  }, [savedSelection]);

  const toggleLink = useCallback(() => {
    if (activeState.link) {
      runExecCommand("unlink");
      editorRef.current?.focus();
      updateOutput();
      checkActiveState();
    } else {
      saveSelection();
      setLinkUrl("");
      setLinkDialogOpen(true);
    }
  }, [activeState.link, updateOutput, checkActiveState, saveSelection]);

  const handleLinkInsert = useCallback(() => {
    if (linkUrl) {
      restoreSelection();
      editorRef.current?.focus();
      setTimeout(() => {
        runExecCommand("createLink", linkUrl);
        updateOutput();
        checkActiveState();
      }, 10);
    }
    setLinkDialogOpen(false);
    setLinkUrl("");
    setSavedSelection(null);
  }, [linkUrl, restoreSelection, updateOutput, checkActiveState]);

  const handleLinkCancel = useCallback(() => {
    setLinkDialogOpen(false);
    setLinkUrl("");
    setSavedSelection(null);
    editorRef.current?.focus();
  }, []);

  const getCaretCoordinates = () => {
    if (!editorRef.current) return { top: 0, left: 0 };
    return utilsGetCaretCoordinates(editorRef.current);
  };

  const getCurrentWord = () => utilsGetCurrentWord();

  const handleInput = () => {
    const word = getCurrentWord();
    setCurrentWord(word);

    if (word === "{") {
      setSuggestions(headers);
      setCursorPosition(getCaretCoordinates());
      setShowSuggestions(true);
      setSuggestionIndex(0);
    } else if (word.startsWith("{") && word.length > 1) {
      const searchTerm = word.slice(1);
      const matches = headers.filter((header) =>
        header.toLowerCase().startsWith(searchTerm.toLowerCase())
      );

      if (matches.length > 0) {
        setSuggestions(matches);
        setCursorPosition(getCaretCoordinates());
        setShowSuggestions(true);
        setSuggestionIndex(0);
      } else {
        setShowSuggestions(false);
      }
    } else if (word.length >= 1) {
      const matches = headers.filter((header) =>
        header.toLowerCase().startsWith(word.toLowerCase())
      );

      if (matches.length > 0) {
        setSuggestions(matches);
        setCursorPosition(getCaretCoordinates());
        setShowSuggestions(true);
        setSuggestionIndex(0);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }

    updateOutput();
    checkActiveState();
  };

  const handleSelectionChange = useCallback(() => {
    checkActiveState();
  }, [checkActiveState]);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [handleSelectionChange]);

  const insertHeaderAtCursor = useCallback(
    (header: string) => {
      editorRef.current?.focus();
      if (editorRef.current) {
        utilsInsertHeaderAtCursor(editorRef.current, header);
      }
      setShowSuggestions(false);
      updateOutput();
    },
    [updateOutput]
  );

  const insertHeader = (header: string) => {
    utilsReplaceCurrentWordWithHeader(header);
    setShowSuggestions(false);
    updateOutput();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSuggestions) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSuggestionIndex((prev) => (prev + 1) % suggestions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSuggestionIndex(
          (prev) => (prev - 1 + suggestions.length) % suggestions.length
        );
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        insertHeader(suggestions[suggestionIndex]);
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
      }
      return;
    }

    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const modifier = isMac ? e.metaKey : e.ctrlKey;

    if (modifier && e.key.toLowerCase() === "b" && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      execCommand("bold");
      return;
    }
    if (modifier && e.key.toLowerCase() === "i" && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      execCommand("italic");
      return;
    }
    if (modifier && e.key.toLowerCase() === "u" && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      execCommand("underline");
      return;
    }
    if (modifier && e.shiftKey && e.key.toLowerCase() === "s" && !e.altKey) {
      e.preventDefault();
      execCommand("strikeThrough");
      return;
    }
    if (modifier && e.altKey && e.key === "1") {
      e.preventDefault();
      formatBlock("h1");
      return;
    }
    if (modifier && e.altKey && e.key === "2") {
      e.preventDefault();
      formatBlock("h2");
      return;
    }
    if (modifier && e.altKey && e.key === "3") {
      e.preventDefault();
      formatBlock("h3");
      return;
    }
    if (modifier && e.shiftKey && e.key.toLowerCase() === "l" && !e.altKey) {
      e.preventDefault();
      execCommand("justifyLeft");
      return;
    }
    if (modifier && !e.shiftKey && e.key.toLowerCase() === "e" && !e.altKey) {
      e.preventDefault();
      execCommand("justifyCenter");
      return;
    }
    if (modifier && e.shiftKey && e.key.toLowerCase() === "r" && !e.altKey) {
      e.preventDefault();
      execCommand("justifyRight");
      return;
    }
    if (modifier && e.shiftKey && e.key === "8") {
      e.preventDefault();
      execCommand("insertUnorderedList");
      return;
    }
    if (modifier && e.shiftKey && e.key === "7") {
      e.preventDefault();
      execCommand("insertOrderedList");
      return;
    }
    if (modifier && e.key.toLowerCase() === "k" && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      toggleLink();
      return;
    }
    if (modifier && e.shiftKey && (e.key === "`" || e.key === "~")) {
      e.preventDefault();
      formatBlock("pre");
      return;
    }
  };

  const ToolbarButton = ({
    onClick,
    children,
    label,
    shortcut,
    isActive = false,
  }: {
    onClick: () => void;
    children: React.ReactNode;
    label: string;
    shortcut: string;
    isActive?: boolean;
  }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          aria-label={label}
          aria-pressed={isActive}
          className={`p-2 transition-colors border border-transparent hover:border-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 ${
            isActive ? "bg-black text-white" : "hover:bg-black hover:text-white"
          }`}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className="bg-black text-white border-2 border-black rounded-none px-3 py-2 font-mono text-xs"
      >
        <span className="font-bold">{label}</span>
        <span className="ml-2 opacity-70">{shortcut}</span>
      </TooltipContent>
    </Tooltip>
  );

  useImperativeHandle(
    ref,
    () => ({
      insertHeader: insertHeaderAtCursor,
    }),
    [insertHeaderAtCursor]
  );

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div
          className="bg-neutral-200 border-2 border-black p-2 flex flex-wrap gap-1"
          role="toolbar"
          aria-label="Text formatting options"
        >
          <div
            className="flex border-r border-black pr-2 mr-2"
            role="group"
            aria-label="Text style"
          >
            <ToolbarButton
              onClick={() => execCommand("bold")}
              label="Bold"
              shortcut={SHORTCUTS.bold.label}
              isActive={activeState.bold}
            >
              <Bold size={18} aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => execCommand("italic")}
              label="Italic"
              shortcut={SHORTCUTS.italic.label}
              isActive={activeState.italic}
            >
              <Italic size={18} aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => execCommand("underline")}
              label="Underline"
              shortcut={SHORTCUTS.underline.label}
              isActive={activeState.underline}
            >
              <Underline size={18} aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => execCommand("strikeThrough")}
              label="Strikethrough"
              shortcut={SHORTCUTS.strikethrough.label}
              isActive={activeState.strikethrough}
            >
              <Strikethrough size={18} aria-hidden="true" />
            </ToolbarButton>
          </div>

          <div
            className="flex border-r border-black pr-2 mr-2"
            role="group"
            aria-label="Headings"
          >
            <ToolbarButton
              onClick={() => formatBlock("h1")}
              label="Heading 1"
              shortcut={SHORTCUTS.h1.label}
              isActive={activeState.h1}
            >
              <Heading1 size={18} aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => formatBlock("h2")}
              label="Heading 2"
              shortcut={SHORTCUTS.h2.label}
              isActive={activeState.h2}
            >
              <Heading2 size={18} aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => formatBlock("h3")}
              label="Heading 3"
              shortcut={SHORTCUTS.h3.label}
              isActive={activeState.h3}
            >
              <Heading3 size={18} aria-hidden="true" />
            </ToolbarButton>
          </div>

          <div
            className="flex border-r border-black pr-2 mr-2"
            role="group"
            aria-label="Text alignment"
          >
            <ToolbarButton
              onClick={() => execCommand("justifyLeft")}
              label="Align Left"
              shortcut={SHORTCUTS.alignLeft.label}
              isActive={activeState.alignLeft}
            >
              <AlignLeft size={18} aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => execCommand("justifyCenter")}
              label="Align Center"
              shortcut={SHORTCUTS.alignCenter.label}
              isActive={activeState.alignCenter}
            >
              <AlignCenter size={18} aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => execCommand("justifyRight")}
              label="Align Right"
              shortcut={SHORTCUTS.alignRight.label}
              isActive={activeState.alignRight}
            >
              <AlignRight size={18} aria-hidden="true" />
            </ToolbarButton>
          </div>

          <div
            className="flex border-r border-black pr-2 mr-2"
            role="group"
            aria-label="Lists"
          >
            <ToolbarButton
              onClick={() => execCommand("insertUnorderedList")}
              label="Bullet List"
              shortcut={SHORTCUTS.bulletList.label}
              isActive={activeState.bulletList}
            >
              <List size={18} aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => execCommand("insertOrderedList")}
              label="Numbered List"
              shortcut={SHORTCUTS.numberedList.label}
              isActive={activeState.numberedList}
            >
              <ListOrdered size={18} aria-hidden="true" />
            </ToolbarButton>
          </div>

          <div className="flex" role="group" aria-label="Insert">
            <ToolbarButton
              onClick={toggleLink}
              label={activeState.link ? "Remove Link" : "Insert Link"}
              shortcut={SHORTCUTS.link.label}
              isActive={activeState.link}
            >
              <Link size={18} aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => formatBlock("pre")}
              label="Code Block"
              shortcut={SHORTCUTS.code.label}
              isActive={activeState.code}
            >
              <Code size={18} aria-hidden="true" />
            </ToolbarButton>
          </div>
        </div>

        <div className="relative">
          <div
            ref={editorRef}
            contentEditable
            role="textbox"
            aria-labelledby="editor-label"
            aria-multiline="true"
            aria-describedby="editor-description"
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onBlur={updateOutput}
            onClick={checkActiveState}
            className="min-h-[300px] p-4 border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 
                [&_.header-token]:bg-black [&_.header-token]:text-white [&_.header-token]:px-2 [&_.header-token]:py-0.5 [&_.header-token]:font-mono [&_.header-token]:text-sm [&_.header-token]:rounded-none
                [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:my-4 [&_h1]:leading-tight
                [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:my-3 [&_h2]:leading-tight
                [&_h3]:text-xl [&_h3]:font-bold [&_h3]:my-2 [&_h3]:leading-tight
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2
                [&_li]:my-1
                [&_a]:text-black [&_a]:underline [&_a]:font-medium
                [&_pre]:bg-neutral-100 [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:border-2 [&_pre]:border-black [&_pre]:my-2 [&_pre]:overflow-x-auto"
            style={{ whiteSpace: "pre-wrap" }}
          />
          <p id="editor-description" className="sr-only">
            Rich text editor with formatting support. Use keyboard shortcuts or
            toolbar buttons to format text.
          </p>

          {showSuggestions && suggestions.length > 0 && (
            <div
              className="absolute z-10 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-w-[200px]"
              style={{ top: cursorPosition.top, left: cursorPosition.left }}
              role="listbox"
              aria-label="Header suggestions"
            >
              <div className="px-3 py-1 bg-neutral-200 border-b-2 border-black">
                <span className="text-xs font-bold tracking-wider uppercase">
                  HEADERS
                </span>
              </div>
              {suggestions.map((option, index) => (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={index === suggestionIndex}
                  onClick={() => insertHeader(option)}
                  className={`w-full px-3 py-2 text-left font-mono text-sm hover:bg-black hover:text-white transition-colors ${
                    index === suggestionIndex ? "bg-black text-white" : ""
                  }`}
                >
                  {"{" + option + "}"}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold tracking-wider uppercase">
              HTML OUTPUT
            </label>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(htmlOutput);
              }}
              className="px-3 py-1 text-xs font-bold tracking-wider uppercase border-2 border-black hover:bg-black hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1"
              aria-label="Copy HTML to clipboard"
            >
              COPY
            </button>
          </div>
          <pre className="p-4 bg-neutral-100 border-2 border-black font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all max-h-[200px] overflow-y-auto">
            {htmlOutput || "<p>Start typing to see HTML output...</p>"}
          </pre>
        </div>

        <Dialog
          open={linkDialogOpen}
          onOpenChange={(open) => !open && handleLinkCancel()}
        >
          <DialogContent className="border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-black uppercase tracking-tight">
                Insert Link
              </DialogTitle>
              <DialogDescription className="text-sm text-neutral-600 uppercase tracking-wide">
                Enter the URL for the hyperlink
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label
                  htmlFor="link-url"
                  className="text-xs font-bold uppercase tracking-widest"
                >
                  URL
                </Label>
                <Input
                  id="link-url"
                  type="url"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleLinkInsert();
                    }
                  }}
                  className="border-2 border-black rounded-none bg-neutral-100 font-mono text-sm focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black"
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-1">
              <Button
                type="button"
                variant="outline"
                onClick={handleLinkCancel}
                className="border-2 border-black rounded-none font-bold uppercase tracking-wide hover:bg-neutral-100 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleLinkInsert}
                disabled={!linkUrl}
                className="bg-black text-white rounded-none font-bold uppercase tracking-wide hover:bg-neutral-800 disabled:opacity-50"
              >
                Insert Link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
});

RichTextEditor.displayName = "RichTextEditor";
