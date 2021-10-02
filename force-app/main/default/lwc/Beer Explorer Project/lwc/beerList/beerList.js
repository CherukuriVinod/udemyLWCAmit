import { LightningElement,track, wire } from 'lwc';
import searchBeer from '@salesforce/apex/BeerController.searchBeer';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
export default class BeerList extends NavigationMixin  (LightningElement) {

    @track beerRecords;
    @track errors;

    @wire(searchBeer)
        wiredRecords({error, data}){
            console.log('Data ', data);
            this.beerRecords = data;
            this.errors=error;
        }

    handleEvent(event){
        const eventVal = event.detail;
        console.log('Search Param ', eventVal);

        searchBeer({
            searchParam : eventVal
        })

        .then(result=>{
            console.log('Beer Records ', result);
            this.beerRecords = result;
            this.errors = undefined;
        })
        .catch(error=>{
            console.log('Errors ', error);
            this.errors = error;
            this.beerRecords = undefined;
        })
    }

}