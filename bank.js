const Money = require('./money');

class Bank {
    constructor() {
        this.exchangeRate = new Map();
    }
    addExchangeRate(currencyFrom, currencyTo, rate) {
        let key = currencyFrom + "->" + currencyTo;
        this.exchangeRate.set(key, rate);
    }
    convert(money, currency) {
        if (money.currency === currency) {
            return new Money(money.amount, money.currency);
        }
        let key = money.currency + "->" + currency;
        let rate = this.exchangeRate.get(key);
        if (rate === undefined) {
            throw new Error(key);
        }
        return new Money(money.amount * rate, currency);
    }
}

module.exports = Bank;