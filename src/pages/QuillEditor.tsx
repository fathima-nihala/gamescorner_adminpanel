import { forwardRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './QuillEditor.css';

interface QuillEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const QuillEditor = forwardRef<ReactQuill, QuillEditorProps>((props, ref) => {
    const { value, onChange, placeholder, className } = props;

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'clean']
        ]
    };

    return (
        <div className={`quill-wrapper ${className}`}>
            <ReactQuill
                ref={ref}
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                placeholder={placeholder}
                className="md:h-60 text-gray-700 dark:text-white [&_.ql-editor.ql-blank::before]:text-black [&_.ql-editor.ql-blank::before]:dark:text-white"
            />
        </div>
    );
});

QuillEditor.displayName = 'QuillEditor';

export default QuillEditor;
