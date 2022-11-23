sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel',
    "sap/ui/model/Filter",
    "sap/m/MessageToast",
    "sap/ui/core/routing/History",
],

    function (Controller, JSONModel, Filter, MessageToast, History) {
        "use strict";

        return Controller.extend("zz2.project2.controller.View2", {

            onInit: function () {


                this.onRead();
                var oView = this.getView();

                var oTable = oView.byId("idProductsTable");
                var oJSONModel = this.getOwnerComponent().getModel("main");
                var iTotal = 0;
                var iTotalCurr = 0;
                var oBasket = oJSONModel.getProperty("/Basket");

                if (oBasket) {
                    oBasket.forEach(function (item) {
                        iTotal += item.custom;
                        iTotalCurr = Number(iTotalCurr);
                        iTotalCurr += Number(item.Orprice) * Number(item.custom);

                    })
                }
                oJSONModel.setProperty("/Total", iTotal);
                oJSONModel.setProperty("/TotalCurr", iTotalCurr);


                this.getView().setModel(new JSONModel({
                    MidText : [
                        {"key" : "key1", "text" : "강남본점"},
                        {"key" : "key2", "text" : "신성정지점"},
                        {"key" : "key3", "text" : "종로드림점"},
                        {"key" : "key4", "text" : "구파발점"},
                        {"key" : "key5", "text" : "풍무드림점"},
                        {"key" : "key6", "text" : "세마점"},
                        {"key" : "key7", "text" : "김포캐슬점"},
                        {"key" : "key8", "text" : "울산동부점"},
                        {"key" : "key9", "text" : "용인수지점"},
                        {"key" : "key10", "text" : "수원인계점"}
                    ],
                }), "search2");

            },

            onRead: function () {
                var oModel = this.getOwnerComponent().getModel("list"); // 전역모델 가져올때 getOwnerComponent
                var oJSONModel = this.getOwnerComponent().getModel("main"); // View에서 모델 가져올때 getView 

                // oJSONModel.read("/Basket", {
                //     // filters: [new Filter()]
                //     success: function(oReturn) {
                //         oJSONModel.setProperty("/Basket", oReturn.results);
                //         console.log(">>>>>",oReturn);
                //     },
                //     error: function(oError) {
                //         console.log(">>>error", oError)
                //     }
                // })
            },

            onBack: function () {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();
                var oRouter = this.getOwnerComponent().getRouter();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1)
                } else {
                    oRouter.navTo("TargetView1")
                }


            },

            onChange: function (oEvent) {
                var oView = this.getView();
                var oTable = oView.byId("idProductsTable");
                var oJSONModel = this.getOwnerComponent().getModel("main");
                var iTotal = 0;
                var iTotalCurr = 0;
                var oBasket = oJSONModel.getProperty("/Basket");
                oBasket.forEach(function (item) {
                    iTotal += item.custom;
                    iTotalCurr = Number(iTotalCurr);
                    iTotalCurr += Number(item.Orprice) * Number(item.custom);

                })
                oJSONModel.setProperty("/Total", iTotal);
                oJSONModel.setProperty("/TotalCurr", iTotalCurr);

                var Store = this.byId('Value5').getSelectedItem().getText();
                oJSONModel.setProperty("/Store", Store );
                
            },

            onOkBuy: function () {
                var result = confirm("발주 하시겠습니까?");
                const oView = this.getView();
                const oJSONModel = oView.getModel("main");
                const oModel = this.getView().getModel("itemHeader");
                const basket = oJSONModel.getProperty('/Basket') || [];

                debugger;
                var newItemHeader = {

                    Store : oJSONModel.getProperty("/Store"),

                    HeaderToItem: basket.map((item) => {
                        var iToval = Number(item.custom) * Number(item.Orprice) / 100;
                        if (item.custom == undefined) {
                            return {Quant : "0"};
                        }
                        else {
                            return { Binum: "0", Item: 0, Quant: item.custom.toString(), Gocod: item.Gocod, 
                                     Toval: iToval.toString() }
                        }
                    })
                };

                // debugger;
                if (result) {
                    let Value7 = oJSONModel.getProperty("/Store")
                    let aValidation = newItemHeader.HeaderToItem.filter(function(item) {
                        return item.Quant == "0"
                    })
                    
                    if(aValidation.length !== 0 || Value7 == undefined ) {
                        sap.m.MessageBox.error("수량, 매장 정보를 확인해주세요.");
                        return;
                    }

                    oModel.create("/SorderHSet", newItemHeader, null, function (response) {
                    });
                    console.log(newItemHeader);

                    sap.m.MessageBox.success("발주 성공했습니다.");


                }

                else {
                    sap.m.MessageBox.information("발주 취소했습니다.");
                }

            }

        });
    });