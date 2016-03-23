angular.module('StockDeal',[
    'StockDeal.products',
    'StockDeal.products.service',
    'StockDeal.categories',
    'StockDeal.categories.service',
    'StockDeal.scategories',
    'StockDeal.scategories.service',
    'StockDeal.persons',
    'StockDeal.persons.service',
    'StockDeal.utils.service',
    'StockDeal.controllers',
    'StockDeal.directives',
    'ngResource',
    'ngMessages',
    'ui.router',
    'ngFileUpload',
    


])
.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider){

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home',{
            url: '/',
            template: '<h4>Bienvenu dans l\'espace administration de site Stock Deal</h4>'
        })
}]);

