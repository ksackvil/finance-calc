function payment(ir, np, pv, fv, type) {
    /*
     * ir   - interest rate per month
     * np   - number of periods (months)
     * pv   - present value
     * fv   - future value
     * type - when the payments are due:
     *        0: end of the period, e.g. end of month (default)
     *        1: beginning of period
     */
    var pmt, pvif;

    fv || (fv = 0);
    type || (type = 0);

    if (ir === 0) return -(pv + fv) / np;

    pvif = Math.pow(1 + ir, np);
    pmt = (-ir * pv * (pvif + fv)) / (pvif - 1);

    if (type === 1) pmt /= 1 + ir;

    return pmt;
}

function futureValue(rate, nper, pmt, pv, type) {
    var pow = Math.pow(1 + rate, nper),
        fv;
    if (rate) {
        fv = (pmt * (1 + rate * type) * (1 - pow)) / rate - pv * pow;
    } else {
        fv = -1 * (pv + pmt * nper);
    }
    return fv;
}

/* ========== TESTING BELOW ========== */
// USER INPUTS
// var age = 25;
// var annualIncome = 75000;

// ASSUMED CONSTANTS
// const retireAge = 65;
// const inflation = 0.035;
// var annualRates = [0.04, 0.06, 0.08, 0.1];

// CALCULATED CONSTANTS
// const yrsTillRet = retireAge - age;
// const moTillRet = yrsTillRet * 12;

// // retirement income or future value
// var ri = FV(inflation, yrsTillRet, 0, annualIncome, 0);

// SAMPLE OUTPUT
// console.log(`Retirement Income: $${-1*ri.toFixed(2)}`);
// console.log('Monthly Savings:');

// for (rate of annualRates) {
//     var ms = PMT(rate/12, moTillRet, 1, ri*10, 0)
//     console.log(`@ ${rate*100}%: $${ms.toFixed(2)}`);
// }
/* ========== TESTING ABOVE ========== */

export { futureValue, payment };
