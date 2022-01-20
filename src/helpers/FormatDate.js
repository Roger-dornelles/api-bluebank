const FormatDate = (month)=>{
    let newMonth = '';

    switch (month) {
        case 1:
            newMonth = 'Janeiro';
        break;
        case 2:
            newMonth = 'Fevereiro';
        break;
        case 3:
            newMonth = 'Março';
        break;
        case 4:
            newMonth = 'Abril';
        break;
        case 5:
            newMonth = 'Maio';
        break;
        case 6:
            monthFormat = 'Junho';
        break;
        case 7:
            newMonth = 'Julho';
        break;
        case 8:
            newMonth = 'Agosto';
        break;
        case 9:
            newMonth = 'Setembro';
        break;
        case 10:
            newMonth = 'Outubro';
        break;
        case 11:
            newMonth = 'Novembro';
        break;
        case 12:
            newMonth = 'Dezembro';
        break;
    
    }

    return newMonth;
};

module.exports = FormatDate;