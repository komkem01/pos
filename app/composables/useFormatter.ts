export function useFormatter() {
  function currency(amount: number): string {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  function number(amount: number): string {
    return new Intl.NumberFormat('th-TH').format(amount)
  }

  function date(dateStr: string): string {
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateStr))
  }

  function time(dateStr: string): string {
    return new Intl.DateTimeFormat('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateStr))
  }

  function datetime(dateStr: string): string {
    return `${date(dateStr)} ${time(dateStr)}`
  }

  return { currency, number, date, time, datetime }
}
