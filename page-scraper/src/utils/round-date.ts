export function roundDate(dateToRound: Date): Date {
  return new Date(dateToRound.getFullYear(), dateToRound.getMonth(), dateToRound.getDate());
}
