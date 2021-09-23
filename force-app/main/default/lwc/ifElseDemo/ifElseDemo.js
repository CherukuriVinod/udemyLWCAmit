import { LightningElement } from 'lwc';

export default class IfElseDemo extends LightningElement {
    isTom='';
    isJerry='';

    showTom(){
        this.isJerry=false;
        this.isTom=true;
    }

    showJerry(){
        this.isJerry=true;
        this.isTom=false;
    }
}