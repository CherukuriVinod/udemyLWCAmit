public with sharing class LookupControllerLWC {
    
    @AuraEnabled
    public static List<sObject> findRecords(String objectName, 
    String fieldApiName, String searchValue){
        String key = '%' + searchValue + '%';
        String query = 'Select Id, '+fieldApiName+' FROM '+objectName+' Where '+fieldApiName+ ' LIKE : key';
        List<sObject> sobjectList = Database.Query(Query);
        return sobjectList;
        /*
            Select Id, Name From Account Where Name like '%a%';
        */
    }
}