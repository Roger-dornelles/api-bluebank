const FormatDate = () => {
  let date = new Date();
  let day = date.getDate();
  let month = (date.getMonth() + 1);
  let year = date.getFullYear();

  let dateFormat = `${day}/${month}/${year}`;

  let monthFormat = '';
  switch (month) {
    case 1:
      monthFormat = 'Janeiro';
    break;
    case 2:
      monthFormat = 'Fevereiro';
    break;
    case 3:
      monthFormat = 'Março';
    break;
    case 4:
      monthFormat = 'Abril';
    break;
    case 5:
      monthFormat = 'Maio';
    break;
    case 6:
      monthFormat = 'Junho';
    break;
    case 7:
      monthFormat = 'Julho';
    break;
    case 8:
      monthFormat = 'Agosto';
    break;
    case 9:
      monthFormat = 'Setembro';
    break;
    case 10:
      monthFormat = 'Outubro';
    break;
    case 11:
      monthFormat = 'Novembro';
    break;
    case 12:
      monthFormat = 'Dezembro';
    break;

  }
  return {dateFormat,monthFormat,year};
};
module.exports = FormatDate;

