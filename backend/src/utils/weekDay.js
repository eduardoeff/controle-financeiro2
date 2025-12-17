// src/utils/weekDay.js
function getWeekDay(dateStr) {
  // dateStr no formato YYYY-MM-DD
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) {
    return '';
  }

  const opts = { weekday: 'short' }; // seg, ter, qua...
  let wd = d.toLocaleDateString('pt-BR', opts);

  wd = wd.charAt(0).toUpperCase() + wd.slice(1);

  return wd;
}

module.exports = {
  getWeekDay,
};