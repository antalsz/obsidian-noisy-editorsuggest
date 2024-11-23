import { App, Editor, MarkdownView, Notice, Plugin, EditorSuggest, TFile, EditorPosition, EditorSuggestTriggerInfo, EditorSuggestContext } from 'obsidian';

export default class NoisyPlugin extends Plugin {
	async onload() {
		this.registerEditorSuggest(new NoisyEditorSuggest(this));
	}

	onunload() {
    
	}
}

export class NoisyEditorSuggest extends EditorSuggest<string> {
  plugin: NoisyPlugin;

  constructor(plugin: NoisyPlugin) {
    super(plugin.app);
    this.plugin = plugin;
  }

  private log(fn: string, args: Readonly<{}>, info?: Readonly<{}> | undefined): void {
    if (info)
      console.log('[NoisyEditorSuggest]', fn, args, info);
    else
      console.log('[NoisyEditorSuggest]', fn, args);
  }

  onTrigger(cursor: EditorPosition, editor: Editor, file: TFile): EditorSuggestTriggerInfo | null {
    this.log('onTrigger', {cursor, editor, file});
    if (editor.getLine(cursor.line).contains('NOISY')) {
      return {
        start: editor.getCursor(),
        end: editor.getCursor(),
        query: editor.getLine(cursor.line)
      };
    } else {
      return null;
    }
  }

  getSuggestions(context: EditorSuggestContext): string[] {
    this.log('getSuggestions', {context});
    return ['lorem', 'ipsum', 'dolor', 'sit', 'amet'];
  }

  renderSuggestion(item: string, el: HTMLElement): void {
    this.log('renderSuggestion', {item, el});
    el.createSpan({text: item, attr: { style: 'color: red;' }});
  }

  selectSuggestion(item: string, evt: MouseEvent | KeyboardEvent): void {
    const currentView = this.plugin.app.workspace.getActiveViewOfType(MarkdownView);
    const editor = currentView?.editor;
    this.log('selectSuggestion', {item, evt}, {currentView, editor});
    if (!editor) return;
    editor.replaceRange(`**${item}**`, editor.getCursor());
  }
}
