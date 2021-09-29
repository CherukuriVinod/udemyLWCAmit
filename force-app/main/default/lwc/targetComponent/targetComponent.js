import { LightningElement,api } from 'lwc';

export default class TargetComponent extends LightningElement {
    @api codeValue;
    @api codeText;
}