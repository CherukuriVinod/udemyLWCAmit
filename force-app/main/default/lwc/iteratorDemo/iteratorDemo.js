import { LightningElement } from 'lwc';

export default class IteratorDemo extends LightningElement {
    contacts = [
        {
            Id: 1,
            Name: "Vinod Cherukuri",
            Email: "123@email.com"
        },
        {
            Id: 2,
            Name: "Jennifer Lopez",
            Email: "Jenny@emailcom"
        },
        {
            Id: 3,
            Name: "Britney Spears",
            Email: "Britney@email.com"
        }
    ]
}