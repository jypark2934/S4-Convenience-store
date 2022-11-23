sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel',
    "sap/ui/model/Filter",
    "sap/ui/core/routing/History"
],

function(Controller, JSONModel, Filter, History) {
 "use strict"

 return Controller.extend("project4.controller.View5", {


    onInit: function(){



    },

    onChange : function(){





    },



    onLiveChange : function(){





    },

                
    onBack: function() {
        var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();
            var oRouter = this.getOwnerComponent().getRouter();

            if (sPreviousHash !== undefined) {
                window.history.go(-1)
            } else{
                oRouter.navTo("TargetView3")
            }


    },

    onOrder : function() {

        console.log('주문성공');

        var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("SixthView");

    }








 });




});