(function () {
    var module = angular.module("boilerplateModule");
    var controller = function ($scope) {
        var model = this;
        model.hiddenDatasetIndexes = [];

        $scope.$on('chart-create', function (evt, chart) {
            //console.log("chart-create", chart);
            model.chart = chart;
            var datasetUpdate = false;
            for(var i = 0; i < model.hiddenDatasetIndexes.length; i++){
                var datasetIndex = model.hiddenDatasetIndexes[i];
                var meta = model.chart.getDatasetMeta(datasetIndex);
                meta.hidden = true;
                datasetUpdate = true;
            }
            if(datasetUpdate){
                model.chart.update();
            }
            
        });
        $scope.$on('chart-update', function (evt, chart) {
            //console.log("chart-update", chart);
        });
        $scope.$on('chart-destroy', function (evt, chart) {
            //console.log("chart-destroy", chart);
            model.chart = null;
        });
        $scope.$on('redraw-data', function (){
            if(model.chart == null){
                return;
            }
            model.chart.update();
        });
        model.$onChanges = function (changes) {
            model.bindGraph();
        }
        model.chartType = null;
        model.fill = null;
        model.stacked = null;
        model.fixedAxis = null;
        
        model.xLabelOffset = true;
        model.yAxisPadding = 0;
        model.max_xAxisTicks = 15;

        model.toggleChartType = function (chartType) {
            model.chartType = chartType;
            if(model.chartType != 'line'){
                model.fill = false;
            }
            model.bindGraph();
        }

        model.toggleFill = function () {
            model.fill = !model.fill;
            model.bindGraph();
        }

        model.toggleStacked = function () {
            model.stacked = !model.stacked;
            model.bindGraph();
        }

        model.toggleFixedAxis = function () {
            model.fixedAxis = !model.fixedAxis;
            model.bindGraph();
        }

        // 'defaultType' : 'line',
        // 'defaultFill' : 'false',
        // 'defaultStackedBar' : false,   

        model.resetGraph = function () {
            model.fixedAxis = model.chartData.defaultFixedAxis;
            model.chartType = model.chartData.defaultType;
            model.fill = model.chartData.defaultFill;
            model.stacked = model.chartData.defaultStackedBar;
            model.bindGraph();
        }

        model.showResetButton = function () {
            if(model.chartData == null){
                return false;
            }
            if (model.chartType != model.chartData.defaultType ||
                model.fill != model.chartData.defaultFill ||
                model.stacked != model.chartData.defaultStackedBar ||
                model.fixedAxis != model.chartData.defaultFixedAxis) {
                return true;
            }
            return false;
        }

        model.noData = function(){
            if(model.chartData == null){
                return true;
            }
            else if(model.chartData.dataSets == null || model.chartData.dataSets.length == 0){
                return true;
            }
            return false;
        }

        model.bindGraph = function () {
            // if(model.chart){
            //     model.chart.destroy();
            // }

            //console.log("binding graph...", model.chartData);
            // console.log("Char type...", model.chartType);
            if (model.chartData == null) {
                return;
            }
            model.labels = model.chartData.labels;
            //a "bar" graph can display lines, bars and stacked bars

            if (model.chartType == null) {
                model.chartType = model.chartData.defaultType;
            }
            if (model.fill == null) {
                model.fill = model.chartData.defaultFill;
            }
            if (model.stacked == null) {
                model.stacked = model.chartData.defaultStackedBar;
            }
            if(model.fixedAxis == null){
                model.fixedAxis = model.chartData.defaultFixedAxis;
            }
            model.disableStacked = model.chartData.disableStacked;
            model.type = model.chartType;
            model.onClick = model.chartData.onClick;
            model.data = [];
            model.datasetOverride = [];
            model.colors = [];
            for (var dataSet of model.chartData.dataSets) {
                model.data.push(dataSet.data);
                model.colors.push(dataSet.color);
                model.datasetOverride.push({
                    label: dataSet.label,
                    type: model.chartType,
                    fill: model.fill,
                    hoverBackgroundColor: dataSet.hoverBackgroundColor,
                    hoverBorderColor: dataSet.hoverBorderColor,
                    borderDash: dataSet.borderDash
                });
            };
            if(model.options == null){
                model.options = {
                    tooltips: {
                        position: "nearest",
                        callbacks: {
                            label: function(tooltipItem, data) {
                                var labelName = data.datasets[tooltipItem.datasetIndex].label || '';
                                var labelValue = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] || null;
                                if(labelValue == null){
                                    return null;
                                }
                                if(model.options.plotLabelOptions.valueFormatter){
                                    labelValue = model.options.plotLabelOptions.valueFormatter(labelValue);
                                }                                
                                return labelName + ": " + labelValue;
                            }                           
                        }
                    },                    
                    maintainAspectRatio: false,
                    title: {
                        display: false,
                        text: model.chartData.title
                    },
                    //http://www.chartjs.org/docs/latest/configuration/legend.html
                    legend: {
                        display: true,
                        position:"top",
                        onClick: function(e, legendItem) {
                            //this is the original onclick event:
                            var index = legendItem.datasetIndex;
                            var ci = this.chart;
                            var meta = ci.getDatasetMeta(index);                       
                            meta.hidden = meta.hidden === null? !ci.data.datasets[index].hidden : null;
                            // We hid a dataset ... rerender the chart
                            ci.update();
                            //we want to persist crossed-out datasets, so we must save or remove the index
                            if(meta.hidden == true){
                                if(model.hiddenDatasetIndexes.indexOf(index) == -1){
                                    model.hiddenDatasetIndexes.push(index);
                                }
                            }
                            else{
                                var indexToRemove = model.hiddenDatasetIndexes.indexOf(index);
                                if(indexToRemove > -1){
                                    model.hiddenDatasetIndexes.splice(indexToRemove, 1);
                                }
                            }
                        },                        
                        labels: {
                            //padding: 20
                        }
                    },                    
                    layout: {
                        padding: {
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0
                        }
                    }                    
                };
            }

            //override defaults with supplied
            if(model.chartData.plotLabelOptions && model.options.plotLabelOptions == null){
                var incomingOptions = model.chartData.plotLabelOptions;
                model.options.plotLabelOptions = {
                    hideAll : incomingOptions.hideAll,
                    adjustValley : incomingOptions.adjustValley,
                    peakValleyOnly : incomingOptions.peakValleyOnly,
                    checkYCollision : incomingOptions.checkYCollision,
                    valueFormatter : incomingOptions.valueFormatter,
                    allBottom: incomingOptions.allBottom
                }                
            }
            //defaults
            else if(model.options.plotLabelOptions == null) {
                model.options.plotLabelOptions = {
                    hideAll : false,
                    adjustValley : false,
                    peakValleyOnly : false,
                    checkYCollision : false,
                    allBottom: false
                }
            }

            //stacked bar

            if (model.stacked == true) {
                model.options.scales = {
                    xAxes: [{
                        gridLines: {
                            offsetGridLines: true
                        },                           
                        stacked: true,
                        scaleLabel: {
                            display: false,
                            labelString: 'Month/Year'
                            },
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: model.max_xAxisTicks
                            }
                        }],
                    yAxes: [
                        {
                            stacked: true,
                            ticks: {
                                // max: model.chartData.max,
                                // min: model.chartData.min,
                                stepSize: model.chartData.stepSize,
                                padding: model.yAxisPadding
                            },
                            scaleLabel: {
                                display: true,
                                labelString: model.chartData.yAxisLabel
                            }
                        }
                    ]
                }
                if (model.fixedAxis) {
                    model.options.scales.yAxes[0].ticks = {
                        max: model.chartData.max,
                        min: model.chartData.min,
                        stepSize: model.chartData.stepSize
                    }
                }
            }
            else {
                model.options.scales = {
                    //xAxes will always be "month-year"
                    xAxes: [{
                        weight: 0,
                        position: "bottom",
                        offset: model.xLabelOffset,
                        gridLines: {
                            offsetGridLines: model.xLabelOffset
                        },                        
                        display: true,
                        scaleLabel: {
                            display: false,
                            labelString: 'Month-Year'
                        },
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: model.max_xAxisTicks
                        }
                    }],
                    yAxes: [
                        {
                            //id: 'Incidents',
                            type: 'linear',
                            display: true,
                            position: 'left',
                            scaleLabel: {
                                display: true,
                                labelString: model.chartData.yAxisLabel
                            },
                            ticks: {
                                // max: model.chartData.max,
                                // min: model.chartData.min,
                                stepSize: model.chartData.stepSize,
                                callback: function (value, index, values) {
                                    //format the Y-Axis
                                    //return '%' + value;
                                    if(model.chartData.yAxisFormatter){
                                        return model.chartData.yAxisFormatter(value);
                                    }
                                    return value;
                                }
                            }
                        },
                    ]
                }
                if (model.fixedAxis) {
                    model.options.scales.yAxes[0].ticks = {
                        max: model.chartData.max,
                        min: model.chartData.min,
                        stepSize: model.chartData.stepSize,
                        callback: function (value, index, values) {
                            if(model.chartData.yAxisFormatter){
                                return model.chartData.yAxisFormatter(value);
                            }
                            return value;
                        }                 
                    }
                }
                //Y - Axis labels padding
                model.options.scales.yAxes[0].ticks.padding = model.yAxisPadding 
            }
        }
    }

    module.component("chart", {
        bindings: {
            "chartData": "<"
        },
        templateUrl: "app/DashComponents/Common/chart.component.html",
        controllerAs: "model",
        controller: ["$scope", controller]

    });

}());