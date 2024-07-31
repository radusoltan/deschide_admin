import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export const ArticleEditor = ({field, initialValue, onEdit, images})=> {
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      onEdit(editorRef.current.getContent());
    }
  };


  return <>
    <Editor
        tinymceScriptSrc={process.env.REACT_APP_URL_EDITOR + '/tinymce/tinymce.min.js'}
        onInit={(evt, editor) => editorRef.current = editor}
        initialValue={initialValue}
        onEditorChange={({newValue, editor})=>{
          onEdit(editorRef.current.getContent());
        }}
        init={{
          license_key: 'gpl',
          apiKey: 'aywo416v6fszmnbeapee6mhh1rusgyfzjbdetttu6qydo8pu',
          height: field==='lead' ? 250 : 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'code','lists', 'link', 'image', 'charmap',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
          ],
          image_advtab: true,
          image_list: images?.map(image=>({
            title: image.name,
            value: process.env.REACT_APP_URL+image.path+image.name
          })),
          toolbar: 'undo redo | blocks |' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help |'+
              'image | code | blockquote | link',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        }}

    />
  </>
}