import { LightningElement,wire,api,track } from 'lwc';
import getAllCases from '@salesforce/apex/CaseController.getAllCases';
export default class WireMethod extends LightningElement {

    @api records;
    @api errors;
    @track subject;

    handleChange(event){
        const sVal = event.target.value;
        this.subject= sVal;
    }

    // @wire(getAllCases) cases;

    //How to fetch records using promise function
    @wire(getAllCases,{
        subject : '$subject'
    })
        wiredCases({
            data,error
        }){
            if(data){
                this.records =data;
                this.errors=undefined;
            }
            if(error){
                this.errors=error;
                this.records=undefined;
            }
        }
}