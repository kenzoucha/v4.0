angular.module('StockDeal.categories',['ui.router','toaster','ngAnimate'])
    .config(function($stateProvider,$urlRouterProvider){
        $stateProvider
            .state('categories',{
                url: '/categories',
                abstract: true,
                resolve: {
                    categories: ['categories', function(categories){
                        return categories;
                    }]
                },
                views: {
                    'home-view': {
                        templateUrl: 'templates/main.html',
                        controller: function($scope, $state, categories){
                            $scope.categories = categories.all();
                        }
                    }

                }
            })
            .state('categories.list',{
                url: '',
                views:{
                    'list-view':{
                        templateUrl: 'src/categories/categories.list.html',
                        controller: ['$scope', '$stateParams', 'utils', '$state','categories','toaster',function ( $scope, $stateParams, utils, $state, categories,toaster) {
                            var Category = categories.category;
                            $scope.deleteCategory= function(id){
                                if(confirm('Voulez vous vraiment suppirmer cet categories')){
                                    Category.delete({_id: id}).$promise.then(function (res) {
                                        if(res.status === 'error'){
                                            toaster.pop(res.status, null,res.message);
                                        }else{
                                            var obj = utils.findById($scope.categories,id);
                                            $scope.categories.splice($scope.categories.indexOf(obj),1);
                                            toaster.pop(res.status, null,res.message);
                                        }
                                    });
                                }
                                return false;
                            }
                        }]
                    }
                }
            })
            .state('categories.edit',{
                url: '/edit/{categoryId:[0-9a-z]{24}}',
                views: {
                    'add-view': {
                        templateUrl: 'src/categories/categorie.add.html',
                        controller: ['$scope', '$stateParams', 'utils', '$state', 'toaster', 'categories', function($scope, $stateParams, utils, $state, toaster, categories){
                            $scope.focus = true;
                            var c = utils.findById($scope.categories,$stateParams.categoryId);
                            $scope.addCategory = function () {
                                $scope.category = categories.category;
                                $scope.category = c;
                                $scope.category.$update(function(data){
                                    console.log($scope.category);
                                    $scope.categories.splice($scope.categories.indexOf(c),1);
                                    $scope.categories.push(data.cat);
                                    toaster.pop(data.status, null,data.message);
                                    $state.go('categories.list');
                                });
                            }
                        }]
                    }
                }
            })
            .state('categories.add',{
                url: '/add',
                views: {
                    'add-view': {
                        templateUrl: 'src/categories/categorie.add.html',
                        controller: ['$scope','categories','$state','toaster', '$state', function($scope, categories, $state, toaster, $state){
                            $scope.addCategory = function () {
                                var category= new categories.category;
                                category.designation = $scope.category.designation;
                                category.description = $scope.category.description;
                                category.$save(function (data) {
                                    $scope.categories.push(data.cat);
                                    toaster.pop(data.status, null,data.message);
                                    $state.go('categories.list');
                                });
                            }

                        }]
                    }
                }

            })


    });