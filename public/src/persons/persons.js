angular.module('StockDeal.persons',['ui.router','toaster','ngAnimate'])
    .config(function($stateProvider,$urlRouterProvider){
        $stateProvider
            .state('persons',{
                url: '/persons',
                abstract: true,
                resolve: {
                    persons: ['persons', function(persons){
                        return persons;
                    }]
                },
                views: {
                    'home-view': {
                        templateUrl: 'templates/main.html',
                        controller: function($scope, $state, persons){
                            $scope.persons = persons.all();
                        }
                    }

                }
            })


            .state('persons.edit',{
                url: '/edit/{personId:[0-9a-z]{24}}',
                views: {
                    'add-view': {
                        templateUrl: 'src/persons/person.add.html',
                        controller: ['$scope', '$stateParams', 'utils', '$state', 'toaster', 'persons', function($scope, $stateParams, utils, $state, toaster, persons){
                            $scope.focus = true;
                            var p = utils.findById($scope.persons,$stateParams.personId);
                            $scope.addPerson = function () {
                                $scope.person  = persons.person;
                                $scope.person = p;
                                $scope.person.$update(function(data){
                                    console.log($scope.person);
                                    $scope.persons.splice($scope.persons.indexOf(p),1);
                                    $scope.persons.push(data.per);
                                    toaster.pop(data.status, null,data.message);
                                    $state.go('persons.list');
                                });
                            }
                        }]
                    }
                }
            })
            .state('persons.add',{
                url: '/add',
                views: {
                    'addper-view': {
                        templateUrl: 'src/persons/person.add.html',
                        controller: ['$scope','persons','$state','toaster', '$state', function($scope, persons, $state, toaster, $state){
                            $scope.addPerson = function () {
                                var Person= new persons.person;
                                Person.username = $scope.person.username;
                                Person.phone = $scope.person.phone;
                                Person.birthdate = $scope.person.birthdate;
                                Person.email = $scope.person.email;
                                Person.password = $scope.person.password;
                                Person.$save(function (data) {
                                    $scope.persons.push(data.per);
                                    toaster.pop(data.status, null,data.message);
                                    $state.go('persons.list');
                                });
                            }

                        }]
                    }
                }

            })

                .state('persons.list',{
                    url: '',
                    views:{
                        'list-view':{
                            templateUrl: 'src/persons/persons.list.html',
                            controller: ['$scope', '$stateParams', 'utils', '$state','persons','toaster',function ( $scope, $stateParams, utils, $state, persons,toaster) {
                                var Person = persons.person;
                                $scope.deletePerson= function(id){
                                    if(confirm('Voulez vous vraiment suppirmer cet persons')){
                                        Person.delete({_id: id}).$promise.then(function (res) {
                                            if(res.status === 'error'){
                                                toaster.pop(res.status, null,res.message);
                                            }else{
                                                var obj = utils.findById($scope.persons,id);
                                                $scope.persons.splice($scope.persons.indexOf(obj),1);
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
            .state('persons.co', {
                url: '/login',
                views: {
                    'login-view': {
                        templateUrl: '../src/persons/person.co.html',
                        controller: ['$scope', '$stateParams', 'utils', '$state', 'persons', 'toaster', function ($scope, $stateParams, utils, $state, persons, toaster) {
                            var Person = persons.person;
                                username=$scope.person.username;
                               password=$scope.person.password;

                            Person.findOne(person, function(error, data){

                                if(!data){
                                    return res.send('user not found');
                                }else{
                                    req.session.personId = data._id;
                                    return res.send('you are now connected');
                                }
                            })






                        }]
                    }

                }}

            )

});