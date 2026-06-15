export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string = 'USD'
  ) {
    if (amount < 0) {
      throw new Error('El monto no puede ser negativo');
    }
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('No se pueden sumar montos en diferentes monedas');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('No se pueden restar montos en diferentes monedas');
    }
    return new Money(this.amount - other.amount, this.currency);
  }

  multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency);
  }

  divide(divisor: number): Money {
    if (divisor === 0) {
      throw new Error('No se puede dividir entre cero');
    }
    return new Money(this.amount / divisor, this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  toString(): string {
    return `${this.currency} ${this.amount.toFixed(2)}`;
  }
}
