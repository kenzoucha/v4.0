angular.module('StockDeal.scategories.service',[])
    .factory('scategories',['$resource','utils', function($resource, utils){
        var SCategory = $resource('/api/scategory/:id',null,{
            'update': {method: 'PUT', params: {id: '@id'}}
        });
        var factory = {};
        factory.all = function(){
            return SCategory.query();
        }
        factory.get = function(id){
            return utils.findById(factory.all(),id);
        }
        factory.scategory = SCategory;

        return factory;


    }]);