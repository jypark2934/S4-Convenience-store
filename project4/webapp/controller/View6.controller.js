sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
	function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("project4.controller.View6", {

		_data : {
			"date" : new Date()
		},

		onInit : function (evt) {

			// var today = new Date();
			// var dd = today.getDate();
			// var mm = today.getMonth()+1; //January is 0!
			// var yyyy = today.getFullYear();

			// var today1 = ( yyyy+'.'+mm+'.'+dd );
			// this.getView().byId("date").setText(today1.valueOf(Text));

			var oModel = new JSONModel(this._data);
			this.getView().setModel(oModel);

            
            // this.getView().setModel(new JSONModel({dateList : [{dateString : "2022-10-11"}]}), "view")
            this.getView().setModel(new JSONModel({dateList : [
				
				{dateString : "2022-11-24 (목)", selected: true},
				{dateString : "2022-11-25 (금)", selected: false},
				{dateString : "2022-11-26 (토)", selected: false},
				{dateString : "2022-11-27 (일)", selected: false},
				{dateString : "2022-11-28 (월)", selected: false},
				{dateString : "2022-11-29 (화)", selected: false},
				{dateString : "2022-11-30 (수)", selected: false}
			]}), "view");
        
		},

		onOrder : function() {

			console.log("주문 완료오");

			var oView = this.getView();
			// debugger;
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("ThirdView");			

			const list = this.getView().getModel('view').oData.dateList;

			const selected = list.find(row => row.selected === true).dateString

			var oJSONModel = oView.getModel("main");    

			oJSONModel.setProperty("/OrderDate", selected);
		}


	});
});
