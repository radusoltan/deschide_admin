import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export const ArticleEditor = ({field, initialValue, onEdit})=>{
  const editorRef = useRef(null);


  return (
      <>
        <Editor
            tinymceScriptSrc={'http://localhost:3000' + '/tinymce/tinymce.min.js'}
            onInit={(evt, editor) => editorRef.current = editor}
            initialValue={initialValue}
            onEditorChange={({newValue, editor})=>{
              onEdit(editorRef.current.getContent());
            }}
            init={{
              license_key: 'gpl',
              apiKey: 'aywo416v6fszmnbeapee6mhh1rusgyfzjbdetttu6qydo8pu',
              height: field==='lead' ? 150 : 500,
              menubar: false,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks |' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help |'+
                  'image',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
        />
      </>
  );
}