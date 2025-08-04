export class TestService {
  constructor(private readonly value1: string) {}
  getTestValue() {
    return 'test'
  }
  getInjectValue() {
    return this.value1
  }
}