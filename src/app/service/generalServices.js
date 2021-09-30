import React from 'react'
import currecyFormater from 'currency-formatter'

class GeneralServices extends React.Component {
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
     }

    static valueBodyTemplate = (value) => {
        return currecyFormater.format(value, {locale: 'pt-BR'})
    }

    static getCurrentYear = () => {
        return new Date().getFullYear()
    }

    static convertToUsDate = (date) => {
        if(!date) return ''
        var dateArray = date.split('-')
        return dateArray[1] + '-' + dateArray[0] + '-' + dateArray[2]
    }
    static convertToBrDate = (date) => { //yyyy-dd-MM
        var dateArray = date.split('-')
        return dateArray[1] + '-' + dateArray[2] + '-' + dateArray[0]
    }

    static compareIntValues( product1, product2 ) {
        var value1 = parseInt(product1.value, 10)
        var value2 = parseInt(product2.value, 10)
        if ( value1 < value2 ){
          return -1;
        }
        if ( value1 > value2){
          return 1;
        }
        return 0;
    }

    static compareStringValues(product1, product2){
        var value1 = product1.label
        var value2 = product2.label
        if ( value1 < value2 ){
          return -1;
        }
        if ( value1 > value2){
          return 1;
        }
        return 0;
    }

    static compareTimestampByIncreasing(moviment1, moviment2){
        const value1 = moviment1.timestamp
        const value2 = moviment2.timestamp
        
        if ( value1 < value2 ){
            return -1;
        }
        else if ( value1 > value2){
            return 1;
        }   else { //mesmo dia (mesmo timestamp)
                const desempate1 = moviment1.desempate
                const desempate2 = moviment2.desempate

                if ( desempate1 < desempate2 ){
                    return -1;
                }
                else if ( desempate1 > desempate2){
                    return 1;
                } else{
                    console.log('algo de errado')
                }
            }
    }
}

export default GeneralServices