
/**
 * Created by Administrator on 2017/3/3 0003.
 */
import React, { Component } from "react"
import "./NewUserTrackTable.less"
var g_index = -1;
export default class NewUserTrackTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "kpi": {
                "id": "01",
                "title": "发展用户"
            },
            "thData": [
                {
                    "year": "2015年",
                    "months": [
                        "1月",
                        "2月"
                    ]
                },
                {
                    "year": "2016年",
                    "months": [
                        "1月",
                        "2月",
                        "3月",
                        "4月"
                    ]
                },
                {
                    "year": "2017年",
                    "months": [
                        "1月",
                        "2月",
                        "3月"
                    ]
                }
            ],
            "tbodyData": [
                {
                    "year": "2015年",
                    "months": [
                        {
                            "month": "1月",
                            "net_value": "220",
                            "obs_values": [
                                "111",
                                "222",
                                "333",
                                "333",
                                "3333",
                                "3333",
                                "444",
                                "3333",
                                "444"
                            ]
                        },
                        {
                            "month": "2月",
                            "net_value": "220",
                            "obs_values": [
                                "111",
                                "222",
                                "333",
                                "333",
                                "3333",
                                "3333",
                                "444",
                                "3333",
                                "444"
                            ]
                        },
                        {
                            "month": "3月",
                            "net_value": "220",
                            "obs_values": [
                                "111",
                                "222",
                                "333",
                                "333",
                                "3333",
                                "3333",
                                "444",
                                "3333",
                                "444"
                            ]
                        },
                        {
                            "month": "4月",
                            "net_value": "220",
                            "obs_values": [
                                "111",
                                "222",
                                "333",
                                "333",
                                "3333",
                                "3333",
                                "444",
                                "3333",
                                "444"
                            ]
                        }
                    ]
                },
                {
                    "year": "2016年",
                    "months": [
                        {
                            "month": "1月",
                            "net_value": "220",
                            "obs_values": [
                                "111",
                                "222",
                                "333",
                                "333",
                                "3333",
                                "3333",
                                "444",
                                "3333",
                                "444"
                            ]
                        },
                        {
                            "month": "2月",
                            "net_value": "220",
                            "obs_values": [
                                "111",
                                "222",
                                "333",
                                "333",
                                "3333",
                                "3333",
                                "444",
                                "3333",
                                "444"
                            ]
                        },
                        {
                            "month": "3月",
                            "net_value": "220",
                            "obs_values": [
                                "111",
                                "222",
                                "333",
                                "333",
                                "3333",
                                "3333",
                                "444",
                                "3333",
                                "444"
                            ]
                        },
                        {
                            "month": "4月",
                            "net_value": "220",
                            "obs_values": [
                                "111",
                                "222",
                                "333",
                                "333",
                                "3333",
                                "3333",
                                "444",
                                "3333",
                                "444"
                            ]
                        }
                    ]
                }
            ]
        }
    }

    getDepth = (data) => {
        return data.months.length;
    }
    componentDidMount = () => {
        /*给表格画表头斜线*/
        // var myCanvas = document.getElementById("myCanvas-nutt");
        var myCanvas = this.refs.myCanvasNUTT;
        var width = myCanvas.width;
        var height = myCanvas.height;
        var ctx = myCanvas.getContext("2d");
        ctx.strokeStyle = "#ffffff";
        ctx.moveTo(0, 0);
        ctx.lineTo(width, height);
        ctx.stroke();


        /*根据表格列数给表格设置宽度*/
        var tableId = this.props.tableId;
        var _tds = this.state.tbodyData[0].months[0].obs_values.length + 3;
        console.log('_tds',_tds);
        document.getElementById(tableId).width = _tds * 100 + "px";
    }
    getNormalTdStyle = (gindex) => {
        return gindex % 2 == 0 ? "bg-white" : "bg-gray border-bottom";
    }
    getTableNode = (table, _net_year, data, depth, obsLastMontIndex) => {
        if (data.length > 0) {
            data.map((netMonth, index) => {
                g_index++;
                var obj = null;
                var _obs_values = netMonth.obs_values;
                if (_obs_values.length > 0) {
                    var normalTd = _obs_values.map((obsValue, index) => {
                        return (
                            <td className={this.getNormalTdStyle(g_index, index) + " " + this.isShowBorderRight(index, obsLastMontIndex)}>{obsValue}</td>
                        );
                    })
                }
                if (index == 0) {

                    obj = <tr>
                        <td rowSpan={depth} className="kpi-bg">{_net_year}</td>
                        <td className="kpi-bg">{netMonth.month}</td>
                        <td className="kpi-bg">{netMonth.net_value}</td>
                        {normalTd}
                    </tr>

                }
                else {

                    obj = <tr>
                        <td className="kpi-bg">{netMonth.month}</td>
                        <td className="kpi-bg">{netMonth.net_value}</td>
                        {normalTd}
                    </tr>

                }
                if (obj) {
                    table.push(obj);
                }
            })
        }
    }
    getTable = (tree, data, obsLastMontIndex) => {
        if (data.length > 0) {
            data.map((netYear, index) => {
                var _data = netYear.months;
                var _depth = this.getDepth(netYear);
                var _net_year = netYear.year;
                this.getTableNode(tree, _net_year, _data, _depth, obsLastMontIndex);
            })
        }
    }
    /*
     * 该函数用来给相应的td或th添加右边的边框线
     * index改td或th的索引
     * obsMonth记录观察年月中每个年中最后一个月份所对应的索引。
     * */
    isShowBorderRight = (index, obsMonth) => {
        return obsMonth.indexOf(index + 1) != -1 ? "border-right" : "";
    }
    render = () => {
        var table_id = this.props.tableId;
        var kpi = this.state.kpi;
        var thData = this.state.thData;
        var obs_month = thData[0].months;
        var tree = [];
        var _obs_lastmonth_index = [thData[0].months.length];//记录观察年月中每个年中最后一个月份所对应的索引。
        var tbodyData = this.state.tbodyData;
        if (thData.length > 0) {
            var obs_year_th = thData.map((obsYear, index) => {
                var _depth = this.getDepth(obsYear);
                if (index > 0) {
                    _obs_lastmonth_index.push(_obs_lastmonth_index[_obs_lastmonth_index.length - 1] + obsYear.months.length);
                    Array.prototype.push.apply(obs_month, obsYear.months);
                }
                return (
                    <th colSpan={_depth} className="bg-gray border-right">
                        {obsYear.year}
                    </th>
                );
            })
        }
        if (obs_month.length > 0) {
            var obs_month_th = obs_month.map((obsMonth, index) => {
                return (
                    <th className={this.isShowBorderRight(index, _obs_lastmonth_index) + " bg-gray border-bottom"}>
                        {obsMonth}
                    </th>
                );
            })
        }
        this.getTable(tree, tbodyData, _obs_lastmonth_index);
        return (
            <div className="new-user-track-table-box">
                <canvas ref="myCanvasNUTT" className="myCanvas"></canvas>
                <table id={table_id} className="new-user-track-table">
                    <thead>
                        <tr>
                            <th colSpan="2" rowSpan="2" className="kpi-bg">
                                <div style={{ textAlign: "right", marginRight: "20px" }}>观察年月</div>
                                <div style={{ textAlign: "left", marginLeft: "20px" }}>入网年月</div>
                            </th>
                            <th rowSpan="2" className="kpi-bg">{kpi.title}</th>
                            {obs_year_th}
                        </tr>
                        <tr>
                            {obs_month_th}
                        </tr>
                    </thead>
                    <tbody>
                        {tree}
                    </tbody>
                </table>
            </div>
        );
    }
}