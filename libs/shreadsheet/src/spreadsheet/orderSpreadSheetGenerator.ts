import { OrderItem, OrderItemOption, OrderShipping } from '@prisma/client';
import { getOrderStatusKrString, OrderDetailRes } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { CellObject, ColInfo, Range, RowInfo, WorkBook, WorkSheet } from 'xlsx';
import { SpreadSheetGenerator } from './spreadSheetGenerator';

export interface OrderSpreadSheetColumnOption {
  type: '주문정보' | '상품정보';
  headerName: string;
  getValue: (
    order: OrderDetailRes,
    ship?: OrderShipping & { items: (OrderItem & { options: OrderItemOption[] })[] },
    item?: OrderItem & { options: OrderItemOption[] },
    itemOption?: OrderItemOption,
  ) => string | number | null | undefined;
  mergeable?: boolean;
}

export const defaultColumOpts: OrderSpreadSheetColumnOption[] = [
  {
    type: '주문정보',
    headerName: '주문번호',
    getValue: (order) => order.orderCode,
    mergeable: true,
  },
  {
    type: '주문정보',
    headerName: '주문일',
    getValue: (order) => dayjs(new Date(order.createDate)).format('YYYY/MM/DD HH:mm:ss'),
    mergeable: true,
  },
  {
    type: '주문정보',
    headerName: '주문자',
    getValue: (order) => order.ordererName,
    mergeable: true,
  },
  {
    type: '주문정보',
    headerName: '주문자연락처',
    getValue: (order) => order.ordererPhone,
    mergeable: true,
  },
  {
    type: '주문정보',
    headerName: '주문자휴대폰',
    getValue: (order) => order.ordererPhone,
    mergeable: true,
  },
  {
    type: '주문정보',
    headerName: '주문자이메일',
    getValue: (order) => order.ordererEmail,
    mergeable: true,
  },
  {
    type: '주문정보',
    headerName: '수령인',
    getValue: (order) => order.recipientName,
    mergeable: true,
  },
  {
    type: '주문정보',
    headerName: '수령인연락처',
    getValue: (order) => order.recipientPhone,
    mergeable: true,
  },
  {
    type: '주문정보',
    headerName: '수령인휴대폰',
    getValue: (order) => order.recipientPhone,
    mergeable: true,
  },
  {
    type: '주문정보',
    headerName: '수령인이메일',
    getValue: (order) => order.recipientEmail,
    mergeable: true,
  },
  {
    type: '주문정보',
    headerName: '우편번호',
    getValue: (order) => order.recipientPostalCode,
    mergeable: true,
  },
  {
    type: '주문정보',
    headerName: '주소(도로명)',
    getValue: (order) => `${order.recipientAddress} ${order.recipientDetailAddress}`,
    mergeable: true,
  },
  // 현재 저장하는 주소가 도로명밖에 없어서 지번은 주석처리 220615 joni
  // {
  //   type: '주문정보',
  //   headerName: '주소(지번)',
  //   getValue: (order) => `${order.recipientAddress} ${order.recipientDetailAddress}`,
  //   mergeable: true,
  // },
  {
    type: '주문정보',
    headerName: '배송메시지',
    getValue: (order) => order.memo || '-',
    mergeable: true,
  },
  {
    type: '주문정보',
    headerName: '배송비',
    getValue: (order) =>
      order.shippings
        ?.map((shipping) => shipping.shippingCost)
        .reduce((sum, cur) => sum + Number(cur), 0),
    mergeable: true,
  },
  {
    type: '상품정보',
    headerName: '상품고유번호',
    getValue: (_, __, item) => item?.goodsId,
  },
  {
    type: '상품정보',
    headerName: '상품명',
    getValue: (_, __, ___, opt) => opt?.goodsName,
  },
  {
    type: '상품정보',
    headerName: '옵션',
    getValue: (_, __, ___, opt) => {
      if (opt?.name) {
        return `${opt.name}: ${opt.value}`;
      }
      return '기본옵션';
    },
  },
  {
    type: '상품정보',
    headerName: '상태',
    getValue: (_, __, ___, opt) => (opt ? getOrderStatusKrString(opt.step) : '-'),
  },
  {
    type: '상품정보',
    headerName: '수량',
    getValue: (_, __, ___, opt) => opt?.quantity,
  },
  {
    type: '상품정보',
    headerName: '판매가',
    getValue: (_, __, ___, opt) => {
      const price = Number(opt?.discountPrice);
      return price;
    },
  },
  {
    type: '상품정보',
    headerName: '판매가x수량',
    getValue: (_, __, ___, opt) => Number(opt?.discountPrice) * Number(opt?.quantity),
  },
];

interface OrderSpreadSheetGeneratorOptions {
  sheetName?: string;
  columns?: OrderSpreadSheetColumnOption[];
  additionalColumns?: OrderSpreadSheetColumnOption[];
  disabledColumnHeaders?: Array<string>;
}

