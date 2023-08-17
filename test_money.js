const assert = require('assert');
const Money = require('./money');
const Portfolio = require('./portfolio');
const Bank = require('./bank');

class MoneyTest {
    constructor() {
        this.bank = new Bank();
        this.bank.addExchangeRate("EUR", "USD", 1.2);
        this.bank.addExchangeRate("USD", "KRW", 1100);
    }
    testMultiplication() {
        let tenEuros = new Money(10, "EUR");
        let twentyEuros = new Money(20, "EUR");
        assert.deepStrictEqual(tenEuros.times(2), twentyEuros)
    }
    testDivision() {
        let originalMoney = new Money(4002, "KRW");
        let expectedMoneyAfterDivision = new Money(1000.5, "KRW");
        assert.deepStrictEqual(originalMoney.divide(4), expectedMoneyAfterDivision);
    }
    testAddition() {
        let fiveDollar = new Money(5, "USD");
        let tenDollar = new Money(10, "USD");
        let fifteenDollar = new Money(15, "USD");
        let portfolio = new Portfolio();
        portfolio.add(fiveDollar, tenDollar);
        assert.deepStrictEqual(portfolio.evaluate(this.bank, "USD"), fifteenDollar);
    }
    testAdditionOfDollarAndEuros() {
        let fiveDollar = new Money(5, "USD");
        let tenEuros = new Money(10, "EUR");
        let portfolio = new Portfolio();
        portfolio.add(fiveDollar, tenEuros);
        let expectedValue = new Money(17, "USD");
        assert.deepStrictEqual(portfolio.evaluate(this.bank, "USD"), expectedValue);
    }
    testAdditionOfDollarAndWons() {
        let oneDollar = new Money(1, "USD");
        let elevenHundredWon = new Money(1100, "KRW");
        let portfolio = new Portfolio();
        portfolio.add(oneDollar, elevenHundredWon);
        let expectedValue = new Money(2200, "KRW");
        assert.deepStrictEqual(portfolio.evaluate(this.bank, "KRW"), expectedValue);
    }
    testAdditionWithMultipleMissingExchangeRate() {
        let oneDollar = new Money(1, "USD");
        let oneEuro = new Money(1, "EUR");
        let oneWon = new Money(1, "KRW");
        let portfolio = new Portfolio();
        portfolio.add(oneDollar, oneEuro, oneWon);
        let expectedError = new Error(
            "Missing exchange rate(s):[USD->Kalganid,EUR->Kalganid,KRW->Kalganid]"
        );
        assert.throws(() => portfolio.evaluate(this.bank, "Kalganid"), expectedError);
    }
    testConversion() {
        let bank = new Bank();
        bank.addExchangeRate("EUR", "USD", 1.2);
        let tenEuros = new Money(10, "EUR");
        assert.deepStrictEqual(
            bank.convert(tenEuros, "USD"), new Money(12, "USD"));
    }
    testConversionWithMissingExchangeRate() {
        let bank = new Bank();
        let tenEuros = new Money(10, "EUR");
        let expectedError = new Error("EUR->Kalganid");
        assert.throws(function() {bank.convert(tenEuros, "Kalganid")}, expectedError);
    }
    getAllTest() {
        let moneyPrototype = MoneyTest.prototype;
        let allProps = Object.getOwnPropertyNames(moneyPrototype);
        let testMethods = allProps.filter(p => {
            return typeof moneyPrototype[p] === 'function' && p.startsWith('test');
        });
        return testMethods;
    }
    runAllTest() {
        let testMethods = this.getAllTest();
        testMethods.forEach(m => {
            console.log("Running: %s()", m);
            let method = Reflect.get(this, m);
            try {
                Reflect.apply(method, this, []);
            } catch (e) {
                if (e instanceof assert.AssertionError) {
                    console.log(e);
                } else {
                    throw e;
                }
            }
        });
    }
}

new MoneyTest().runAllTest();