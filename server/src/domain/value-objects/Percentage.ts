export class Percentage {
  constructor(public readonly value: number) {
    if (value < 0 || value > 100) {
      throw new Error('El porcentaje debe estar entre 0 y 100');
    }
  }

  asDecimal(): number {
    return this.value / 100;
  }

  toString(): string {
    return `${this.value}%`;
  }
}
