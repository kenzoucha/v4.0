angular.module('StockDeal.products',['ui.router','toaster','ngAnimate'])
 .config(function($stateProvider,$urlRouterProvider){
        $stateProvider
            .state('products',{
                url: '/products',
                abstract: true,
                resolve: {
                    products: ['products', function(products){
                        return products;
                    }]
                },
                views: {
                    'home-view': {
                        templateUrl: 'templates/main.html',
                        controller: function($scope, $state, products){
                            $scope.products = products.all();
                        }
                    }
                }
            })
            .state('products.list',{
                url: '',
                views: {
                    'list-view': {
                        templateUrl: 'src/products/products.list.html',
                        controller: ['$scope', '$stateParams', 'utils', '$state','products','toaster',function ( $scope, $stateParams, utils, $state, products,toaster) {
                            var Product = products.product;
                            $scope.deleteProduct = function(id){
                                if(confirm('Voulez vous vraiment suppirmer cet produit')){
                                    Product.delete({id: id}).$promise.then(function (res) {
                                        var obj = utils.findById($scope.products,id);
                                        $scope.products.splice($scope.products.indexOf(obj),1);
                                        toaster.pop(res.status, null,res.message);
                                    });
                                }
                                return false;

                            }
                        }]
                    }
                }
            })
            .state('products.detail',{
                url: '/{productId:[0-9a-z]{24}}',
                templateUrl: 'src/products/products.detail.html',
                controller: ['$scope', '$stateParams', 'utils',
                    function (  $scope,   $stateParams,   utils) {
                        $scope.product = utils.findById($scope.products, $stateParams.productId);
                    }]
            })
            .state('products.edit',{
                url: '/edit/{productId:[0-9a-z]{24}}',
                templateUrl: 'src/products/products.edit.html',
                controller: ['$scope','$stateParams','utils','$state',function($scope,$stateParams,utils,$state){
                    $scope.focus = true;
                    $scope.product = utils.findById($scope.products,$stateParams.productId);
                    $scope.editProduct = function () {
                        $scope.product.id = $stateParams.productId;
                        $scope.product.$update(function(data){
                            $scope.product = {};
                            $scope.focus = false;
                            $state.go('products.add.image',{productId: data._id});
                        });
                        }
                }]
            })
            .state('products.add',{
                url: '/add',
                views: {
                    'add-view': {
                        templateUrl: 'src/products/product.add.html',
                        controller: function(cats, $scope){
                            $scope.product = {};
                            cats.query().$promise.then(function(data){
                               $scope.categories = data;
                                console.log($scope.product);
                            });
                        }
                    }
                }
            });

    });