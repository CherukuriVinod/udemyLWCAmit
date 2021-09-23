import { LightningElement } from 'lwc';

export default class HooksExamples extends LightningElement{ 
name='Vinod';
    constructor(){
        super();
        console.log('inside constructor');
        this.name=this.name+'Cherukuri';
    }

    connectedCallback(){
        console.log('connectedCallback');
    }

    disconnectedCallback(){
        console.log('disconnectedCallback');
    }
    renderedCallback(){
        console.log('renderedCallback');
    }
    /*
    render(){
        return
    }
    */

    errorCallback(error,stack){
        console.error()
    }
}