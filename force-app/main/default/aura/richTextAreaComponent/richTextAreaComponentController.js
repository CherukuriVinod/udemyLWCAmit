({
	doInit : function(component, event, helper) {
        
        component.set('v.validate', function(){
            var userInput = component.get('v.value');
            if(userInput){
                //If the component is valid...
                return{isValid: true};
            } else if(!userInput && component.get("v.required")){
                // If the component is invalid...
                return{isValid: false, errorMessage: 'A value is required.'};
            } else{
                return{isValid: true};
            }
        });
	}
})