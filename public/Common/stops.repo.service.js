(function () {
    var module = angular.module("stopsRepoService", []);
    module.service("stopsRepo", stopsRepo);

    'use strict';

    stopsRepo.$inject = ['$http'];
    function stopsRepo($http) {

        var getStop = function (stopId) {
            return $http.get("../../api/Stop/" + stopId).then(function (response) {
                return response.data;
            });
        };

        var getStops = function () {
            return $http.get("../../api/Stops/", { cache: true }).then(function (response) {
                return response.data;
            });
        };


        return {
            getStop: getStop,
            getStops: getStops,
        };
    }


}());

