angular.module('StockDeal.scategories',['ui.router','toaster','ngAnimate'])
    .config(function($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('scategories', {
                url: '/scategories',
                abstract: true,
                resolve: {
                    scategories: ['scategories', function (scategories) {
                        return scategories;
                    }]
                },
                views: {
                    'home-view': {
                        templateUrl: 'templates/main.html',
                        controller: function($scope, scategories){
                            $scope.scategories = scategories.all();
                        }
                    }
                }
            })
            .state('scategories.list', {
                url: '',
                views: {
                    'list-view':{
                        templateUrl: 'src/scategories/scategories.list.html',
                        controller: ['$scope', '$stateParams', 'utils', '$state', 'scategories', 'toaster', function ($scope, $stateParams, utils, $state, scategories, toaster) {
                            var SCategory = scategories.scategory;
                            $scope.deleteSCategory = function (id) {
                                if (confirm('Voulez vous vraiment suppirmer cet categories')) {
                                    SCategory.delete({id: id}).$promise.then(function (res) {
                                        if (res.status === 'error') {
                                            toaster.pop(res.status, null, res.message);
                                        } else {
                                            var obj = utils.findById($scope.scategories, id);
                                            $scope.scategories.splice($scope.scategories.indexOf(obj), 1);
                                            toaster.pop(res.status, null, res.message);
                                        }
                                    })
                                }
                                return false;
                            }
                        }]
                    }
                }
            })


            .state('scategories.edit', {
                url: '/edit/{SCategoryId:[0-9a-z]{24}}',
                views: {
                    'edit-view': {
                        templateUrl: 'src/scategories/scategories.edit.html',
                        controller: ['$scope', '$stateParams', 'utils', '$state', function ($scope, $stateParams, utils, $state) {
                            $scope.focus = true;
                            var sc = utils.findById($scope.scategories,$stateParams.SCategoryId);
                            $scope.editSCategory = function () {
                                $scope.scategory = scategories.scategory;
                                $scope.scategory = sc;
                                $scope.scategory.$update(function(data) {
                                    console.log($scope.scategory);
                                    $scope.scategories.splice($scope.scategories.indexOf(sc), 1);
                                    $scope.scategories.push(data.scat);
                                    toaster.pop(data.status, null, data.message);
                                    $state.go('scategories.list');
                                })
                                }

                        }]
                    }}
            })

            .state('scategories.add', {
                url: '/addSCat',
                views:{
                    'add-view' :{
                        templateUrl: 'src/scategories/scategorie.add.html',
                        controller: ['$scope', 'scategories', '$state', 'toaster', 'categories', 'utils', function ($scope, scategories, $state, toaster, categories, utils) {
                            $scope.categories = categories.all();
                            $scope.scategory = new scategories.scategory({
                                designation: ['', 'text'],
                                description: ['', 'textarea'],
                                category: ['', 'select']
                            });
                            $scope.addCategory = function(){
                                $scope.scategory.$save(function(data){
                                    $scope.scategories.push(data.scategory);
                                    if(data.status === 'error'){
                                        toaster.pop(data.status, null,data.message);
                                    }else{
                                        toaster.pop(data.status, null,data.message);
                                        $state.go('scategories.list');
                                    }
                                });
                            };
                        }]
                    }
                }

            });
    });