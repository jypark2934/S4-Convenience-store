sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/m/MessageToast",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, formatter, Filter, MessageToast) {
        "use strict";

        return Controller.extend("project4.controller.View1", {
            formatter : formatter,
            onInit: function () {

                var sPath = sap.ui.require.toUrl("project4");
                var imageURL = "/Image/11.png";
                var sPath2 = sPath + imageURL;

                this.getView().setModel(new JSONModel({url: sPath2}), 'view')

                this.getView().setModel(new JSONModel({
                    MidText : [
                        {"key" : "key1", "text" : "상품명"},
                        {"key" : "key2", "text" : "상품코드"},
                        
                    ],
                }), "search");

                this.onRead();
            },

            onRead: function() {
                var oModel = this.getOwnerComponent().getModel("list"); // 전역모델 가져올때 getOwnerComponent
                var oJSONModel = this.getOwnerComponent().getModel("main"); // View에서 모델 가져올때 getView
    
                oModel.read("/ZZ2C_GOODPACK", {
                    // filters: [new Filter()]
                    success: function(oReturn) {
                        oJSONModel.setProperty("/ZZ2C_GOODPACK", oReturn.results);
                       // console.log(oReturn);
                    },
                    error: function(oError) {
    
                    }
                })
            },

            onFilterSearch : function() {

                var oView = this.getView();
                var oCombobox1, oCombobox2; // undefined
                var sInputValue = oView.byId("Filter").getValue();
                var aFilter = [];
    
                if(this.byId("Value1").getSelectedItem()) {
                    oCombobox1 = this.byId("Value1").getSelectedItem().getText();
                }

                if(oCombobox1 === "상품코드") {
                    aFilter.push(new Filter(  "Gocod" , "Contains" , sInputValue))

                } else {
                    aFilter.push(new Filter(  "Gonam" , "Contains" , sInputValue))
                }
              
              

                // if(sInputValue){
                //     aFilter.push(new Filter(  "Gonam" , "Contains" , sInputValue))
                
                // };
              

                oView.byId("idProductsTable").getBinding("items").filter(aFilter);
    
        },
            
        onChange : function(){
            var oCombobox1;
            var oView = this.getView();
            var oCombobox1 = this.byId("Value1").getSelectedItem().getText();



        },

        
        onGet : function(oEvent) {
            var oView = this.getView();
            var oTable = oView.byId("idProductsTable");
            var oModel = oView.getModel("list");
            var oJSONModel = oView.getModel("main");
        

            const originItems = oJSONModel.getProperty("/ZZ2C_GOODPACK");

            const items = oTable.getSelectedContextPaths().map(function(item){      
                const custom = oJSONModel.getProperty(item + "/custom");
                const code = oJSONModel.getProperty(item + "/Gocod")

                // 원본 데이터 찾기
                const originItem = originItems.find(row => row.Gocod === code);

                return {
                    ...originItem,
                    custom,
                }
            });

            oJSONModel.setProperty("/Basket",  items)

            MessageToast.show("장바구니에 추가되었습니다.")

            // var sCurrentValue = oView.byId("CurrentValue").getValue();          
            
            var oView = this.getView();
            
            var oTable = oView.byId("idProductsTable");
            var oJSONModel = this.getOwnerComponent().getModel("main");
            var iTotal = 0;
            var iTotalCurr = 0;
            var oBasket = oJSONModel.getProperty("/Basket");
            oBasket.forEach(function(item){
                iTotal += item.custom;
                iTotalCurr = Number(iTotalCurr);
                iTotalCurr += Number(item.Cusprice) * Number(item.custom);

            })
            oJSONModel.setProperty("/Total", iTotal);
            oJSONModel.setProperty("/TotalCurr", iTotalCurr);

        },

        onBuy: function() {
          
            var oView = this.getView();
            var oJSONModel = oView.getModel("main");
            oJSONModel.getProperty("/Basket");
            // debugger;
            var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("SecondView"); // route-name


        
        },

        });
    });
