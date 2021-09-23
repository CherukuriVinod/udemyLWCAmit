import { LightningElement } from 'lwc';

export default class ContactList extends LightningElement {

    contacts = [
        {
            Id :1,
            Name: 'Sagar Chandra',
            Email: 'info@email.com',
            Phone: '25615582156',
        },
        {
            Id: 2,
            Name: 'Phani Kanth',
            Email: 'phani@email.com',
            Phone: '35135135456',
        },
        {
            Id: 3,
            Name: 'Jitendra Singh',
            Email: 'jitendra@email.com',
            Phone: '135626131',
        }
    ];
}