export class OrderSpreadSheetGenerator extends SpreadSheetGenerator<OrderDetailRes> {
  private columns: OrderSpreadSheetColumnOption[];

  constructor(private opts?: OrderSpreadSheetGeneratorOptions) {
    super();
    this.columns = opts?.columns || defaultColumOpts;
    if (opts?.additionalColumns) {
      this.columns = this.columns.concat(opts?.additionalColumns);
    }
    if (opts?.disabledColumnHeaders) {
      this.columns = this.columns.filter(
        ({ headerName }) => !opts?.disabledColumnHeaders?.includes(headerName),
      );
    }
  }

  protected getSheetRef(orders: OrderDetailRes[]): string {
    const lengthOfRows = orders.reduce((prev, curr) => {
      let num = 0;
      curr.shippings?.forEach((ship: any) => {
        ship.items.forEach((item: any) => {
          item.options.forEach(() => {
            num += 1;
          });
        });
      });
      return prev + num;
    }, 1);

    const col = this.getColAlphabet(this.columns.length); // length of columns that you need

    return `A1:${col}${lengthOfRows}`;
  }

  protected createSheet(orders: OrderDetailRes[]): WorkSheet {
    const sheet: WorkSheet = { '!ref': this.getSheetRef(orders) };
    // headers
    this.columns.forEach((field, fieldIdx) => {
      const cell: CellObject = { t: 's', v: field.headerName };
      sheet[`${this.getColAlphabet(fieldIdx)}1`] = cell;
    });

    // data
    let rowIdx = 2; // 1번 행은 header이므로, 2번 행부터 시작
    const cols: ColInfo[] = [];
    const merges: Range[] = [];
    orders.forEach((order) => {
      // 이 주문에 포함된 주문상품옵션 전체 목록
      const totalOrderItemOptionList = order.orderItems.flatMap((oi) => oi.options);
      // 셀병합위해 사용할 주문상품옵션 순회 인덱스(해당 주문에 포함된 주문상품옵션 중 마지막 값인지 확인하기 위한 용도)
      let orderItemOptionIndex = 0;

      // 주문에 포함된 배송비별로 주문상품표시
      order.shippings?.forEach((ship) => {
        // 현재 배송비에 포함된 상품id 목록
        const shipItemIdList = ship.items.map((item) => item.id);
        // 주문상품 중 현재 배송비와 연결된 상품들
        const shippingOrderItems = order.orderItems.filter((oi) =>
          shipItemIdList.includes(oi.id),
        );
        shippingOrderItems.forEach((item) => {
          item.options.forEach((opt) => {
            this.columns.forEach((field, fieldIdx) => {
              // 셀에 넣을 데이터 가져오기
              const v = field.getValue(order, ship, item, opt);
              // 데이터 설정
              sheet[`${this.getColAlphabet(fieldIdx)}${rowIdx}`] = {
                v,
                t: this.getValueTypeString(v),
              };
              // 컬럼 설정
              let colWidth = typeof v === 'string' ? v.length + 10 : 10;
              if (field.headerName.includes('주소')) colWidth += 5;
              let wch = colWidth;
              const currentCol = cols[fieldIdx];
              if (currentCol) {
                wch =
                  (colWidth > Number(currentCol.wch) ? colWidth : currentCol.wch) ||
                  colWidth;
              }
              cols[fieldIdx] = { wch };

              // 셀 병합 설정
              // 주문에 포함된 주문상품옵션 중 마지막 주문상품옵션인지 확인하여 마지막인경우 셀병합 추가
              if (
                orderItemOptionIndex > 0 &&
                orderItemOptionIndex === totalOrderItemOptionList.length - 1
              ) {
                if (field.mergeable) {
                  merges.push({
                    s: { c: fieldIdx, r: rowIdx - totalOrderItemOptionList.length },
                    e: { c: fieldIdx, r: rowIdx - 1 },
                  });
                }
              }
            });

            // 다음 행을 넣기 위해 행인덱스 + 1
            rowIdx += 1;
            // 주문상품옵션 순회 인덱스 증가(셀병합위해 사용)
            orderItemOptionIndex += 1;
          });
        });
      });
    });

    // set !cols
    sheet['!cols'] = cols;

    // set !rows
    const rows: RowInfo[] = new Array(rowIdx).fill({ hpx: 20 });
    rows[0] = { hpx: 30 }; // header는 높이를 더 넓게
    sheet['!rows'] = rows;

    // merge rows and columns
    sheet['!merges'] = merges;
    return sheet;
  }

  public createXLSX(orders: OrderDetailRes[]): WorkBook {
    const sheet = this.createSheet(orders);

    const wb: WorkBook = {
      SheetNames: [this.opts?.sheetName || '크크쇼주문'],
      Sheets: {
        [this.opts?.sheetName || '크크쇼주문']: {
          ...sheet,
          '!type': 'sheet',
        },
      },
    };

    return wb;
  }
}
