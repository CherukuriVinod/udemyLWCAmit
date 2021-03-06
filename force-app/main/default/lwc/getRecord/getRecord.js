import { LightningElement,api,wire } from 'lwc';

import { getRecord, createRecord } from 'lightning/uiRecordApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name'

export default class GetRecord extends LightningElement {

    @api recordId;

    @wire (getRecord,{recordId : '$recordId', 
        layoutTypes: ['Full', 'Compact'], 
        modes: ['view','Edit','Create']})

        wiredRecord({data,error}){
            if(data){
                console.log('Record Info ', data);
                const  company = data.fields.Company.value;
                console.log('Company Name', company);
            } if(error){
                console.error(error);
            }
        }
        handleCreate(){
            const fields = {};
            console.log(' NameField ', NAME_FIELD.fieldApiName);
            fields[NAME_FIELD.fieldApiName] = 'SFDCSFDX';
            console.log(' ACCOUNT_OBJECT ', ACCOUNT_OBJECT);
            const accountRecord = { apiName : ACCOUNT_OBJECT.objectApiName , fields : fields};
    
            createRecord(accountRecord)
                .then( result => {
                    const id = result.id;
                    alert(' Record Created '+ id);
                })
                .catch( error => {
                    console.log(' Error ', error);
                });
        }
}