angular.module('StockDeal.persons.service',[])
    .factory('persons',['$resource','utils', function($resource, utils){
        var Person = $resource('/api/person/:id',null,{
            'update': {method: 'PUT', params: {id: '@id'}}
        });
        var factory = {};
        factory.all = function(){
            return Person.query();
        }
        factory.get = function(id){
            return utils.findById(factory.all(),id);
        }
        factory.person = Person;

        return factory;


    }]);