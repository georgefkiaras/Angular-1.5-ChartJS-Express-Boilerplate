Chart.plugins.register({
    afterDatasetsDraw: function (chart) {

        var ctx = chart.chart.ctx;
        var fontSize = 12;
        var fontStyle = 'normal';
        var fontFamily = 'Arial';

        ctx.fillStyle = Chart.defaults.global.defaultFontColor;
        ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';


        var xAxisYPoints = [];

        chart.data.datasets.forEach(function (dataset, i) {
            var meta = chart.getDatasetMeta(i);
            if (meta.type != 'line') {
                //no labels for anything but line graphs
                return;
            }
            var options = chart.options.plotLabelOptions;
            if (options.hideAll) {
                return;
            }

            var lastX = 0;
            var lastY = 0;
            //set "firstPass" to true to disable 1st label
            var firstPass = false;
            if (!meta.hidden) {
                meta.data.forEach(function (element, index) {
                    //Custom label formatting can go here.
                    //Just naively convert to string for now
                    
                    //determine the label string and current value
                    var dataString = "";
                    var currentValue = 0;
                    if (dataset.data[index] != null) {
                        var item = dataset.data[index];
                        if (options.valueFormatter) {
                            dataString = options.valueFormatter(item);
                        }
                        else {
                            dataString = item.toString();
                        }

                        currentValue = item;
                    }

                    //determine previous and next values for peaks and valleys
                    var previousValue = 0;
                    var nextValue = 0;
                    if (index > 0) {
                        previousValue = dataset.data[index - 1];
                    }
                    if (index < (dataset.data.length - 1)) {
                        nextValue = dataset.data[index + 1];
                    }

                    // Make sure alignment settings are correct
                    var padding = 5;
                    var position = element.tooltipPosition();
                    var thisX = position.x;
                    var thisY = position.y - (fontSize / 2) - padding;
                    //console.log(options.allBottom);
                    if(options.allBottom == true){
                        thisY = position.y + (fontSize / 2) + padding;
                    }
                    var txtWidth = ctx.measureText(dataString).width;

                    //render flag--render everything except in peak/valley scenarios
                    var render = !options.peakValleyOnly;

                    if (currentValue < previousValue && currentValue < nextValue) {
                        //we are in a "valley"
                        if (options.adjustValley) {
                            //show the value underneath the point
                            thisY = position.y + (fontSize / 2) + padding;
                        }
                        if (options.peakValleyOnly) {
                            render = true;
                        }
                    }

                    if (currentValue > previousValue && currentValue > nextValue && options.peakValleyOnly) {
                        //we are in a "peak"
                        render = true;
                    }

                    //check for any previous items drawn on this x-axis location
                    //this routine tries to deal with multiple lines in a graph.
                    if (xAxisYPoints[thisX + txtWidth + padding] != null) {
                        var yPoints = xAxisYPoints[thisX + txtWidth + padding];
                        for (var i = 0; i < yPoints.length; i++) {
                            var yPoint = yPoints[i];
                            if (thisY < yPoint + (fontSize + padding) && thisY > yPoint - (fontSize + padding)) {
                                render = false;
                                
                                break;
                            }
                        }
                    }


                    if (thisX > lastX && firstPass == false && render) {
                        //avoid collisions on the x axis
                        //do not draw the first item
                        ctx.fillText(dataString, thisX, thisY);
                        lastX = thisX + txtWidth + padding;
                        lastY = thisY;

                        //keep an array of y-axis items on this x-axis for multiple-lined graphs
                        //var additionalYPoints = xAxisYPoints[lastX];
                        if (xAxisYPoints[lastX] == null) {
                            xAxisYPoints[lastX] = [lastY];
                        }
                        else {
                            xAxisYPoints[lastX].push(lastY);
                        }


                        //debugging with rectangles
                        // ctx.strokeStyle="red";
                        // var rectX = thisX - (txtWidth/2);
                        // var rectY = thisY - (fontSize/2);
                        // ctx.rect(rectX, rectY, txtWidth, fontSize);
                        //ctx.rect(thisX, thisY, 1, 1);
                        //ctx.stroke();
                    }
                    else if (options.checkYCollision &&
                        firstPass == false &&
                        render &&
                        (thisY > lastY + (fontSize + padding) || thisY < lastY - (fontSize + padding))) {
                        //if we colide on  x, see if we have room above or below
                        ctx.fillText(dataString, thisX, thisY);
                        lastX = thisX + txtWidth + padding;
                        lastY = thisY;

                        if (xAxisYPoints[lastX] == null) {
                            xAxisYPoints[lastX] = [lastY];
                        }
                        else {
                            xAxisYPoints[lastX].push(lastY);
                        }


                    }

                    if (firstPass == true) {
                        firstPass = false;
                    }

                });
            }
            //console.log("xAxisYPoints: ", xAxisYPoints);
        });
    }
});