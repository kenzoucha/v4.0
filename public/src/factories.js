angular.module('StockDeal')
    .controller('CategoryCtrl', function ($scope,$resource) {
        var Category = $resource('/api/category/:id',null,{
            'update': {method: 'PUT', params: {id: '@id'}}
        });
        $scope.editCategory = function () {
            if($scope.id_edit){
                $scope.category.id = $scope.id_edit;
                $scope.category.$update(function(obj){
                    $scope.categories = obj.categories;
                });
            }else{
                var category = new Category;
                category.designation = $scope.category.designation;
                category.description = $scope.category.description;
                category.$save();
                $scope.categories = Category.query();
            }
            $scope.category = {};
        }
        $scope.categories = Category.query();
        $scope.updateCategory = function (id) {
            $scope.id_edit = id;
            $scope.focus = true;
            $scope.category = Category.get({id: id});
        };
        $scope.deleteCategory = function (id) {

            swal({
                    title: "Tu es sur ?",
                    text: "Voulez vous vraiment supprimer cette catégorie ?!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Oui, Supprimer",
                    cancelButtonText: "Non, Annuler!",
                    closeOnConfirm: false,
                    closeOnCancel: false },
                function(isConfirm){
                    if (isConfirm) {
                        Category.delete({id: id}, function (res) {
                            console.log(res);
                            swal("Supprimer!", "Catégorie a bien été supprimer.", "success");
                            $scope.categories = Category.query();
                        });
                    } else {
                        swal("Annuler", "La suppression de la catégorie a bien été annulé :)", "error");
                    } });
        }

    })
    /*************/
    .controller('ProductCtrl', function ($scope,$resource,FileUploader) {
        var Product = $resource('/api/product/:id',null,{
            'update': {method: 'PUT', params: {id: '@id'}}
        });
        $scope.editProduct = function () {
            if($scope.id_edit){
                $scope.product.id = $scope.id_edit;
                $scope.product.$update(function(obj){
                    $scope.products = obj.products;
                });
            }else{
                var product = new Product;
                product.designation = $scope.product.designation;
                product.description = $scope.product.description;
                product.price = $scope.product.price;
                product.$save();
                $scope.products = Product.query();

            }
            $scope.product = {};
        }
        $scope.products = Product.query();
        $scope.updateProduct = function (id) {
            $scope.id_edit = id;
            $scope.focus = true;
            $scope.product = Product.get({id: id});
        };
        $scope.deleteProduct = function (id) {
            swal({
                    title: "Tu es sur ?",
                    text: "Voulez vous vraiment supprimer cet produit ?!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Oui, Supprimer",
                    cancelButtonText: "Non, Annuler!",
                    closeOnConfirm: false,
                    closeOnCancel: false },
                function(isConfirm){
                    if (isConfirm) {
                        Product.delete({id: id}, function (res) {
                            console.log(res);
                            swal("Supprimer!", "Produit a bien été supprimer.", "success");
                            $scope.products = Product.query();
                        });
                    } else {
                        swal("Annuler", "La suppression de le produit a bien été annulé :)", "error");
                    } });
        }
        /************** Image Upload *************/
            .controller('SCategoryCtrl', function ($scope,$resource) {
                var SCategory = $resource('/api/scategory/:id',null,{
                    'update': {method: 'PUT', params: {id: '@id'}}
                });
                $scope.editSCategory = function () {
                    if($scope.id_edit){
                        $scope.scategory.id = $scope.id_edit;
                        $scope.scategory.$update(function(obj){
                            $scope.scategories = obj.scategories;
                        });
                    }else{
                        var scategory = new SCategory;
                        scategory.designation = $scope.scategory.designation;
                        scategory.description = $scope.category.description;
                        scategory.$save();
                        $scope.scategories = SCategory.query();
                    }
                    $scope.scategory = {};
                }
                $scope.scategories = SCategory.query();
                $scope.updateSCategory = function (id) {
                    $scope.id_edit = id;
                    $scope.focus = true;
                    $scope.scategory = SCategory.get({id: id});
                };
                $scope.deleteSCategory = function (id) {

                    swal({
                            title: "Tu es sur ?",
                            text: "Voulez vous vraiment supprimer cet sous catégorie ?!",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Oui, Supprimer",
                            cancelButtonText: "Non, Annuler!",
                            closeOnConfirm: false,
                            closeOnCancel: false },
                        function(isConfirm){
                            if (isConfirm) {
                                Category.delete({id: id}, function (res) {
                                    console.log(res);
                                    swal("Supprimer!", "SCatégorie a bien été supprimer.", "success");
                                    $scope.scategories = Category.query();
                                });
                            } else {
                                swal("Annuler", "La suppression de la sous  catégorie a bien été annulé :)", "error");
                            } });
                }

            })


            /////////////////***********Person*******/////////////////
            .controller('PersonCtrl', function ($scope,$resource) {
                var Person = $resource('/api/person/:id',null,{
                    'update': {method: 'PUT', params: {id: '@id'}}
                });
                $scope.editPerson = function () {
                    if($scope.id_edit){
                        $scope.person.id = $scope.id_edit;
                        $scope.person.$update(function(obj){
                            $scope.persons = obj.persons;
                        });
                    }else{
                        var person = new Person;
                        person.username = $scope.person.username;
                        person.phone=$scope.person.phone;
                        person.birthdate=$scope.person.birthdate;
                        person. email=$scope.person.email;
                        person.password = $scope.person.password;

                        person.$save();
                        $scope.persons = Person.query();
                    }
                    $scope.person = {};
                }
                $scope.persons = Person.query();
                $scope.updatePerson = function (id) {
                    $scope.id_edit = id;
                    $scope.focus = true;
                    $scope.person = Person.get({id: id});
                }


                $scope.deletePerson = function (id) {
                    swal({
                            title: "Tu es sur ?",
                            text: "Voulez vous vraiment supprimer cet produit ?!",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Oui, Supprimer",
                            cancelButtonText: "Non, Annuler!",
                            closeOnConfirm: false,
                            closeOnCancel: false },
                        function(isConfirm){
                            if (isConfirm) {
                                Person.delete({id: id}, function (res) {
                                    console.log(res);
                                    swal("Supprimer!", "le client a  été bien supprimer.", "success");
                                    $scope.persons = Person.query();
                                });
                            } else {
                                swal("Annuler", "La suppression du clien a été bien annulé :)", "error");
                            } });
                }
            })





    })