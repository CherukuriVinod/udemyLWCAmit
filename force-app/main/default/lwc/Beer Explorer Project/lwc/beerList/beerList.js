import { LightningElement,track, wire } from 'lwc';
import searchBeer from '@salesforce/apex/BeerController.searchBeer';
import getCartId from '@salesforce/apex/BeerController.getCartId';
import cartIco from '@salesforce/resourceUrl/cart';
import createCartItems from '@salesforce/apex/BeerController.createCartItems';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
export default class BeerList extends NavigationMixin  (LightningElement) {

    @track beerRecords;
    @track errors;
    @track cart = cartIco;
    @track cartId;
    @track itemsinCart = 0;

    connectedCallback() {
        this.defaultCartId();
    }

    defaultCartId(){
        getCartId()
        .then(data => {
            const wrapper = JSON.parse(data);
            if ( wrapper ){
                this.itemsinCart = wrapper.Count;
                this.cartId = wrapper.CartId;
            }
        })
        .catch(error => {
            this.cartId = undefined;
            console.log(error);
        });
    }

    navigateToCartDetail(){
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Cart_Detail' 
            },
            state : {
                c__cartId : this.cartId
            }
        }, true);
    }

    addToCart(event){
        const selectBeerId = event.detail;
        const selectBeerRecord = this.beerRecords.find(
            record => record.Id === selectBeerId
        );
        createCartItems({
            CartId : this.cartId,
            BeerId : selectBeerId,
            Amount : selectBeerRecord.Price__c
        })
        .then(data => {
            //console.log(' Cart Item Id ', data);
            this.itemsinCart = this.itemsinCart + 1;
            const toast = new ShowToastEvent({
                'title' : 'Success!!',
                "message" : selectBeerRecord.Name +' Added into Cart!',
                "variant" : "success", 
            });
            this.dispatchEvent(toast);
        })
        .catch(error => {
            console.log(error);
            const toast = new ShowToastEvent({
                'title' : 'Error!!',
                "message" : JSON.stringify(error),
                "variant" : "error", 
            });
            this.dispatchEvent(toast);
        });
    }

    @wire(searchBeer)
        wiredRecords({error, data}){
            if ( data ) {
            //console.log('Data ', data);
            this.beerRecords = data;
            this.errors=undefined;
        }

        if( error ) {
            this.beerRecords = undefined;
            this.errors = error;
        }
    }


    handleEvent(event){
        const eventVal = event.detail;
        //console.log('Search Param ', eventVal);

        searchBeer({
            searchParam : eventVal
        })

        .then(result=>{
            //console.log('Beer Records ', result);
            this.beerRecords = result;
            this.errors = undefined;
        })
        .catch(error=>{
            //console.log('Errors ', error);
            this.errors = error;
            this.beerRecords = undefined;
        })
    }
}