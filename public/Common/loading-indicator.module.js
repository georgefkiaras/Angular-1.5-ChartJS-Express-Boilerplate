//http://intown.biz/2015/02/05/waiting-indicator/
(function () {
    "use strict";
    var module = angular.module('loadingIndicator', []);

    module.directive("loadingIndicator", function (loadingCounts, $timeout) {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                scope.$on("loading-started", function (e) {
                    loadingCounts.enable_count++;
                    $timeout(function () {
                        if (loadingCounts.enable_count > loadingCounts.disable_count) {
                            element.css({ "display": "" });
                        }
                    }, 0);
                });
                scope.$on("loading-complete", function (e) {
                    loadingCounts.disable_count++;
                    if (loadingCounts.enable_count == loadingCounts.disable_count) {
                        element.css({ "display": "none" });
                    }
                });
            }
        };
    });

    module.config(function ($httpProvider) {
        $httpProvider.interceptors.push(function ($q, $rootScope) {
            return {
                'request': function (config) {
                    $rootScope.$broadcast('loading-started');
                    return config || $q.when(config);
                },
                'response': function (response) {
                    $rootScope.$broadcast('loading-complete');
                    return response || $q.when(response);
                },
                'responseError': function (rejection) {
                    $rootScope.$broadcast('loading-complete');
                    return $q.reject(rejection);
                }
            };
        });
    });

    module.factory('loadingCounts', function () {
        return {
            enable_count: 0,
            disable_count: 0
        }
    });

}());