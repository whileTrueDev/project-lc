import {
  Stack,
  Button,
  Text,
  Input,
  InputGroup,
  InputGroupProps,
  InputRightAddon,
  useBoolean,
  Divider,
  Select,
  Tag,
  TagCloseButton,
  TagLabel,
} from '@chakra-ui/react';
import { ShippingCost, ShippingSetFormData } from '@project-lc/shared-types';
import { useShippingSetItemStore } from '@project-lc/stores';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const KOREA_PROVINCES = [
  '강원도',
  '경기도',
  '경상남도',
  '경상북도',
  '광주광역시',
  '대구광역시',
  '대전광역시',
  '부산광역시',
  '서울특별시',
  '세종특별자치시',
  '울산광역시',
  '인천광역시',
  '전라남도',
  '전라북도',
  '제주특별자치도',
  '충청남도',
  '충청북도',
];

export function NumberInputWithSuffix({
  suffix,
  readOnly = false,
  ...rest
}: { suffix: string; readOnly?: boolean } & InputGroupProps) {
  return (
    <InputGroup {...rest}>
      <Input type="number" defaultValue={2500} readOnly={readOnly} />
      <InputRightAddon size="sm">{suffix}</InputRightAddon>
    </InputGroup>
  );
}

export function ShippingCostItem({
  onAdd,
  onDelete,
  item,
}: {
  onAdd?: () => void;
  onDelete?: () => void;
  item: ShippingCost;
}) {
  const { areaName, areaDetail } = item;
  const label = areaDetail ? `${areaName} (${areaDetail.length})` : areaName;
  return (
    <Stack direction="row" alignItems="center">
      {onAdd && <Button onClick={onAdd}>+</Button>}
      {onDelete && <Button onClick={onDelete}>-</Button>}
      <Button textAlign="center">{label}</Button>
      <NumberInputWithSuffix readOnly={!!onDelete} flex={1} suffix="₩" />
    </Stack>
  );
}

export function ShippingOptionListItem({
  onDelete,
  onAdd,
  suffix = '',
  label,
}: {
  onDelete?: () => void;
  onAdd?: () => void;
  suffix?: string;
  label?: {
    start?: string;
    end?: string;
  };
}) {
  const { deliveryLimit } = useShippingSetItemStore();
  const [selectValue, setSelectValue] = useState('');
  const [costItems, setCostItems] = useState<ShippingCost[]>([]);
  const [areaDetail, setAreaDetail] = useState<string[]>([]);
  const [areaName, setAreaName] = useState('지역');
  const [cost, setCost] = useState(0);
  const [open, { on, off, toggle }] = useBoolean();

  const costForm = useForm<{
    cost: number;
    areaName: string;
    areaDetail: string[];
    areaSelectValue: string;
  }>({
    defaultValues: {
      cost: 0,
      areaName: '지역',
      areaDetail: [],
      areaSelectValue: '',
    },
  });

  const addCostItem = () => {
    const tempId = costItems.length ? costItems[costItems.length - 1].tempId + 1 : 0;
    setCostItems((prev) => [...prev, { tempId, areaName, cost: 2345, areaDetail: [] }]);
  };
  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      borderRadius="lg"
      border="1px"
      borderColor="gray.200"
      p={2}
    >
      <Stack direction="row">
        {/* 삭제버튼 */}
        {onDelete && <Button onClick={onDelete}>-</Button>}
        {/* 추가버튼 */}
        {onAdd && <Button onClick={onAdd}>+</Button>}
        {/* 시작값 인풋 */}
        {label && label.start && (
          <Stack direction="column">
            <NumberInputWithSuffix suffix={suffix} />
            <Text textAlign="right">{label.start}</Text>
          </Stack>
        )}
        {/* 종료값 인풋 */}
        {label && label.end && (
          <Stack direction="column">
            <NumberInputWithSuffix suffix={suffix} />
            <Text textAlign="right">{label.end}</Text>
          </Stack>
        )}
      </Stack>

      {/* 지역별 배송비 */}

      {deliveryLimit === 'unlimit' ? (
        <Stack direction="row" alignItems="center">
          <Text flex={1} textAlign="center">
            대한민국
          </Text>
          <NumberInputWithSuffix flex={1} suffix="₩" />
        </Stack>
      ) : (
        <Stack>
          {/* 이미 입력된 배송비 */}
          <Stack className="addedShippingCostItems">
            {/* 이미 입력된 가격값은 수정 못하도록 해둠, 삭제만 가능  */}
            {costItems.map((item) => {
              return (
                <ShippingCostItem
                  key={item.tempId}
                  item={item}
                  onDelete={() => {
                    console.log(item.tempId);
                  }}
                />
              );
            })}
          </Stack>

          {/* 배송비 입력 폼 */}
          <Stack direction="row" alignItems="center">
            <Button onClick={addCostItem}>+</Button>
            <Button onClick={toggle} textAlign="center">
              {costForm.watch('areaName')}
              {costForm.watch('areaDetail') && `(${costForm.watch('areaDetail').length})`}
            </Button>

            <InputGroup>
              <Input {...costForm.register('cost')} type="number" />
              <InputRightAddon size="sm">₩</InputRightAddon>
            </InputGroup>
          </Stack>
          <Stack display={open ? 'block' : 'none'}>
            <Text>지역 그룹 명</Text>
            <Input {...costForm.register('areaName')} />
            <Divider />
            <Text>추가된 지역</Text>
            {areaDetail.map((area) => (
              <Tag key={area} borderRadius="full" variant="solid" colorScheme="green">
                <TagLabel>{area}</TagLabel>
                <TagCloseButton
                  onClick={() => setAreaDetail((prev) => prev.filter((a) => a !== area))}
                />
              </Tag>
            ))}
            <Divider />
            <Controller
              name="areaSelectValue"
              control={costForm.control}
              defaultValue="주문일"
              render={({ field: { onChange, ...rest } }) => (
                <Select
                  {...rest}
                  onChange={(e) => {
                    const key = e.currentTarget.value;
                    // 배송설정명 input 값도 같이 변경
                    onChange(e);
                  }}
                >
                  <option value="">지역 선택</option>
                  {KOREA_PROVINCES.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </Select>
              )}
            />
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
export default ShippingOptionListItem;
