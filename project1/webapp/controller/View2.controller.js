sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox",

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageToast, Filter, FilterOperator, History, MessageBox) {
        "use strict";

        return Controller.extend("zz2.project1.controller.View2", {

            onInit: function () {

                // var oViewModel = new JSONModel({
                //     busy : false,
                //     delay : 0,
                //     lineItemListTitle : this.getResourceBundle().getText("123456789")
                // });

                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteView2").attachPatternMatched(this._onObjectMatched, this);

                this.getView().setModel(new JSONModel(), "detailView");

                // this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
            },

            _onObjectMatched: function (oEvent) {
                // oEvent.getParameters();
                var oArgu = oEvent.getParameter("arguments");
                var oModel = this.getView().getModel("detailView");
                var oFilter = new Filter("Binum", "EQ", oArgu.Binum2);


                oModel.setProperty("/title", oArgu.Binum2);


                var aFilter = [oFilter];
                aFilter.push(oFilter);
                var oTable = this.byId("detailTable");
                oTable.getBinding("rows").filter(aFilter);

                // // 2. 키값 가져와서 조건에 맞는 값 조회
                // this.getOwnerComponent().getModel("sub").read("/ZZ2C_SORDER_CDS", { 
                //     filters: [oFilter/* 2-1. 필터모델 구현 - 키값이랑 맞는(EQ) 데이터만 조회 해라 */],
                //     success: function(oReturn) {
                //         var results = oReturn.results;
                //         results[0].Binum
                //         // debugger;   
                //         // oReturn 에 그 단건 데이터가 들어올거니까 얘를 상세페이지에 데이터를 출력하면 된다.

                //         // 여기까지 해서 S10001 데이터만 호출해보기.
                //     },
                //     error: function(oError) {

                //     }
                // })
            },

            onNavBack: function () {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();
                var oRouter = this.getOwnerComponent().getRouter();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);

                } else {
                    oRouter.navTo("RouteView1");
                }

            },
            okok: function () {
                // put요청: /sap/opu/odata/sap/ZGWSALESBOO_SRV/SalesOrderSet + KEY + BODY
                var oModel = this.getView().getModel("list"); // odata Model
                var oSubModel = this.getView().getModel("sub");
                var oTable = this.byId("detailTable");
                var sPath = oTable.getRows()[0].getBindingContext("sub").getPath();
                var oRowData = oTable.getRows()[0].getBindingContext("sub").getModel().getObject(sPath);
                var oSafeModel = this.getView().getModel("safe");

                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();
                var oRouter = this.getOwnerComponent().getRouter();


                var result = confirm("입고 처리 하시겠습니까?");



                var odata = { // UPDATE 요청 시 JSON DATA로 Body 구성
                    "Binum": oRowData.Binum,
                    "Stcod": oRowData.Stcod,
                    "Bdate": oRowData.Bdate,
                    "Stnam": oRowData.Stnam,
                    "Statu": "배송완료"
                };
                var path = oModel.createKey("/ZZ2C_SORDERH", { // "/SalesOrderSet('선택ROW의Sonum값')" 와 같음
                    Binum: oRowData.Binum,
                    Stcod: oRowData.Stcod
                }); // 내부적으로는 "/SalesOrderSet"('선택ROW의Sonum값')의 형태가 됨.

                // oSafeModel.read("/ZZ2C_SAFES", { success: function(oData){console.log(oData)}, error : function(err){console.log(err)} });
                // return;
                if (result) {

                    oModel.update(path, odata, {

                        success: function (oReturn) { //성공 시 함수 실행
                            MessageBox.success("물품 입고 완료");
                            oSubModel.refresh(true);

                            setTimeout(function () {
                                if (sPreviousHash !== undefined) {
                                    window.history.go(-1);

                                } else {
                                    oRouter.navTo("RouteView1");
                                }
                            }, 1500);



                        },


                        error: function (oError) {
                            sap.m.MessageToast.show("에러발생!");
                        }, // 에러 발생 시 함수 실행

                    })
                }
                else {
                    MessageBox.information("취소되었습니다.");
                }


                // Server에 PUT 요청을 보냄.

                var oView = this.getView();
                var oModel = oView.getModel("safe");
                

                var oData = this._getUpdateDate();
                var oSendData = {
                    "GETDATA" : oData
                }

                oModel.create("/SAFESUMSet", oSendData, {
                    success : function(oReturn) {
                        // sap.m.MessageBox.success("실사 데이터를 저장하였습니다.",
                        //  {
                        //     onClose: function (sAction) {
                        //         sap.m.MessageToast.show("뒤로 가기");
                        //     }
                        // });
                    },
                    error: function(oError) {
                        // debugger;
                    }
                });


            },

            _getUpdateDate : function () {
                // var oTable = this.byId("detailTable"),
                //     oItems = oTable.getRows();
                var oData = [];
                var oDataSet = this.getView().getModel("sub").getProperty("/");
                for(var objName in oDataSet){
                    oData.push({
                        Gocod : oDataSet[objName].Gocod, //"GocodValue"
                        Goqua : oDataSet[objName].Quant
                    })
                }

                return oData;
                // oData
                
            }
        });
    });