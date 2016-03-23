angular.module('StockDeal.utils.service',[])
.factory('utils',function(){
   return {
       findById: function findById (a, id) {
           for(var i = 0; i< a.length; i++){
               if(a[i]._id == id) return a[i];
           }
           return null;
       }
   }
});