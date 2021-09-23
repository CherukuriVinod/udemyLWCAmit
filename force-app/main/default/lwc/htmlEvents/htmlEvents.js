import { LightningElement } from 'lwc';

export default class HtmlEvents extends LightningElement {
    message='';

    handleChange(event){
        this.message=event.target.value;
        console.log(event.target.value);
    }
}