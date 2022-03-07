import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  healthCheck(): string {
    return 'alive';
  }

  // TODO 테스트용. 삭제 필요 by hwasurr
  @Get('main-data')
  mainData(): any {
    return {
      avatar: new Date().toLocaleString(),
    };
  }
}
