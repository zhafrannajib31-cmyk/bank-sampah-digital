import { depositTotals, lineTotalOf } from './deposit-totals';

describe('depositTotals', () => {
  it('multiplies actual weight by price snapshot exactly, without float drift', () => {
    expect(lineTotalOf({ actualWeight: '0.1', unitPriceSnapshot: '0.2' }).toString()).toBe('0.02');
    expect(lineTotalOf({ actualWeight: '2.250', unitPriceSnapshot: '4000.00' }).toFixed(2)).toBe('9000.00');
  });

  it('sums every line and every weight', () => {
    const totals = depositTotals([
      { actualWeight: '2.250', unitPriceSnapshot: '4000.00' },
      { actualWeight: '1.500', unitPriceSnapshot: '8000.00' },
      { actualWeight: '0.335', unitPriceSnapshot: '3500.00' },
    ]);

    expect(totals.totalWeight.toFixed(3)).toBe('4.085');
    expect(totals.totalValue.toFixed(2)).toBe('22172.50');
  });

  it('treats missing weight or price as zero', () => {
    const totals = depositTotals([{ actualWeight: null, unitPriceSnapshot: null }]);

    expect(totals.totalWeight.toFixed(3)).toBe('0.000');
    expect(totals.totalValue.toFixed(2)).toBe('0.00');
  });
});
