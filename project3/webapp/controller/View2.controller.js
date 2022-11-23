sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/ColumnListItem",
    "sap/m/Input",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ColumnListItem, Input, MessageToast) {
        "use strict";

        return Controller.extend("project3.controller.View2", {
            onInit: function () {

                this.getOwnerComponent().getModel("main2").setSizeLimit(150);

            },

            onBack: function () {

            },

            onChange: function () {
                MessageToast.show("테스트");
            },

            onSave: function (oEvent) {
                var oModel = this.getView().getModel("main2");
                var oView = this.getView();
                var sPath = oEvent.getSource().getParent().getBindingContextPath();
                var iActuqua = oEvent.getSource().getParent().getCells()[3].getValue();
                var odata = {
                    // "GocodValue" : oEvent.getSource().getParent().getCells()[0].getText(),
                    // "Stcod" : oEvent.getSource().getParent().getCells()[4].getText(),
                    "Actuqua": iActuqua.toString()
                };

                debugger;

                // var path = oModel.createKey("/InvensSet",{
                //     Gocod : oView.byId("GocodValue").getText(),
                //     Stcod : oView.byId("Stcod").getText(),
                // });


                oModel.update(sPath, odata, {
                    success: function (oReturn) {
                        sap.m.MessageToast.show("완료~");
                    },

                    error: function (oError) {
                        console.log(oError)
                    }
                }
                )



            },

            onSaveFull: function (oEvent) {
                var oModel = this.getView().getModel("main2");
                var oView = this.getView();

                var oData = this._getUpdateDate();
                var oSendData = {
                    "InvensGetOdata" : oData
                }

                oModel.create("/InvensSet", oSendData, {
                    success : function(oReturn) {
                        sap.m.MessageBox.success("실사 데이터를 저장하였습니다.", {
                            onClose: function (sAction) {
                                sap.m.MessageToast.show("뒤로 가기");
                            }
                        });
                    },
                    error: function(oError) {
                        debugger;
                    }
                });
               


                
                // oModel.update(sPath, odata, {
                //     success: function (oReturn) {
                //         sap.m.MessageToast.show("완료~");
                //     }

                //     error: function (oError) {
                //         console.log(oError)
                //     }
                // }
                // )



            },

            _getUpdateDate : function () {
                var oTable = this.byId("idProductsTable"),
                    oItems = oTable.getItems();
                var oData = [];
                oItems.forEach(function(elem){
                    oData.push({
                        Gocod : elem.getCells()[0].getText(), //"GocodValue"
                        Bookqua : elem.getCells()[2].getText(),
                        Actuqua : elem.getCells()[3].getValue().toString(), //"Actuqua"
                        Stcod : elem.getCells()[4].getText(), //"Stcod"
                        Gonam : elem.getCells()[1].getText(),
                        Boookprice : elem.getCells()[5].getText()
                    })
                })

                return oData;
                // oData
                
            }

        });
    });
