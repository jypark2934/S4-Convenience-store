sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel',
    "sap/ui/model/Filter",
    "sap/m/MessageToast",
],   



    function(Controller, JSONModel, Filter, MessageToast) {
	"use strict";

	return Controller.extend("zz2.project2.controller.View1", {

		onInit: function () {

            this.getView().setModel(new JSONModel({
                MidText : [
                    {"key" : "key1", "text" : "식품"},
                    {"key" : "key2", "text" : "주류"},
                    {"key" : "key3", "text" : "식품(신선제외)"}
                ],
            }), "search");
            
            this.onRead();
		},

        onRead: function() {
            var oModel = this.getOwnerComponent().getModel("list"); // 전역모델 가져올때 getOwnerComponent
            var oJSONModel = this.getOwnerComponent().getModel("main"); // View에서 모델 가져올때 getView
            oModel.read("/ZZ2C_GOODS_CDS", {
                // filters: [new Filter()]
                success: function(oReturn) {
                    oJSONModel.setProperty("/ZZ2C_GOODS_CDS", oReturn.results);
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
                oCombobox1 = this.byId("Value1").getSelectedItem().getText();}
            if(this.byId("Value2").getSelectedItem()) {
                oCombobox2 = this.byId("Value2").getSelectedItem().getText();}

            if(sInputValue){
                aFilter.push(new Filter("Gonam", "Contains" , sInputValue))
            };
            if(oCombobox1){
                aFilter.push(new Filter("Gtmid", "EQ" , oCombobox1))
            };
            if(oCombobox2){
                aFilter.push(new Filter("Gtsma", "EQ" , oCombobox2))
            };


            oView.byId("idProductsTable").getBinding("items").filter(aFilter);

        },
        
        onChange : function(){
            var oCombobox1; 
            var oView = this.getView();
            var oCombobox1 = this.byId("Value1").getSelectedItem().getText();

            
            var sublist = {
                key1 : ['막걸리', '맥주', '소주'],
                key2 : ['커피', '음료수', '우유', '물', '도시락',],
                key3 : ['과자', '라면']
            }

            switch (oCombobox1) {
                case '주류':
                    oView.getModel("search").setProperty("/sublist", [{key: "key1" , text: '막걸리'}, {key: "key2" , text: '맥주'}, {key: "key3" , text: '소주'}])
                    break;
                case '식품':
                    oView.getModel("search").setProperty("/sublist", [{key: "key4" , text: '도시락'}, {key: "key5" , text: '물'}, {key: "key6" , text: '우유'}, 
                    {key: "key7" , text: '음료수'},{key: "key8" , text: '커피'}])
                    break;
                case '식품(신선제외)' :
                    oView.getModel("search").setProperty("/sublist", [{key: "key1" , text: '과자'}, {key: "key2" , text: '라면'}])
                    break;
            }

        },

        onLiveChange : function(){

        },

        onGet : function(oEvent) {
            var oView = this.getView();
            var oTable = oView.byId("idProductsTable");
            var oModel = oView.getModel("list");
            var oJSONModel = oView.getModel("main");
            /**
             * {
             *  ZZ2C_GOODS_CDS : [ {}, {} ],
             *  basket : [{}, {}]
             * }
             */

            const originItems = oJSONModel.getProperty("/ZZ2C_GOODS_CDS");

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
                iTotalCurr += Number(item.Pprice) * Number(item.custom);

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


            // debugger;
            /*
            json data 구성
            
            {
                "key" : "value",
                "key1" : "value2"
            }
            
            */
        },

	});
});