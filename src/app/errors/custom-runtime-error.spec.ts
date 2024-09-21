import { CustomRuntimeError } from './custom-runtime-error';

describe('CustomRuntimeError', () => {
  it('should create an instance', () => {
    expect(new CustomRuntimeError()).toBeTruthy();
  });
});
