(function() {
    "use strict";
    var module = angular.module("boilerplateModule");
    var controller = function($cookies, $scope){
        var model = this;
        model.$onInit = function() {
            var isDarkTheme = $cookies.get('isDarkTheme');    
            if(isDarkTheme == 'false'){
                model.darkTheme = false;
                Chart.defaults.global.defaultFontColor = "#666";
            }
            else{
                model.darkTheme = true;
                Chart.defaults.global.defaultFontColor = "#FFFFFF";                
            }
        }

        model.darkTheme = true;
        model.setDarkTheme = function(isDark) {
            model.darkTheme = isDark;
            Chart.defaults.global.defaultFontColor = (isDark ? "#FFFFFF" : "#666");    
            $scope.$broadcast('redraw-data')       
            $cookies.put('isDarkTheme', isDark);
        }
        model.hasError = false;
        $scope.$on("httpError", function(event, rejection){
            model.hasError = true;
            model.errorData = rejection.data;
            model.errorText = rejection.statusText;
            console.log("boilerplate root component received httpError: ", rejection);
        });
    }


    module.component("boilerplateRoot", {
        templateUrl: "app/boilerplate-root.component.html",
        controllerAs: "model",
        controller: ["$cookies", "$scope", controller],
        $routeConfig: [
            { path: "/chart-example", component: "chartExample", name: "ChartExample" },
            { path: "/**", redirectTo: ["ChartExample", ""] }
        ]                   
    });     
}());