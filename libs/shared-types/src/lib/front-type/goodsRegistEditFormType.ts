import { NestedValue } from 'react-hook-form';
import { GoodsOptionDto } from '../dto/goodsOption.dto';
import { RegistGoodsDto } from '../dto/registGoods.dto';

export type GoodsFormOption = Omit<GoodsOptionDto, 'default_option'> & {
  id?: number;
};

export type GoodsFormOptionsType = GoodsFormOption[];

export type GoodsFormValues = Omit<RegistGoodsDto, 'options'> & {
  id?: number;
  options: NestedValue<GoodsFormOptionsType>;
  pictures?: { file: File; filename: string; id: number }[];
  option_title: string; // 옵션명
  option_values: string; // 옵션값 (, 로 분리된 문자열)
  common_contents: string;
  common_contents_name?: string; // 공통 정보 이름
  common_contents_type: 'new' | 'load'; // 공통정보 신규 | 기존 불러오기
};

export type GoodsFormSubmitDataType = Omit<GoodsFormValues, 'options'> & {
  options: Omit<GoodsOptionDto, 'default_option'>[];
};
