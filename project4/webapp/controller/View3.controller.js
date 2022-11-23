sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, History) {
        "use strict";
        return Controller.extend("project4.controller.View3", {

            onInit: function () {
                var oJSONModel =  this.getOwnerComponent().getModel("main");

                const items = oJSONModel.getProperty("/Basket")
                
                this.getView().setModel(new JSONModel({
                    Name: oJSONModel.getProperty("/Name"),
                    Number: oJSONModel.getProperty("/Number"),
                    Gotxt: items.map(item => item.Gonam).join(', '),
                    TotalCurr: oJSONModel.getProperty("/TotalCurr"),
                    Ortype: oJSONModel.getProperty("/Ortype"),
                    Address : oJSONModel.getProperty("/Address"),
                }), "main")

                debugger;

                this.getView().setModel(new JSONModel({
                    MidText: [
                        { "key": "key1", "text": "서울특별시" },
                        { "key": "key2", "text": "부산광역시" },
                        { "key": "key2", "text": "대구광역시" },
                        { "key": "key2", "text": "인천광역시" },
                        { "key": "key2", "text": "광주광역시" },
                        { "key": "key2", "text": "대전광역시" },
                        { "key": "key2", "text": "울산광역시" },
                        { "key": "key2", "text": "세종특별자치시" },
                        { "key": "key2", "text": "경기도" },
                        { "key": "key2", "text": "강원도" },
                        { "key": "key2", "text": "충청북도" },
                        { "key": "key2", "text": "충청남도" },
                        { "key": "key2", "text": "전라북도" },
                        { "key": "key2", "text": "전라남도" },
                        { "key": "key2", "text": "경상북도" },
                        { "key": "key2", "text": "경상남도" },
                        { "key": "key2", "text": "제주특별자치도" },
                    ],
                }), "search");

                this.onRead();

            },

            onRead: function () {



            },

            toHome: function () { //집앞배송 버튼

                var oView = this.getView();
                // debugger;
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("FourthView"); // route-name
            },

            pickUp: function () { //편의점 픽업 버튼

                var oView = this.getView();
                // debugger;
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("FifthView");

            },


            onChange: function () {
                var oCombobox1;
                var oView = this.getView();
                var oCombobox1 = this.byId("Value1").getSelectedItem().getText();

                var sublist = {
                    key1: ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
                    key2: ['커피', '음료수', '우유', '물', '도시락',],
                    key3: ['과자', '라면']
                }

                switch (oCombobox1) {
                    case '서울특별시':
                        oView.getModel("search").setProperty("/sublist", [{ key: "key1", text: '강남구' }, { key: "key2", text: '강동구' },
                        { key: "key3", text: '강북구' }, { key: "key4", text: '강서구' }, { key: "key5", text: '관악구' }, { key: "key6", text: '광진구' },
                        { key: "key7", text: '구로구' }, { key: "key8", text: '금천구' }, { key: "key9", text: '노원구' }, { key: "key10", text: '도봉구' },
                        { key: "key11", text: '동대문구' }, { key: "key12", text: '동작구' }, { key: "key13", text: '마포구' }, { key: "key14", text: '서대문구' },
                        { key: "key15", text: '서초구' }, { key: "key16", text: '성동구' }, { key: "key17", text: '성북구' }, { key: "key18", text: '송파구' },
                        { key: "key19", text: '양천구' }, { key: "key20", text: '영등포구' }, { key: "key21", text: '용산구' }, { key: "key22", text: '은평구' },
                        { key: "key23", text: '종로구' }, { key: "key24", text: '중구' }, { key: "key25", text: '중랑구' }])
                        break;
                    case '부산광역시':
                        oView.getModel("search").setProperty("/sublist", [{ key: "key4", text: '도시락' }, { key: "key5", text: '물' }, { key: "key6", text: '우유' },
                        { key: "key7", text: '음료수' }, { key: "key8", text: '커피' }])
                        break;
                    case '대구광역시':
                        oView.getModel("search").setProperty("/sublist", [{ key: "key1", text: '과자' }, { key: "key2", text: '라면' }])
                        break;
                }
            },


            onBack: function () {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();
                var oRouter = this.getOwnerComponent().getRouter();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1)
                } else {
                    oRouter.navTo("TargetView2")
                }


            },

            onOrder: function () {

                // 최종 주문 완료

                var result = confirm("발주 하시겠습니까?");
                //const oView = this.getView();
                const oJSONModel = this.getOwnerComponent().getModel("main");
                // const oModel = this.getView().getModel("main2"); //itemheaderservice
                const basket = oJSONModel.getProperty('/Basket') || [];
               const oModel = this.getView().getModel("itemHeader");
               debugger;
  

               

               var newItemHeader = {
                    Address : oJSONModel.getProperty('/Address'),
                    Ortype: oJSONModel.getProperty("/Ortype"), 
                   HeaderToItem: basket.map((item) => {
                       var iToval = Number(item.custom) * Number(item.Cusprice) / 100;
                       if (item.custom == undefined) {
                           return {Quant : "0"};
                       }
                       else {
                           return { Codernum: "0", Item: 0, Quant: item.custom.toString(), Gocod: item.Gocod, 
                                    Toval: iToval.toString()}
                       }
                   })
               };

               // debugger;
               if (result) {

                   let aValidation = newItemHeader.HeaderToItem.filter(function(item) {
                       return item.Quant == "0"
                   })
                   
                   if(aValidation.length !== 0) {
                       sap.m.MessageBox.error("수량에 0이 포함되어 있습니다.");
                       return;
                   }

                   oModel.create("/CorderHSetSet", newItemHeader, null, function (response) {
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
