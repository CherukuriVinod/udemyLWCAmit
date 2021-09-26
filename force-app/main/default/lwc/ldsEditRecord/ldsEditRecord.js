import { LightningElement,api } from 'lwc';

export default class LdsEditRecord extends LightningElement {

    @api recordId;
    @api objectApiName;

    handleSubmit(){
        console.log('Submit')
    }
    handleSuccess(){
        console.log('success')
    }
    handleError(){
        console.log('Error')
    }
}