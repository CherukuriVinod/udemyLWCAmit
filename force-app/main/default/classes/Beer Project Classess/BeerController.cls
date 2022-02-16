public with sharing class BeerController {

    public static String generateCardId(){
        String charList = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
        Integer position;
        Integer lengthRequired = 30;
        String res = '';
        for(Integer i = 0; i <= lengthRequired; i++) {
            position = Integer.valueof(String.valueof(Math.roundToLong(charList.length()*Math.random()))) -1;
            res += charList.substring(position,position+1);
        }
        return res;
    }

    @AuraEnabled
    public static OrderWrapper orderDetails(String orderId){
        Order__c orderInfo = [
            Select Id, Name, User__c, Shipping_Address__c,subTotal__c,
            Shipping_Address__r.Street__c, Shipping_Address__r.City__c,
            Shipping_Address__r.Country__c,
            Shipping_Address__r.State__c,
            Shipping_Address__r.Postal_Code__c,
            (
                Select Id, Name,
                Beer__r.Name,
                Ordered_Quantity__c,
                Item_Price__c
                From Order_Items__r
            )
            From Order__c 
            Where Id =: orderId WITH SECURITY_ENFORCED
        ];
        OrderWrapper wrapper = new OrderWrapper();
        wrapper.order = orderInfo;
        wrapper.Orderitems = orderInfo.Order_Items__r;
        // orderInfo.Order_Items__r => List<Order_Item__c> => null
        return wrapper;
    }

    @AuraEnabled
    public static Order__c createOrder(String cartId, string addressId, Decimal totalAmount){
        Order__c orderInfo = new Order__c();
        orderInfo.User__c = UserInfo.getUserId();
        orderInfo.Cart__c = cartId;
        orderInfo.Shipping_Address__c = addressId;
        orderInfo.subTotal__c = totalAmount;
        insert orderInfo;

        List<Cart_Item__c> cartItems = (List<Cart_Item__c>)JSON.deserialize( getItems(cartId),
                                                                List<Cart_Item__c>.class);

        List<Order_Item__c> orderItems = new List<Order_Item__c>();
        For (Cart_Item__c item : cartItems){
            Order_Item__c oItem = new Order_Item__c();
            oItem.Beer__c = item.Beer__c;
            oItem.Related_Order__c = orderInfo.Id;
            oItem.Ordered_Quantity__c = item.Item_Quantity__c;
            oItem.Item_Price__c = item.Item_Amount__c;
            orderItems.add(oItem);
        }
        insert orderItems; 

        Cart__c cart = new Cart__c();
        cart.Id = cartId;
        cart.Cart_Status__c = 'Closed';
        cart.Is_Active__c = false;
        update cart;

        Order__c order = [Select Id, Name From Order__c Where Id =:orderInfo.Id WITH SECURITY_ENFORCED];
        return order;
    }

    @AuraEnabled
    public static Address_Book__c saveAddress(String addressDetails){
        // {City__c : '', State__c : ''}
        Address_Book__c addressInfo = (Address_Book__c)JSON.deserialize(addressDetails,
                                                        Address_Book__c.class);
        // Address_Book__c addrs = new Address_Book__c()
        // addrs.City__c = '';
        // addrs.State__c = '';
        // 1 - String which contains information in form of Object
        // 2 - Actual Object/Apex Class
        // 3 - (Account)JSON.deserialize(addressDetails,Account.class);
        addressInfo.User__c = UserInfo.getUserId();
        insert addressInfo;
        return addressInfo;
    }

    @AuraEnabled
    public static List<Address_Book__c> addressDetails(){
        List<Address_Book__c> addressList = [SELECT Id, City__c, Country__c, 
                                                    Postal_Code__c, State__c, 
                                                    Street__c, User__c 
                                                    FROM Address_Book__c 
                                                Where User__c != null 
                                                AND User__c =: UserInfo.getUserId() WITH SECURITY_ENFORCED];
        return addressList;
    }

    @AuraEnabled
    public static string getItems(String cartId){
        List<Cart_Item__c> items = [Select Id, Name, Beer__c, Cart__c, 
                                Item_Quantity__c, Item_Amount__c,
                                Total_Amount__c,
                                Beer__r.Name
                                FROM Cart_Item__c 
                                Where Cart__c =: cartId WITH SECURITY_ENFORCED];
        return JSON.serialize(items);
    }


    @AuraEnabled
    public static Coupon__c couponInfo(String name){
        Coupon__c coupon = getCouponInformation(name);
        return Coupon;
    }

    public static Coupon__c getCouponInformation(String name){
       Coupon__c couponRec = [Select Id, Name, 
                                Price__c 
                                FROM Coupon__c
                                Where Expired__c = false
                                AND (Remaining_Quantity__c >0 OR Name ='Default')
                                AND Name =: name WITH SECURITY_ENFORCED];
        return couponRec;
    }

    @AuraEnabled
    public static string createCartItems(String cartId, String BeerId, Decimal Amount){
        Cart_Item__c item = new Cart_Item__c();
        Map<Id, Cart_Item__c> cartItemsMap = getCartItems(cartId);
        if ( cartItemsMap.containsKey(BeerId) ) {
            item = cartItemsMap.get(BeerId);
            item.Item_Quantity__c = item.Item_Quantity__c + 1;
            update item;
        } else {
            item.Beer__c = BeerId;
            item.Cart__c = cartId;
            item.Item_Quantity__c = 1;
            item.Item_Amount__c = amount;
            insert item;
        }   
        return item.Id;
    }

    public Static Map<Id, Cart_Item__c> getCartItems(String cartId){
        /* beerId, Cart_Iems*/
        Map<Id, Cart_Item__c> cartItemsMap = new Map<Id, Cart_Item__c>();
        for ( Cart_Item__c cart : [Select Id, Name, Beer__c, Cart__c, 
                                Item_Quantity__c, Item_Amount__c
                                FROM Cart_Item__c
                                Where Cart__c =: cartId WITH SECURITY_ENFORCED]) {
            cartItemsMap.put(cart.Beer__c, cart);
        }
        return cartItemsMap;
    }

    @AuraEnabled(cacheable=false)
    public static string getCartId(){
        List<Cart__c> cartInfo = [Select Id, Name 
                                FROM Cart__c 
                                Where User__c =: UserInfo.getUserId()
                                AND Cart_Status__c = 'Open'
                                AND Is_Active__c = true WITH SECURITY_ENFORCED];
        if (cartInfo != null && cartInfo.size() > 0) {
            List<Cart_Item__c> cartItems = new list<Cart_Item__c>();
            cartItems = [Select Id, Name, Beer__c, Cart__c, Item_Quantity__c, Item_Amount__c 
                                FROM Cart_Item__c 
                                Where Cart__c =: cartInfo.get(0).Id WITH SECURITY_ENFORCED];

            Decimal itemQnty = 0;
            for (Cart_Item__c item : cartItems) {
                itemQnty = itemQnty + item.Item_Quantity__c;
            }
            
            CartWrapper wrapper = new CartWrapper();
            wrapper.CartId = cartInfo.get(0).Id;
            wrapper.items = cartItems;
            wrapper.Count = itemQnty;
            return JSON.serialize(wrapper);
        } else { 
            Cart__c defaultCart = new Cart__c();
            Coupon__c coupon = getCouponInformation('Default');
            defaultCart.Cart_Id__c = String.valueOf(Math.random());
            defaultCart.Cart_Status__c = 'Open';
            defaultCart.Is_Active__c = true;
            defaultCart.Coupon__c = coupon.Id;
            defaultCart.User__c = UserInfo.getUserId();
            insert defaultCart;
            CartWrapper wrapper = new CartWrapper();
            wrapper.cartId = defaultCart.Id;
            wrapper.items = null;
            wrapper.count = 0;
            return JSON.serialize(wrapper);
        }                        
    }


    @AuraEnabled(cacheable=true)
    public static List<sObject> searchBeer(String searchParam){
        String likeParam = '%' +searchParam+'%';
        String query = '';

        /*
            Select Id, Name From beer__c Where Name Like '%aa%'
        */
        if(searchParam != null){
           query  = 'Select Id, Name, Alcohol__c,brewery_id__c, brewery_Name__c, Id__c, Price__c,Image__c,Remaining_Quantity__c, Tags__c, Total_Quantity__c From Beer__c Where Name Like :likeParam LIMIT 50 ';
        }else{
           query  = 'Select Id, Name, Alcohol__c,brewery_id__c, brewery_Name__c, Id__c, Price__c,Image__c,Remaining_Quantity__c, Tags__c, Total_Quantity__c From Beer__c LIMIT 50 '; 
        }
        
        List<SObject> sObjectList = Database.query(query);
        return sObjectList;
    }

    public class CartWrapper {
        @AuraEnabled
        public String cartId                { get; set; }
        @AuraEnabled
        public Decimal count                { get; set; }
        @AuraEnabled
        public List<Cart_Item__c> items     { get; set; }
    }

    public class OrderWrapper {
        @AuraEnabled
        public Order__c order                     { get; set; }
        @AuraEnabled
        public List<Order_Item__c> orderitems     { get; set; }
    }
}