import { LightningElement } from 'lwc';

export default class CalculatorDemo extends LightningElement {
    number1;
    number2;
    resultValue;

    handleChangeEvent(event){
        const val = event.target.value;
        const name = event.target.name;
        if(name === 'number1'){
            this.number1 = val;
        }else{
            this.number2 = val;
        }
    }
    doSum(){
        this.resultValue = parseInt(this.number1) + parseInt(this.number2);

    }
    doSubsc(){
        this.resultValue = parseInt(this.number1) - parseInt(this.number2);

    }
    doDiv(){
        this.resultValue = parseInt(this.number1) / parseInt(this.number2);
   

    }
    doMulti(){
        this.resultValue = parseInt(this.number1) * parseInt(this.number2);
    
    }
}