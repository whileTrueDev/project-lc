import SetOptions from 'suneditor-react/dist/types/SetOptions';

export const AdminManualEditorSetOptions: SetOptions = {
  font: ['Gmarket Sans', 'Noto Sans KR', 'sans-serif'],
  defaultStyle:
    "font-family: 'Noto Sans Kr' , sans-serif; font-size: 1rem; list-style-type: decimal;",
  height: '500px',
  buttonList: [
    ['undo', 'redo'],
    ['font', 'fontSize', 'fontColor'],
    [
      'formatBlock',
      'paragraphStyle',
      'blockquote',
      'bold',
      'underline',
      'italic',
      'strike',
    ],
    ['fontColor', 'hiliteColor', 'textStyle', 'removeFormat'],
    '/',
    ['outdent', 'indent', 'align'],
    ['horizontalRule', 'list', 'table'],
    ['image', 'video', 'link'],
    ['showBlocks', 'fullScreen', 'codeView'],
    ['preview'],
  ],
};
