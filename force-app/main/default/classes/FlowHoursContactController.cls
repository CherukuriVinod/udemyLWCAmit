public class FlowHoursContactController{
    @AuraEnabled
    public static List<Contact> getContacts (String recordId){
        List<Contact> contacts=[Select Id, Name, Phone, Email from Contact where AccountId =: recordId];
        return contacts;
    }
}