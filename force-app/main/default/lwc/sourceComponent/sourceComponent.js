import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
export default class SourceComponent extends NavigationMixin (LightningElement) {

    codeText;
    codeValue;
    
    handleClick(){
        let pageRef = {
            type: "standard__component",
            attributes: {
                componentName: "c__NavigateToLWC"
            },
            state: {
                c__codeNumber: '500',
                c__codeText: 'Status Code'
            }
        };

        this[NavigationMixin.Navigate](pageRef);
    }

    /*
        1 - 2 LWC ( Source & target ) 
        Source component is for where we are going to migrate and target component where we are going to navigate
        2 - Aura Component ( Target component) Aura component will act as middle wear  Wrap our target component
    */

}