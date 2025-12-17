// src/utils/weekDay.js
const days = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado'
];

function getWeekDay(dateString) {
  const d = new Date(dateString);
  const dayIndex = d.getDay();
  return days[dayIndex];
}

module.exports = { getWeekDay };