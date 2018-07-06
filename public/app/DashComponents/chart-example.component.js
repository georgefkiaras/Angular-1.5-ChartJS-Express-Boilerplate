(function () {
    var module = angular.module("boilerplateModule");
    var controller = function ($http) {
        var model = this;
       console.log("chart-example controller.");
        model.plotLabelOptions = {
            hideAll : true,
            adjustValley : false,
            peakValleyOnly : false,
            checkYCollision : false,
            allBottom: true,
            valueFormatter : function(value){
                return value.toFixed(1);
            }            
        }         

        model.yAxisFormatter = function(value){
            return value;
        }        

        //use to pass filters to the back-end
        var filters = {};
 
        var getData = function(){
            $http.post("/api/data", filters).then(function (response) {
                console.log("results", response);
                var labels = [];
                var cosDataArray = [];
                var sinDataArray = [];
                var tanDataArray = [];
                
                for (var i = 0; i < response.data.length; i++) {
                    var dataItem = response.data[i];
                    cosDataArray.push(dataItem.cos);
                    sinDataArray.push(dataItem.sin);
                    tanDataArray.push(dataItem.tan);
                    labels.push(dataItem.xValue);
                }
                

                var cosDataSet = {
                    'data': cosDataArray,
                    'color': "#01B8AA",
                    'label': "Cos",            
                };
                var sinDataSet = {
                    'data': sinDataArray,
                    'color': "#F2C80F",
                    'label': "Sin",            
                };
                var tanDataSet = {
                    'data': tanDataArray,
                    'color': "#FD625E",
                    'label': "Tan",            
                };                
                model.environmentChartData = {
                    'labels': labels,
                    'dataSets': [cosDataSet,sinDataSet,tanDataSet],
                    'defaultType': 'line',
                    'defaultFill': false,
                    'defaultStackedBar': false,
                    'defaultFixedAxis' : false,
                    'min': -2,
                    'max': 2,
                    'stepSize': 1,
                    'yAxisLabel': 'Value',
                    'plotLabelOptions':model.plotLabelOptions,
                    'yAxisFormatter':model.yAxisFormatter,
                    'disableStacked': false,
                    'onClick': function (points, evt) { console.log(points, evt); }
                };
            });
        }
        getData();        

    }

    module.component("chartExample", {
        templateUrl: "app/DashComponents/chart-example.component.html",
        bindings: {

        },        
        controllerAs: "model",
        controller: ["$http", controller]
    });
    
}());