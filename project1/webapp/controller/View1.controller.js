sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/Filter"
    
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,MessageToast,Filter) {
        "use strict";

        return Controller.extend("zz2.project1.controller.View1", {
            onInit: function (){ 

                this.getView().setModel(new JSONModel({
                    MidText : [
                        {"key" : "key1", "text" : "종로드림점"},
                        {"key" : "key2", "text" : "신정성지점"},
                        {"key" : "key3", "text" : "강남본점"},
                        {"key" : "key4", "text" : "구파발점"},
                        {"key" : "key5", "text" : "풍무드림점"},
                        {"key" : "key6", "text" : "세마점"},
                        {"key" : "key7", "text" : "김포캐슬점"},
                        {"key" : "key8", "text" : "울산동부점"},
                        {"key" : "key9", "text" : "용인수지점"},
                        {"key" : "key10", "text" : "수원인계점"}
                    ],
                }), "search");
                this.getView().setModel(new JSONModel({startDate : null, endDate : null}), "viewModel");

                // var oFilter = new Filter ("Statu", "EQ", "배송요청")

                // var aFilter = [];
                // aFilter.push(oFilter)
                // this.getView().byId("Table").getBinding("rows").filter(aFilter)

            },

            onNavNext :function(oEvent){
            var oRouter = this.getOwnerComponent().getRouter();
            //router 객체 받아오기
           
            oRouter.navTo("RouteView2", {
                Binum2 : oEvent.getSource().getText() // 1. S1000002 키값 가져와서 넘긴다
            });

            var oList = oEvent.getSource(),
            bSelected = oEvent.getParameter("selected");
            
            },
            // 여기는 주문번호로 검색
            onSearch :function(oEvent){ 
                var Search1 = this.getView().byId("input").getValue();
                var Combo1;
                var Btdate1;
                var Btdate2;
                var oCal = this.byId("calendar");
            
                var aFilter = [];

                if(this.byId("ComboId").getSelectedItem()) {
                    Combo1 = this.byId("ComboId").getSelectedItem().getText();}

                if(oCal.getSelectedDates().length){
                    var oStartDate = oCal.getSelectedDates()[0].getStartDate();
                    var oEndDate = oCal.getSelectedDates()[0].getEndDate();
                    var iOffset = oCal.getSelectedDates()[0].getEndDate().getTimezoneOffset()*60*1000;
                    var iValue1 = oStartDate - iOffset;
                    var oValue1 = new Date(iValue1);
                    var iValue2 = oEndDate - iOffset;
                    var oValue2 = new Date(iValue2);

                    Btdate1 = oValue1
                    Btdate2 = oValue2   
                }    

                if(Combo1){
                    aFilter.push(new Filter("Stnam", "EQ" , Combo1));
                }


                if(Search1){
                    aFilter.push(new Filter("Binum", "Contains" , Search1));
                }
                
                if(Btdate1, Btdate2){
                    aFilter.push(new Filter("Bdate", "BT" , Btdate1, Btdate2));
                    oCal.removeAllSelectedDates();
                }
             

                this.getView().byId("Table").getBinding("rows").filter(aFilter);
                // 
                
                if(oCal.bOutput == true){
                    //oCal.bOutput = "invisible";
                    oCal.setVisible(false)
                }
             
            },
            onDate :function(oEvent){
                var Date = this.getView()
                var oCal = this.byId("calendar");
                // debugger;
                // console.log(oCal.bOutput);
                // if(oCal.bOutput == "invisible"){
                //     console.log(oCal);
                //     oCal.setVisible(true);
                //     //oCal.bOutput = "visible";
       
                // }else if(oCal.bOutput == true){
                //     //oCal.bOutput = "invisible";
                // }
                oCal.setVisible(!oCal.getVisible());
                //     if(oCal.setVisible == true){
                //         oCal.setVisible = false
                        
                //     }
                //     else{
                //         oCal.setVisible = true
                //     }
                // }
                    
            },





            // onSelectionChange: function (oEvent) {
            //     var oList = oEvent.getSource(),
            //         bSelected = oEvent.getParameter("selected");
    
            //     // // skip navigation when deselecting an item in multi selection mode
            //     // if (!(oList.getMode() === "MultiSelect" && !bSelected)) {
            //     //     // get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
            //     //     this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
            //     // }
            // },

            
        });
    });