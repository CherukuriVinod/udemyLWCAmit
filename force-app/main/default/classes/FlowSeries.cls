public with sharing class FlowSeries{

    @InvocableMethod(label='Delete Related Opportunities'
                    description='Delete Related Opportunities for the given Record Ids'
                    category='Account')
    public static void deleteOpportunities(List<String> ids){
        
        List<Opportunity> oppList=[Select Id from Opportunity where AccountId =: ids AND StageName = 'Closed Won'  WITH SECURITY_ENFORCED ];
        delete opplist;
    }                             
}