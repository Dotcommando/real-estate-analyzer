export function processDistrict(originDistrict: string): string | null {
  if (!originDistrict) {
    return null;
  }

  let district = originDistrict
    .replace(
      /Timiou Prodromou\s+Mesa Geitonias/g,
      'Mesa Geitonia',
    );

  if (/\s+-\s+/.test(district)) {
    district = district.split(/\s+-\s+/)[1];
  }

  district = district.replace(/ Tourist Area/g, '');

  district = district
    .replace(/Ag /g, 'Ag. ')
    .replace(/Agios /g, 'Ag. ')
    .replace(/Agia /g, 'Ag. ')
    .replace(/Apostolos /g, 'Ap. ')
    .replace(/Ap /g, 'Ap. ')
    .replace(/Panag /g, 'Panag. ');

  district = district.replace(/\((.*?)\)/g, ' - $1');

  return district
    .replace(
      /^(Makarios III|Arch Makarios III)$/,
      'Arch. Makarios III',
    );
}
