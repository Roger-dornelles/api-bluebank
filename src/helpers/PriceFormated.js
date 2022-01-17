const {mask} = require('remask');

const PriceFormated = (value) => {
    console.log(value.length)
    let values = 0;

    if(value.length === 4){
        const patterns = ['9,99']
        values  = mask(value,patterns)
    };
    
    if(value.length === 5){
        const patterns = ['99,99']
        values = mask(value,patterns)
    };
    
    if(value.length === 6){
        const patterns = ['999,99']
        values = mask(value,patterns)
    };
    
    if(value.length === 8 ){
        const patterns = ['9.999,99']
        values = mask(value,patterns)
    };
    
    if(value.length === 9 ){
        const patterns = ['99.999,99']
        values = mask(value,patterns)
    };
    
    if(value.length === 10 ){
        const patterns = ['999.999,99']
        values = mask(value,patterns)
    };
    return values;

};

module.exports = PriceFormated;