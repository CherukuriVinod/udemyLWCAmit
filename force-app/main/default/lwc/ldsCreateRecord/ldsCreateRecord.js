import { LightningElement,api } from 'lwc';

export default class LdsCreateRecord extends LightningElement {

    @api objectApiName;

    handleSuccess(){
        alert('Record Has Been Created')
    }
}