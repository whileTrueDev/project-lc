import { parse } from 'node-html-parser';

/** htmlString[] 에서 <img> 태그 src[] 리턴  */
export function getImgSrcListFromHtmlStringList(htmlContentsList: string[]): string[] {
  return [].concat(
    ...htmlContentsList.map((content) => {
      const dom = parse(content);
      return Array.from(dom.querySelectorAll('img')).map((elem) =>
        elem.getAttribute('src'),
      );
    }),
  );
}
