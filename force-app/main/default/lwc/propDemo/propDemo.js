import { LightningElement, track, api } from 'lwc';

export default class PropDemo extends LightningElement {
    @track message = 'Reactive Property';

    @api message1 = 'Reactive Property using @api decorators';

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