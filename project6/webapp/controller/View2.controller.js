sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
 /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("project6.controller.View2", {
            onInit: function () {
                this.getRouter = this.getOwnerComponent().getRouter();
                this.getOwnerComponent().getRouter().getRoute("View2").attachMatched(this._onRouteMatched, this);
            },

            _onRouteMatched: function() {
                this.getView().getModel("AppModel").setProperty("/currentPage", "2");
            }

          
        });
    });