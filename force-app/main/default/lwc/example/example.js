import { LightningElement,track } from 'lwc';
import { NavigationMixin  } from 'lightning/navigation';

export default class Example extends NavigationMixin (LightningElement) {
    
    navigateToObjectHome() {
        // Navigate to the Case object home page.
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Case',
                actionName: 'home'
            }
        });
    }

    navigateToListView() {
        // Navigate to the Contact object's Recent list view.
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Contact',
                actionName: 'list'
            },
            state: {
                // 'filterName' is a property on the page 'state'
                filterName: 'Recent',
                c__showAtt : true
            }
        });
    }

    navigateToNewRecordPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Account',
                actionName: 'new'
            }
        });
    }

    navigateToRecordViewPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: "0016D00000Wx6tYQAR",
                //objectApiName: 'namespace__ObjectName', // objectApiName is optional
                actionName: 'view'
            }
        });
    }

    navigateToRecordEditPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: "0016D00000Wx6tYQAR",
                //objectApiName: 'Account', // objectApiName is optional
                actionName: 'edit'
            }
        });
    }

    navigateToWebPage() {

        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'http://salesforce.com'
            }
        },
        false // Replaces the current page in your browser history with the URL
      );
    }

    @track
    recordPageUrl;

    connectedCallback() {
        // Generate a URL to a User record page
        this[NavigationMixin.GenerateUrl]({
            type: 'standard__recordPage',
            attributes: {
                recordId: '0069A000004CEjJQAW',
                actionName: 'view',
            },
        }).then(url => {
            this.recordPageUrl = url;
            console.log('Generated URL ', this.recordPageUrl);
        });
    }
}