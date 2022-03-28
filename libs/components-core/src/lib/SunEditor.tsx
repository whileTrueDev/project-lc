import { Center, Spinner } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { MutableRefObject, useRef } from 'react';
import { SunEditorReactProps } from 'suneditor-react/dist/types/SunEditorReactProps';
import 'suneditor/dist/css/suneditor.min.css';
import SunEditorCore from 'suneditor/src/lib/core';

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
  loading: () => (
    <Center>
      <Spinner />
    </Center>
  ),
});
export function useSunEditorRef(): MutableRefObject<SunEditorCore | null> {
  return useRef<SunEditorCore | null>(null);
}
export function SunEditorWrapper(
  props: SunEditorReactProps & { sunEditorRef: MutableRefObject<SunEditorCore | null> },
): JSX.Element {
  const { sunEditorRef, ...rest } = props;
  const getSunEditorInstance = (sunEditor: SunEditorCore): void => {
    sunEditorRef.current = sunEditor;
  };
  return <SunEditor getSunEditorInstance={getSunEditorInstance} lang="ko" {...rest} />;
}
