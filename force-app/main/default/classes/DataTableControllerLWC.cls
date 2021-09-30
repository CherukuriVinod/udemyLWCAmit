public with sharing class DataTableControllerLWC {
    
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactList(){
        List<Contact> contactList = new List<Contact>();
        try {
            contactList = [SELECT Id, Name, Phone, Title, Email, AccountId, Account.Name,
                            Account.Phone
                            FROM Contact WITH SECURITY_ENFORCED
                            Limit 10 ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return contactList;
    }
}