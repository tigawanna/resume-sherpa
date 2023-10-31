import { copytoClipBoard } from '@/utils/helpers/copy-to-clipboard';
import { useWindowSize } from '@/utils/hooks/useWindowSize';
import Cherry from 'cherry-markdown/dist/cherry-markdown.core';
import { Copy, FileEdit, GalleryThumbnails, Printer, SplitSquareHorizontal } from 'lucide-react';
import { useEffect, useRef } from 'react';


interface CherryMarkdownEditorProps {
  input_string: string;
  custom_element?:(cherry: Cherry | null) => JSX.Element;
}

export default function CherryMarkdownEditor({
  input_string,
  custom_element
}: CherryMarkdownEditorProps) {
  const cherry = useRef<Cherry | null>(null);
  const { width } = useWindowSize();
  useEffect(() => {
    if (!cherry.current) {
      cherry.current = new Cherry({
        id: 'cherry-markdown',
        value: '',
        locale: 'en_US',
        editor: {
          // defaultModel The default mode of the editor after initialization. There are three modes: 1. Double column edit preview mode; 2. Pure editing mode; 3. Preview mode
          // edit&preview: Double column edit preview mode
          // editOnly: Pure editing mode (without preview, you can switch to double column or preview mode through toolbar)
          // previewOnly: Preview mode (there is no edit box, the toolbar only displays the "return to edit" button, which can be switched to edit mode through the toolbar)
          defaultModel: width > 850 ? 'edit&preview' : 'editOnly',
        },
      });
    }
  }, []);
  useEffect(() => {
    const html_as_markdwon = cherry.current?.engine.makeMarkdown(input_string);
    if (html_as_markdwon) {
      cherry.current?.setMarkdown(html_as_markdwon);
      // cherry.current?.setMarkdown(html_as_markdwon);
    }
  }, [cherry.current, input_string]);
  useEffect(() => {
    cherry.current?.switchModel(width > 850 ? 'edit&preview' : 'editOnly');
  }, [width]);

  function exportMarkdown() {
    cherry.current?.export('pdf', 'resume.md');
  }

  

  return (
    <div className="w-full h-full flex flex-col items-center justify-between gap-2 ">
      <div className="w-full flex gap-1 items-center justify-end sticky top-10 z-50">
        {custom_element&&custom_element(cherry?.current)}
        <button
          className="btn btn-outline btn-sm text-xs font-normal rounded-full hover:text-accent"
          about={'print content'}
          data-tip={'print content'}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            exportMarkdown();
          }}
        >
          <Printer className="w-5 h-5" />
        </button>
        <button
          className="btn btn-outline btn-sm text-xs font-normal rounded-full hover:text-accent"
          about={'copy to clipboard'}
          data-tip={'copy to clipboard'}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            const markdown = cherry.current?.getMarkdown();
            if (markdown) {
              copytoClipBoard(markdown);
            }
          }}
        >
          <Copy className="w-5 h-5" />
        </button>

        <button
          className="btn btn-outline btn-sm text-xs font-normal rounded-full hover:text-accent"
          type="button"
          about={'editor,preview split-view'}
          data-tip={'editor,preview split-view'}
          onClick={(e) => {
            e.stopPropagation();
            cherry.current?.switchModel('edit&preview');
          }}
        >
          <SplitSquareHorizontal className="h-5 w-5" />
        </button>

        <button
          className="btn btn-outline btn-sm text-xs font-normal hover:text-accent"
          type="button"
          data-tip="editor only view"
          about="editor only view"
          onClick={(e) => {
            e.stopPropagation();
            cherry.current?.switchModel('editOnly');
          }}
        >
          <FileEdit className="h-5 w-5" />
        </button>

        <button
          className="btn btn-outline btn-sm text-xs font-normal hover:text-accent"
          type="button"
          about="preview only view"
          data-tip="preview only view"
          onClick={(e) => {
            e.stopPropagation();
            cherry.current?.switchModel('previewOnly');
          }}
        >
          <GalleryThumbnails className="h-5 w-5" />
        </button>
      </div>
      <div id="cherry-markdown" className="w-full" />
    </div>
  );
}
