sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
	"sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, MessageToast, JSONModel) {
        "use strict";

        return Controller.extend("project6.controller.View1", {

            
            onInit: function () {

            
                this.getRouter = this.getOwnerComponent().getRouter();
                
                this.getView().setModel(oViewModel, "view");

                this.getOwnerComponent().getRouter().getRoute("RouteView1").attachMatched(this._onRouteMatched, this);

            },

            onConfirmationMessageBoxPress: function () {
                MessageBox.confirm("요청을 제출 하시겠습니까?");
            },

            _onRouteMatched: function() {
                this.getView().getModel("AppModel").setProperty("/currentPage", "1");
            }

        });

        
    });
