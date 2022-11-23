sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel',
    "sap/ui/model/Filter",
    "sap/m/MessageToast",
    "sap/ui/core/routing/History",
    "../model/formatter"
],   

    function(Controller, JSONModel, Filter, MessageToast, History,formatter) {
	"use strict";

	return Controller.extend("project4.controller.View2", {
        formatter : formatter,
		onInit: function () {

            var sPath = sap.ui.require.toUrl("project4");
            var imageURL = "/Image/11.png";
            var sPath2 = sPath + imageURL;

            this.getView().setModel(new JSONModel({url: sPath2}), 'view')
            
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
                        iTotalCurr += Number(item.Cusprice) * Number(item.custom);

                    })
                }

                oJSONModel.setProperty("/Total", iTotal);
                oJSONModel.setProperty("/TotalCurr", iTotalCurr);
		},

        onRead: function() {
            var oModel = this.getOwnerComponent().getModel("list"); // 전역모델 가져올때 getOwnerComponent
            var oJSONModel = this.getOwnerComponent().getModel("main"); // View에서 모델 가져올때 getView 

        },

        onFilterSearch : function() {

            var oView = this.getView();
            var oCombobox1, oCombobox2; // undefined
            var sInputValue = oView.byId("Filter").getValue();
            var aFilter = [];

            if(this.byId("Value1").getSelectedItem()) {
                oCombobox1 = this.byId("Value1").getSelectedItem().getText();}
      
            if(sInputValue){
                aFilter.push(new Filter("Gonam", "Contains" , sInputValue))
            };
         


            oView.byId("idProductsTable").getBinding("items").filter(aFilter);

        },
        
        onChange : function(){
            var oCombobox1;
            var oView = this.getView();
            var oCombobox1 = this.byId("Value1").getSelectedItem().getText();

            var oTable = oView.byId("idProductsTable");
                var oJSONModel = this.getOwnerComponent().getModel("main");
                var iTotal = 0;
                var iTotalCurr = 0;
                var oBasket = oJSONModel.getProperty("/Basket");
                oBasket.forEach(function (item) {
                    iTotal += item.custom;
                    iTotalCurr = Number(iTotalCurr);
                    iTotalCurr += Number(item.Cusprice) * Number(item.custom);

                })
                oJSONModel.setProperty("/Total", iTotal);
                oJSONModel.setProperty("/TotalCurr", iTotalCurr);
        },

        onLiveChange : function(){

        },

        onGet : function(oEvent) {
            var oView = this.getView();
            var oTable = oView.byId("idProductsTable");
            var oModel = oView.getModel("list");
            var oJSONModel = oView.getModel("main");

            
            oTable.getSelectedContextPaths().forEach(function(item){
                // setpinput 값을 가져온다.
                // var iStepInput = item.getCells()[4].getValue();
                var iStepInput = oJSONModel.getProperty(item + "/custom");
                console.log(iStepInput)
            });

            // var sCurrentValue = oView.byId("CurrentValue").getValue();
            
        },

        onBack: function() {
            var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();
                var oRouter = this.getOwnerComponent().getRouter();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1)
                } else{
                    oRouter.navTo("TargetView1")
                }


        },
        onSelectionChange : function(oEvent){
            var sPath = oEvent.getParameters().listItem.getBindingContextPath();
            var oView = this.getView();
            var oModel = this.getView().getModel("list");

           
        },

        toHome : function() { //집앞배송 버튼
            // 상품코드, 집앞배송, 총액, 통화, 수량 받아와야 함
            
            var oJSONModel = this.getOwnerComponent().getModel("main");

            oJSONModel.setProperty("/Ortype", "집앞배송");

            // debugger;
            var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("FourthView"); // route-name


        },

        pickUp : function() { //편의점 픽업 버튼
            // 상품코드, 지점배송, 총액, 통화, 수량 받아와야 함

            var oJSONModel = this.getOwnerComponent().getModel("main");
        
            oJSONModel.setProperty("/Ortype", "지점배송");

            // debugger;
            var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("FifthView");

        }
        
	});
});