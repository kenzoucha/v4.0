angular.module('StockDeal.products.service',[])
.factory('products',['$resource','utils', function($resource, utils){
        var Product = $resource('/api/product/:id',null,{
            'update': {method: 'PUT', params: {id: '@id'}},
            'getCats': {method: 'GET'}
        });
        var factory = {};
        factory.all = function(){
            return Product.query();
        }
        factory.get = function(id){
            return utils.findById(factory.all(),id);
        }
        factory.product = Product;

        return factory;
}])
.factory('cats',['$resource','utils', function($resource, utils){
        var Cat = $resource('/api/cats/:id');
        return Cat;
    }]);


