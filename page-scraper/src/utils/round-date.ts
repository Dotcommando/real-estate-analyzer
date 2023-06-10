export function roundDate(dateToRound: Date): Date {
  return new Date(Date.UTC(dateToRound.getFullYear(), dateToRound.getMonth(), dateToRound.getDate()));
}
