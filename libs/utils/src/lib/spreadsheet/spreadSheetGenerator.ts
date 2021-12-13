import { WorkBook, WorkSheet, writeFile, writeFileAsync } from 'xlsx';

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

  private checkFileName(fileName: string): string {
    if (fileName.includes('.')) {
      const [file, ext] = fileName.split('.');
      if (ext === 'xlsx') {
        return fileName;
      }
      return `${file}.xlsx`;
    }
    return `${fileName}.xlsx`;
  }

  public async download(fileName: string, workBook: WorkBook): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        writeFile(workBook, this.checkFileName(fileName), {
          Props: {
            Company: 'WhileTrue',
            Author: '크크쇼',
            CreatedDate: new Date(),
          },
        });
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }
}
