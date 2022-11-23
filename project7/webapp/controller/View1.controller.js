sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/core/library",
        "sap/viz/ui5/data/FlattenedDataset",
        "sap/viz/ui5/controls/common/feeds/FeedItem",
        "sap/m/Label",
        "sap/m/ColumnListItem",
        "sap/m/library",
        "sap/m/MessageToast",
        "sap/m/Column",
        'sap/viz/ui5/format/ChartFormatter',
        'sap/viz/ui5/api/env/Format',
        "sap/ui/core/format/DateFormat"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, CoreLibrary, FlattenedDataset, FeedItem, Label, ColumnListItem, MobileLibrary, MessageToast, Column, ChartFormatter, Format, DateFormat) {
        "use strict";

        var ValueState = CoreLibrary.ValueState;

        return Controller.extend("project7.controller.View1", {

            _constants: {
                sampleName: "project7/model",
                chartContainerId: "idChartContainer",
                vizFrame: {
                    id: "idoVizFrame",
                    dataset: {
                        dimensions: [{ // [{Country:  , Revenue:},{Country:  , Revenue:}]
                            name: 'Country',
                            value: "{Country}"
                        }],
                        measures: [{
                            group: 1,
                            name: "Profit",
                            value: "{Profit}"
                        }, {
                            group: 1,
                            name: "Target",
                            value: "{Target}"
                        }, {
                            group: 1,
                            name: "Forecast",
                            value: "{Forecast}"
                        }, {
                            group: 1,
                            name: "판매량",
                            value: "{Revenue}"
                        }, {
                            group: 1,
                            name: "Revenue2",
                            value: "{Revenue2}"
                        }, {
                            group: 1,
                            name: "Revenue3",
                            value: "{Revenue3}"
                        }],
                        data: {
                            path: "/Products"
                        }
                    },
                    type: "line",
                    feedItems: [{
                        "uid": "primaryValues",
                        "type": "Measure",
                        "values": ["판매량"]
                    }, {
                        "uid": "axisLabels",
                        "type": "Dimension",
                        "values": ["Country"]
                    }, {
                        "uid": "targetValues",
                        "type": "Measure",
                        "values": ["Target"]
                    }]
                }



            },

            onInit: function () {

                
            },
            onFilter: function() {
                var oView = this.getView()
                var aFilter = this._getFilters();

                oView.byId("idProductsTable").getBinding("items").filter(aFilter);

                this._getchartData();
                
            },

            _getFilters: function () {
                var oView = this.getView();
                var oInput1 = oView.byId("Date1").getDateValue();
                oInput1 = DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" }).format(oInput1);


                var aFilter = []


                    aFilter.push(new Filter("Sdate", "EQ", oInput1));
                

                return aFilter;
            },
            onGraph: function () {


                //create chart content
                var oVizFrame = this.getView().byId(this._constants.vizFrame.id);

                this._updateVizFrame(oVizFrame);
                var oPopOver = this.getView().byId("idPopOver");
                oPopOver.connect(oVizFrame.getVizUid());
                // oPopOver.setFormatString(formatPattern.STANDARDFLOAT);
            },
            _getChartData: function () { //직영점의 기간 별 매출
                var oView = this.getView();
                var aFilter = this._getFilters();
                var oModel = oView.getModel("chart2");
                var oChart = this.byId("idoVizFrame2");

                var oDataModel = this.getView().getModel();
                oDataModel.read("/ZZ2C_CHART", {
                    filters: aFilter,
                    success: function (oReturn) {
                        // console.log(oReturn); // json data
                        var okok = oReturn.results.reduce(function (pre, item) {
                            if (!pre[item.Rvdate]) pre[item.Rvdate] = [];
                            pre[item.Rvdate].push(item);

                            return pre;


                        }, {})

                        var aDataSet = [];
                        var sDateString = "";
                        var sPrice;

                        for (let i in okok) {
                            okok[i].forEach(function (element) {

                                element.Rvdate = DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" }).format(element.Rvdate);
                                // if(sDateString === element.Rvdate) {
                                //     element.Tprice = element.Tprice + sPrice;

                                // }else{

                                // }
                                // sDateString = element.Rvdate;
                                // sPrice = element.Tprice;
                                // if(element.Rvdate)

                                var oData = { Country: element.Rvdate, Revenue: parseInt(element.Tprice) };
                                aDataSet.push(oData);

                            })
                        }
                            const groupBySubject = (arr = []) => {
                            const map = {};
                            let res = [];
                            res = arr.reduce((acc, val) => {
                                const { Country, Revenue } = val;
                                const { length: l } = acc;
                                if (map.hasOwnProperty(Country)) {
                                    acc[map[Country]]['Revenue'] = acc[map[Country]]['Revenue'] + Revenue;
                                }
                                else {
                                    map[Country] = l;
                                    acc.push({
                                        Country: Country,
                                        Revenue: +Revenue
                                    });
                                };
                                return acc;
                            }, []);
                            return res;
                        };
                        console.log(groupBySubject(aDataSet));
                        aDataSet = groupBySubject(aDataSet);
                        this.oChartData2 = { Products: aDataSet };

                    }.bind(this),

                    error: function (oError) {

                    }
                })

            },

            _updateVizFrame: function (vizFrame) {
                var oVizFrame = this._constants.vizFrame;
                var oDataset = new FlattenedDataset(this._constants.vizFrame.dataset);

                if (!vizFrame.getDataset()) {
                    var oModel = new JSONModel(this.oChartData);
                    vizFrame.setDataset(oDataset);
                    vizFrame.setModel(oModel);
                    this._addFeedItems(vizFrame, oVizFrame.feedItems);
                } else {
                    vizFrame.getModel().setProperty("/", this.oChartData);
                }
                vizFrame.setVizType(oVizFrame.type);
            },
            _addFeedItems: function (vizFrame, feedItems) {
                for (var i = 0; i < feedItems.length; i++) {
                    vizFrame.addFeed(new FeedItem(feedItems[i]));
                }
            },
            _createLabels: function (labelTexts) {
                return this._createControls(Label, "text", labelTexts);
            },
            _createControls: function (Control, prop, propValues) {
                var aControls = [];
                var oProps = {};
                for (var i = 0; i < propValues.length; i++) {
                    oProps[prop] = propValues[i];
                    aControls.push(new Control(oProps));
                }
                return aControls;
            },






            // handleChange: function (oEvent) {
            //     var oText = this.byId("textResult"),
            //         oDP = oEvent.getSource(),
            //         sValue = oEvent.getParameter("value"),
            //         bValid = oEvent.getParameter("valid");
    
            //     this._iEvent++;
            //     oText.setText("Change - Event " + this._iEvent + ": DatePicker " + oDP.getId() + ":" + sValue);
    
            //     if (bValid) {
            //         oDP.setValueState(ValueState.None);
            //     } else {
            //         oDP.setValueState(ValueState.Error);
            //     }
            // },

        });
    });
