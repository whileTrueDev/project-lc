import { WorkBook, WorkSheet, writeFile } from 'xlsx';

export abstract class SpreadSheetGenerator<T> {
  // eslint-disable-next-line prettier/prettier
  protected alphabets = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  protected getColAlphabet(idx: number): string {
    const l = this.alphabets.length;
    if (idx >= l) {
      const firstIdx = Math.floor(idx / l) - 1;
      const endIdx = idx % l;
      return this.alphabets[firstIdx] + this.alphabets[endIdx];
    }
    return this.alphabets[idx];
  }

  protected getValueTypeString(v: string | number): 's' | 'n' {
    switch (typeof v) {
      case 'number':
        return 'n';
      default:
        return 's';
    }
  }

  protected abstract getSheetRef(data: T[]): string;
  protected abstract createSheet(data: T[]): WorkSheet;
  public abstract createXLSX(data: T[]): WorkBook;

  public checkFileName(fileName: string): string {
    if (fileName.includes('.xlsx')) return fileName;
    return `${fileName}.xlsx`;
  }

  public async download(fileName: string, workBook: WorkBook): Promise<boolean> {
    await writeFile(workBook, this.checkFileName(fileName), {
      Props: {
        Company: 'WhileTrue',
        Author: '크크쇼',
        CreatedDate: new Date(),
      },
    });
    return true;
  }
}
