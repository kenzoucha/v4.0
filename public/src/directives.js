angular.module('StockDeal.directives',[])
    .value('FieldsTypes',{
        text: ['Text', 'should be a text'],
        textarea: ['TextArea', 'should be a textarea'],
        email: ['Email', 'should be an email address'],
        number: ['Number', 'should be a number'],
        date: ['Date', 'should be a date'],
        datetime: ['Datetime', 'should be a datetime'],
        time: ['Time', 'should be time'],
        month: ['Month', 'should be month'],
        week: ['week', 'should be week'],
        url: ['Url', 'should be a ulr'],
        tel: ['Phone Number', 'should be a phone number'],
        color: ['Color', 'should be color'],
        select: ['Select', 'select an item']
    })
    .directive('ngThumb',['$window', function ($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item){
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file){
                var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg[png|jpeg|bmp|gif|'. indexOf(type) !== -1;
            }
        }   ;
        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function(scope, element, attributes){
                if(!helper.support) return;
                var params = scope.$eval(attributes.ngThumb);
                console.log(element);
                if(!helper.isFile(params.file)) return;
                if(!helper.isImage(params.file)) return;
                var canvas = element.find('canvas');
                var reader = new FileReader();
                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);
                function onLoadFile(event){
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }
                function onLoadImage(){
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({width: width, height: height});
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        }
    }])
    .directive('formField', function(){
        return {
            restrict: 'E',
            templateUrl: 'src/partials/form-field.html',
            replace: true,
            scope: {
                record: '=',
                field: '@',
                categories: '='
            },
            link: function(scope, element, attrs){
            }

        }
    })
    .directive('newField', function(FieldsTypes){
        return {
            restrict: 'E',
            templateUrl: 'src/partials/new-field.html',
            replace: true,
            scope: {
                record: '='
            },
            link: function(scope, element, attrs){
                element.find('.dropdown-button').dropdown({
                        inDuration: 300,
                        outDuration: 225,
                        constrain_width: false, // Does not change width of dropdown to that of the activator
                        hover: true, // Activate on hover
                        gutter: 0, // Spacing from edge
                        belowOrigin: false, // Displays dropdown below the button
                        alignment: 'left' // Displays dropdown with edge aligned to the left of button
                    }
                );
                scope.types = FieldsTypes;
                scope.field = {};
                scope.remove = function(){
                    scope.field = {};
                    scope.display = false;
                }
                scope.show = function(type){
                    scope.f = type;
                    if(type === "select"){
                        scope.field.type = "text";
                    }else{
                        scope.field.type = type;
                    }
                    scope.display = true;
                }
                scope.add = function(){
                    scope.record[scope.field.value] = [scope.field.value,scope.field.type];
                    scope.remove();
                }
            }
        }
    });