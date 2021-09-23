({
	doInit : function(component, event, helper) {
		
        component.set('v.validate', function(){
            var userInput = component.get('v.selectedRowsList');
            if(userInput && userInput.length>0){
                //If the component is valid..
                return {isValid: true};
            }else {
                //If the component is invalid...
                return {isValid: false, errorMessage: 'A value is required.'};
            }
        });
        component.set('v.columns', [
            {label: 'Contact Name', fieldName: 'Name', type: 'text'},
            {label: 'Phone', fieldName: 'Phone', type: 'phone'},
            {label: 'Email', fieldName: 'Email', type: 'email'}
        ]);
        helper.getData(component);
	},
    getSelectedRecord: function(component, event, helper){
        var selectedRows = event.getParam('selectedRows');
        component.set("v.selectedRowsList", selectedRows);
        let ids;
        for(var i = 0; i< selectedRows.length; i++){
            if(!ids){
                ids = selectedRows[i].Id;
            }else{
                ids += ','+selectedRows[i].Id;
            }
        }
        component.set("v.selectedRows", ids);
    }
})