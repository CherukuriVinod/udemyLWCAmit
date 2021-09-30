import { LightningElement,wire } from 'lwc';
import getContactList from '@salesforce/apex/DataTableControllerLWC.getContactList';
import { updateRecord } from 'lightning/uiRecordApi';
import {refreshApex} from '@salesforce/apex';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

const actions = [
    {label: 'Show details', iconName:'utility:info', name: 'details'},
    {label: 'Delete', name: 'delete', iconName : 'utility:delete'}
];

const columns = [
    {label: 'Contact Name', fieldName: 'recordUrl', type:'url', wrapText:true,
            typeAttributes: {
                label : {
                    fieldName : 'Name'
                },
                target : '_blank'
            },
            cellAttributes:{
                iconName:{
                    fieldName: 'contactIcon'
                },
                iconPosition : 'left',
                iconAlternativeText : 'Contact Icon'
            }
        },
    {label: 'Phone', fieldName: 'Phone', type: 'phone', sortable:true, editable:true},
    {label: 'Title', fieldName: 'Title', type: 'text', sortable:true, editable:true},
    {label: 'Email', fieldName: 'Email', type: 'Email', sortable:true, editable:true},
    {label: 'Account Name', fieldName: 'accountUrl', type: 'url', wrapText:true,
            typeAttributes : {
                label : {
                    fieldName: 'ACCOUNT_NAME'
                },
                target : '_blank'
            },
            cellAttributes :{
                iconName : 'standard:account',
                iconPosition : 'left',
                iconAlternativeText : 'Account Icon'
            }
    },
    {
        type: "button",
        fixedWidth: 150,
        typeAttributes: {
            label: 'View Details',
            title: 'View Details',
            name: 'viewDetails',
            value: 'viewDetails',
            variant: 'brand',
            iconName : 'utility:preview',
            class: 'scaled-down'
        }
    },
    {type: 'action', typeAttributes: {rowActions: actions}},
];

export default class DatatableComponentLWC extends LightningElement {

    contactData;
    columnsList = columns;
    error;

    //Attributes for Inline Editing
    draftValues =[];

    //Attributes for Selected Rows
    selectedRows = [];
    selectedRowsList=[];

    //Attributes for Datatable Sorting
    sortBy ='Phone';
    sortDirection ='asc';

    // attribute for refreshApex
    refreshApexData;

    @wire(getContactList)
    wiredData (result){
        this.refreshApexData = result;
        //this.refreshApexData = result;
        if (result.data) {
            //console.log('Data \n ', data);
            let parsedData = JSON.parse(JSON.stringify(result.data));
            let baseUrl = 'https://'+location.host+'/';
            parsedData.forEach(contact => {
                if(contact.AccountId){
                    contact.ACCOUNT_NAME = contact.Account.Name;
                    contact.recordUrl = baseUrl+contact.Id;
                    contact.accountUrl= baseUrl+contact.AccountId;
                    contact.accountIcon = 'standard:account';//
                    contact.contactIcon = 'standard:contact';
                    this.selectedRows.push(contact.Id);
                }
            });
            //console.log('Modified Data \n', parsedData);
            this.contactData=parsedData;
            this.error=undefined;
        } else if(result.error){
            console.error('Error : \n ', result.error);
            this.contactData=undefined;
            this.error=result.error;
        }    
    }

    handleSortdata(event){
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(event.detail.fieldName, event.detail.sortDirection);
    }

    sortData(fieldname, direction){
        let pareseData = JSON.parse(JSON.stringify(this.contactData));
        let keyValue = (a)=> {
            return a[fieldname];
        };
        let isReverse = direction === 'asc' ? 1: -1;
        pareseData.sort((x,y)=>{
            x= keyValue(x) ? keyValue(x) : '';
            y=keyValue(y) ? keyValue(y) : '';
            return isReverse * ((x>y) - (y > x));
        });
        this.contactData = pareseData;
    }

    handleSelectedRows(event){
        let selectedRows = event.detail.selectedRows;
        selectedRows.forEach(currentItem => {
            this.selectRowsList.push(currentItem);
        });
        console.log(' selectedRows \n ', selectedRows );
    }

    handleRowAction(event){
        const action = event.detail.action;
        const row = event.detail.row;
        switch (action.name){
            case 'details':
                this.showDetails(row.Id);
                break;
            case 'delete':
                this.handleDelete(row.Id);
                alert('deleting: ' + JSON.stringify(row));
                break;
            case 'viewDetails':
                this.showDetails(row.Id);
                alert('viewDetails: ' + row.Id);
                break;
        }
    }
    handleDelete(recordId){
        alert('Deleting Record: ' + recordId);
    }

    showDetails(recordId){
        alert('viewDetails: ' + recordId);
    }

    handleSelectedRowsClick(event){
        event.preventDefault();
        let selectedRows = this.template.querySelector('lightning-datatable').getSelectedRows(); 
        console.log('Clicked selectedRows \n ', selectedRows);
    }

    handleSave(event) {
        this.draftValues = event.detail.draftValues;
        console.log(' this.draftValues \n ', this.draftValues );
        const recordInputs =  event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
        window.console.log(JSON.stringify(event.detail.draftValues));
        console.log(' recordInputs \n ', recordInputs );
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));

        Promise.all(promises).then(contacts => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Contact Records updated',
                variant: 'success'
            }));
            this.draftValues = [];
            return refreshApex(this.refreshApexData);
        }).catch(error => {
            console.error('Error occured \n ',error)
        });
    }
}