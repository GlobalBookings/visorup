export function fmtMoney(value) {
  return `£${Number(value).toFixed(2)}`;
}

export function fmtPercent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

export function fmtNumber(n) {
  return Number(n).toLocaleString('en-GB');
}
