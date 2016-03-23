angular.module('StockDeal.categories.service',[])
.factory('categories',['$resource','utils', function($resource, utils){
    var Category = $resource('/api/category/:_id',null,{
        'update': {method: 'PUT', params: {_id: '@_id'}}
    });
    var factory = {};
    factory.all = function(){
        return Category.query();
    }
    factory.get = function(id){
        return utils.findById(factory.all(),id);
    }
    factory.category = Category;

    return factory;


}]);