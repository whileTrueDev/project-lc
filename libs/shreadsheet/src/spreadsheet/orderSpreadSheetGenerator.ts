import { getOrderStatusKrString } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { WorkBook, WorkSheet, CellObject, ColInfo, RowInfo, Range } from 'xlsx';
import { SpreadSheetGenerator } from './spreadSheetGenerator';

export interface OrderSpreadSheetColumnOption {
  type: '주문정보' | '상품정보';
  headerName: string;
  getValue: (
    order: any,
    ship?: any,
    item?: any,
    itemOption?: any,
  ) => string | number | null | undefined;
  mergeable?: boolean;
}

export const defaultColumOpts: OrderSpreadSheetColumnOption[] = [
  {
    type: '주문정보',
    headerName: '주문번호',
    getValue: (order) => order.order_seq,
    mergeable: true,
  },
  {
    type: '주문정보',
    headerName: '주문일',
    getValue: (order) => dayjs(new Date(order.regist_date)).format('YYYY/MM/DD HH:mm:ss'),
    mergeable: true,
  },
  {
    type: '주문정보',
    headerName: '주문자',
    getValue: (order) => order.order_user_name,
    mergeable: true,
  },
  {
    type: '주문정보',
    headerName: '주문자연락처',
    getValue: (order) => order.order_phone,
    mergeable: true,
  },
  {
    type: '주문정보',
    headerName: '주문자휴대폰',
    getValue: (order) => order.order_cellphone,
    mergeable: true,
  },
  {
    type: '주문정보',
    headerName: '주문자이메일',
    getValue: (order) => order.order_email,
    mergeable: true,
  },
  {
    type: '주문정보',
    headerName: '수령인',
    getValue: (order) => order.recipient_user_name,
    mergeable: true,
  },
  {
    type: '주문정보',
    headerName: '수령인연락처',
    getValue: (order) => order.recipient_phone,
    mergeable: true,
  },
  {
    type: '주문정보',
    headerName: '수령인휴대폰',
    getValue: (order) => order.recipient_cellphone,
    mergeable: true,
  },
  {
    type: '주문정보',
    headerName: '수령인이메일',
    getValue: (order) => order.recipient_email,
    mergeable: true,
  },
  {
    type: '주문정보',
    headerName: '우편번호',
    getValue: (order) => order.recipient_zipcode,
    mergeable: true,
  },
  {
    type: '주문정보',
    headerName: '주소(도로명)',
    getValue: (order) =>
      `${order.recipient_address_street} ${order.recipient_address_detail}`,
    mergeable: true,
  },
  {
    type: '주문정보',
    headerName: '주소(지번)',
    getValue: (order) => `${order.recipient_address} ${order.recipient_address_detail}`,
    mergeable: true,
  },
  {
    type: '주문정보',
    headerName: '배송메시지',
    getValue: (order) => order.memo || '-',
    mergeable: true,
  },
  {
    type: '주문정보',
    headerName: '배송비',
    getValue: (order) => order.totalShippingCost,
    mergeable: true,
  },
  {
    type: '상품정보',
    headerName: '상품고유번호',
    getValue: (_, __, item) => item?.goods_seq,
  },
  {
    type: '상품정보',
    headerName: '상품명',
    getValue: (_, __, item) => item?.goods_name,
  },
  {
    type: '상품정보',
    headerName: '옵션',
    getValue: (_, __, ___, opt) => {
      if (opt?.title1) {
        return `${opt.title1}: ${opt.option1}`;
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
    getValue: (_, __, ___, opt) => opt?.ea,
  },
  {
    type: '상품정보',
    headerName: '판매가',
    getValue: (_, __, ___, opt) => {
      const price = Number(opt?.price);
      return price - Number(opt?.member_sale) - Number(opt?.mobile_sale);
    },
  },
  {
    type: '상품정보',
    headerName: '판매가x수량',
    getValue: (_, __, ___, opt) => Number(opt?.price) * Number(opt?.ea),
  },
];

interface OrderSpreadSheetGeneratorOptions {
  sheetName?: string;
  columns?: OrderSpreadSheetColumnOption[];
  additionalColumns?: OrderSpreadSheetColumnOption[];
  disabledColumnHeaders?: Array<string>;
}

export class OrderSpreadSheetGenerator extends SpreadSheetGenerator<any> {
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

  protected getSheetRef(orders: any[]): string {
    const lengthOfRows = orders.reduce((prev, curr) => {
      let num = 0;
      curr.shippings.forEach((ship: any) => {
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

  protected createSheet(orders: any[]): WorkSheet {
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
      order.shippings.forEach((ship: any) => {
        ship.items.forEach((item: any) => {
          item.options.forEach((opt: any, optIdx: any) => {
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
              if (optIdx > 0 && optIdx === item.options.length - 1) {
                if (field.mergeable) {
                  merges.push({
                    s: { c: fieldIdx, r: rowIdx - item.options.length },
                    e: { c: fieldIdx, r: rowIdx - 1 },
                  });
                }
              }
            });

            // 다음 행을 넣기 위해 행인덱스 + 1
            rowIdx += 1;
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

  public createXLSX(orders: any[]): WorkBook {
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
