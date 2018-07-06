(function () {
    var module = angular.module("boilerplateModule", ["chart.js", "loadingIndicator", "ngComponentRouter", "rzModule", "ui.bootstrap", "ngAnimate","ngCookies"]);
    module.config(function ($locationProvider) {
        //Set HTML5 mode routing if we are not on IE
        $locationProvider.html5Mode(!BoilerplateDefaults.isIE);
    })
    module.value("$routerRootComponent", "boilerplateRoot");
    module.config(function($httpProvider) {
        $httpProvider.interceptors.push(function($q, $rootScope) {
          return {
            responseError: function(rejection) {
                $rootScope.$broadcast("httpError", rejection);
            }
          };
        });
      });
}());