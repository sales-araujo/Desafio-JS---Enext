export function convertMilesToKm(milesPerHours){
  const kmHr = 1.60934;
  return String(kmHr * milesPerHours);
}

export function formatDate(date){
  const dateFormatted = new Intl.DateTimeFormat('pt-BR', 
  { dateStyle: 'short' }
  ).format(date);
  
  return dateFormatted
}

