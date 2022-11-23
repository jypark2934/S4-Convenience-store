sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter) {
        "use strict";

        return Controller.extend("project1.controller.View2", {            

            onInit: function () {
                
                // 1. getData하면서 차트까지 같이 적용
                this._getData();


                // var chartData = this.getView().getModel().getProperty("/");
                // var oData = {
                //     milk : chartData
                // };
                // var oModel = new JSONModel(oData);
                // this.getView().setModel(oModel);

                var oVizFrame = this.byId("idVizFrame");
                var oPopOver = this.getView().byId("idPopOver");
                oPopOver.connect(oVizFrame.getVizUid());

            },

            _getData: function() {
                /*
                    1. .read("/엔터티셋", {success: function(oReturn) {
                        oReturn.results  <<= 전체 데이터 가져오기
                    }})
                    2. oReturn.results.forEach(function(item){
                        무슨월 = item.배송날짜.getMonth()+1
                    })
                */
                var oView = this.getView();
                this.getOwnerComponent().getModel("list").read("/ZZ2C_CORDERFIORI", {
                    filters: [new Filter('Gocod', 'Contains', 'LU')],
                    success: function(oReturn) {
                        var chartData = [];
                        // 2. read로 가져온 데이터 사용
                        var arr = oReturn.results

                        // 3. 임시데이터 사용
                        // var arr = [
                        //     {"Hopedate" : new Date(), "Deliflag" : "N"},
                        //     {"Hopedate" : new Date(), "Deliflag" : "Y"},
                        //     {"Hopedate" : new Date(2022,8,10), "Deliflag" : "Y"},
                        //     {"Hopedate" : new Date(2022,8,12), "Deliflag" : "N"},
                        //     {"Hopedate" : new Date(2022,8,3), "Deliflag" : ""}
                        // ]

                        // 월별 complete 건 / total 건 데이터 구성
                        // 4. month, complete, total 이 배열로 있는 charData 배열 반들기
                        var oMonths = arr.reduce(function(pre, item) {
                            var sMonth = item.Hopedate.getMonth()+1;
                            if(!pre[sMonth]) pre[sMonth] = {month : sMonth +'월', complete : 0, total : 0};
                            
                            if(item.Deliflag === "Y") { pre[sMonth].complete++; }
                            pre[sMonth].total++;
                        
                            return pre;
                        }, {});

                        for(let i in oMonths) {
                            if(oMonths.hasOwnProperty(i)){
                                chartData.push(oMonths[i]);
                            }
                        }

                        console.log(chartData);
                        var oData = {
                            milk : chartData
                        };
                        var oModel = new JSONModel(oData);
                        oView.setModel(oModel);
                    }
                })
            },

            onFirst : function(oEvent) {

                                var oView = this.getView();
                                var oRouter = this.getOwnerComponent().getRouter();
                                oRouter.navTo("RouteView1", {
                                    Binum : oEvent.getSource().getText()
                                });
                
                            }

        });
    });
