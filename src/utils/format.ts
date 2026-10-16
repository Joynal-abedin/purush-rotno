const banglaDigits: { [key: string]: string } = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

export function toBanglaNumber(val: number | string): string {
  if (val === undefined || val === null) return '০';
  const str = typeof val === 'number' ? val.toLocaleString('en-US') : String(val);
  return str.replace(/\d/g, (d) => banglaDigits[d] || d);
}

export function formatBanglaDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;

    const banglaMonths = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];

    const day = toBanglaNumber(d.getDate());
    const month = banglaMonths[d.getMonth()];
    const year = toBanglaNumber(d.getFullYear());

    let hours = d.getHours();
    const minutes = toBanglaNumber(String(d.getMinutes()).padStart(2, '0'));
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const banglaHours = toBanglaNumber(hours);

    return `${day} ${month} ${year}, ${banglaHours}:${minutes} ${ampm}`;
  } catch {
    return isoString;
  }
}
