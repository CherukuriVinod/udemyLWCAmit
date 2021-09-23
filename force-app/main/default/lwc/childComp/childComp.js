import { LightningElement, api } from 'lwc';

export default class ChildComp extends LightningElement {
    @api message;
    @api pageno;

    handleEvent(){
        const eventS = new CustomEvent(
            'simple',
            {
                detail : {message : this.message, pageno : this.pageno, staticVal : "Vinod Cherukuri"}
            }
            
        );
        this.dispatchEvent(eventS);
    }
}