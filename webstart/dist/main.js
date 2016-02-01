/**
 *  @author LinQunHe
 *  @date 2016-1-14
 */
requirejs.config({
    "baseUrl": "../dist/lib/",
    "paths": {
        jquery: "jquery/dist/jquery.min",
        bootstrap: "bootstrap/dist/js/bootstrap.min",
        validation: "jquery-validation/dist/jquery.validate.min.js",
        es6: 'requirejs-babel/es6',
        babel: 'requirejs-babel/babel-5.8.34.min',
        echarts:'echarts/dist/echarts.min'
    },
    "shim": {
        "bootstrap": ["jquery"],
        "validation": ["jquery"]
    }
});
// Load the main app module to start the app
require(
    [
        'echarts'
    ],
    function (ec) {
        // 基于准备好的dom，初始化echarts图表
        var myChart = ec.init(document.getElementById('main'));

        var option = {
            tooltip: {
                show: true
            },
            legend: {
                data: ['销量']
            },
            xAxis: [
                {
                    type: 'category',
                    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    "name": "销量",
                    "type": "bar",
                    "data": [5, 20, 40, 10, 10, 20]
                }
            ]
        };

        // 为echarts对象加载数据
        myChart.setOption(option);
    }
);