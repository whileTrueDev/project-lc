import SetOptions from 'suneditor-react/dist/types/SetOptions';

export const stepTemplate = {
  name: '이용방법 표 템플릿',
  html: `
<table class="se-table-layout-fixed">
  <tbody>
    <tr>
      <td>
        <div class="se-component se-image-container __se__float- __se__float-center" contenteditable="false">
          <figure style="margin: auto;">
            <img src="https://dummyimage.com/300x300/000/fff" alt="" data-proportion="true" data-align="center" data-file-name="fff" data-file-size="0" data-origin="," data-size="," data-rotate="" data-percentage="auto,auto" style="" data-index="1" data-rotatex="" data-rotatey="">
          </figure>
        </div>
      </td>
      <td>
        <div>1. ...</div>
      </td>
    </tr>
    <tr>
      <td>
        <div><br>
        </div>
      </td>
      <td>
        <div>2. ...</div>
      </td>
    </tr>
    <tr>
      <td>
        <div><br>
        </div>
      </td>
      <td>
        <div>3. ...</div>
      </td>
    </tr>
  </tbody>
</table>
  `,
};

export const AdminManualEditorSetOptions: SetOptions = {
  font: ['Gmarket Sans', 'Noto Sans KR', 'sans-serif'],
  defaultStyle: "font-family: 'Noto Sans Kr' , sans-serif; font-size: 1rem",
  height: '500px',
  imageMultipleFile: true,
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
    ['showBlocks', 'fullScreen', 'codeView', 'template'],
    ['preview'],
  ],
  templates: [stepTemplate],
};
