import { ChartTypesModule } from './chart-types.module';

describe('ChartTypesModule', () => {
  let chartTypesModule: ChartTypesModule;

  beforeEach(() => {
    chartTypesModule = new ChartTypesModule();
  });

  it('should create an instance', () => {
    expect(chartTypesModule).toBeTruthy();
  });
});
