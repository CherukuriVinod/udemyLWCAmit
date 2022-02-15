import { LightningElement } from 'lwc';

export default class PropDemo extends LightningElement {
    message = 'Reactive Property';

    message1 = 'Reactive Property using @api decorators';

    get name(){
        return 'Vinod Cherukuri';
    }

    get changedMessage(){
        return this.message1+  ' Added Value using get prop!';
    }
    
    handleChange(event){
        this.message1 = event.target.value;
        console.log(' Updated Message is ', this.message);
    }
}