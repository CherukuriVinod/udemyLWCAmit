import { LightningElement, api } from 'lwc';

export default class OpportunityDetails extends LightningElement {
    @api recordId;
    @api objectApiName

    constructor(){
        super();
        console.log('Record Id:',this.recordId + '\nObject Info:',this.objectApiName);
    }
}