import { LightningElement } from 'lwc';

export default class ParentComp extends LightningElement {
    handleSimpleEvent(event){
        const message=event.detail.message;
        const pageno = event.detail.pageno;
        const name = event.detail.staticVal;
        console.log('Message is:',message +'\nPageno is:',pageno +'\nName is:',name);
        alert('Event Handled' +message);
    }
}