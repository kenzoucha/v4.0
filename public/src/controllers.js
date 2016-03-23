angular.module('StockDeal.controllers',['toaster','ngAnimate'])
.controller('ImageCtrl', function ($scope, Upload, $stateParams, utils, toaster, $state) {
        $scope.imgs = [];
        $scope.uploadFiles = function(files){
            $scope.imgs = files;
            $scope.removeImg = function(img){
                files.splice(files.indexOf(img),1);
                toaster.pop("success", null,img.name + " a bien retiré de la liste");
            }
            $scope.afterDrop = true;
        $scope.uploadAll = function () {
            Upload.upload({
                url: 'http://localhost:3000/api/upload/'+$stateParams.productId,
                data: {file: files}
            }).then(function(resp){
                toaster.pop(resp.data.status, null,resp.data.message);
                var obj = utils.findById($scope.products,$stateParams.productId);
                $scope.products = $scope.products.push(resp.data.product);
                $state.go('products.list');
            });
        }
    }
});