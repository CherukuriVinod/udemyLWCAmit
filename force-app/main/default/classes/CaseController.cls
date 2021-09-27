public with sharing class CaseController {

    @AuraEnabled(cacheable = true)
    public static List<Case> getAllCases(String subject){
        String key = '%'+subject+'%';
        List<Case> caseList = [Select Id, Subject, Description, Status, Origin 
                from Case where Subject Like: key WITH SECURITY_ENFORCED Limit 5];
        
        return caseList;
    }
}