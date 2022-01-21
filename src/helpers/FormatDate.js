const FormatDate = (month)=>{
    let newMonth = '';

    switch (month) {
        case 1:
        case 13:
            newMonth = 'Janeiro';
        break;
        case 2:
        case 14:
            newMonth = 'Fevereiro';
        break;
        case 3:
        case 15:
            newMonth = 'Março';
        break;
        case 4:
        case 16:
            newMonth = 'Abril';
        break;
        case 5:
        case 17:
            newMonth = 'Maio';
        break;
        case 6:
        case 18:
            newMonth = 'Junho';
        break;
        case 7:
        case 19:
            newMonth = 'Julho';
        break;
        case 8:
        case 20:
            newMonth = 'Agosto';
        break;
        case 9:
        case 21:
            newMonth = 'Setembro';
        break;
        case 10:
        case 22:
            newMonth = 'Outubro';
        break;
        case 11:
        case 23:
            newMonth = 'Novembro';
        break;
        case 12:
        case 24:
            newMonth = 'Dezembro';
        break;
    
    }

    return newMonth;
};

module.exports = FormatDate;