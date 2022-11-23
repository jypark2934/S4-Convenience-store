sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/ui/model/Filter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter) {
        "use strict";

        return Controller.extend("project8.controller.View1", {
            onInit: function () {
                
                //현재시간 만들기
                var oModel = new JSONModel();
			    oModel.setData({
				    dateValue: new Date()
			    });
                this.getView().setModel(oModel)
                this.byId("idFilHopedate").setDateValue(new Date());

                // 콤보박스만들기
                this.getView().setModel(new JSONModel({

                    // 배송업체 코드
                    ComboBikecod : [
                        {"key" : "DA01", "text" : "DA01"},
                        {"key" : "DA04", "text" : "DA04"},
                        {"key" : "DA05", "text" : "DA05"},
                        {"key" : "DA06", "text" : "DA06"},
                        {"key" : "DA07", "text" : "DA07"},
                        {"key" : "DA08", "text" : "DA08"},
                        {"key" : "DA09", "text" : "DA09"},
                        {"key" : "DA10", "text" : "DA10"},
                        {"key" : "DC01", "text" : "DC01"},
                        {"key" : "DC02", "text" : "DC02"},
                        {"key" : "DC03", "text" : "DC03"},
                        {"key" : "DC04", "text" : "DC04"},
                        {"key" : "DC05", "text" : "DC05"},
                        {"key" : "DC06", "text" : "DC06"},
                        {"key" : "DC07", "text" : "DC07"},
                        {"key" : "DC08", "text" : "DC08"},
                        {"key" : "DC09", "text" : "DC09"},
                        {"key" : "DC10", "text" : "DC10"}
                        
                    ],

                    // 배송기사 코드
                    ComboDcode : [
                        {"key" : "0001", "text" : "0001"},
                        {"key" : "0002", "text" : "0002"},
                        {"key" : "0003", "text" : "0003"},
                        {"key" : "0004", "text" : "0004"},
                        {"key" : "0005", "text" : "0005"},
                        
                    ],

                    // 배송 유형
                    ComboOrtype : [
                        {"key" : "", "text" : "전체"},
                        {"key" : "집앞배송", "text" : "집앞배송"},
                        {"key" : "지점배송", "text" : "지점배송"},
                    ],

                    // 배송 완료 조회
                    ComboDeliflag : [
                        {"key" : "", "text" : "전체"},
                        {"key" : "Y", "text" : "Y"},
                        {"key" : "N", "text" : "N"}
                    ],

                    
                    // 배송 완료 업데이트
                    ComboEditDeliflag : [
                        {"key" : "Y", "text" : "Y"},
                        {"key" : "N", "text" : "N"}
                    ],

                    today : new Date()

                }), "search")
            },

            onAfterRendering : function () {
                var aFilter = [
                    new Filter("Gocod", "Contains", 'LU'),
                    new Filter('Hopedate', 'EQ', new Date( new Date() - new Date().getTimezoneOffset()*60*1000 ) )
                ]
                var oTable = this.byId("idProductsTable");
                oTable.getBinding("items").filter(aFilter);
            },

            onRead: function() {
                var oDataModel = this.getView().getModel("list");
                
                oDataModel.read("/ZZ2C_CORDERFIORI", {
                    // 맨처음에 해당날짜로 조회하기
                    filters: [new Filter('Hopedate', 'EQ', new Date( new Date() - new Date().getTimezoneOffset()*60*1000 ) )],
                    success : function(oReturn) {
                        console.log(oReturn);

                    
                    },
                    error : function(oError) {}

                    });
                },
                
                 // 테이블 데이터 클릭 시 이벤트 함수 실행
                 onSelectionChange: function(oEvent) {
                    
                    var sPath = oEvent.getParameters().listItem.getBindingContextPath(); 
                    var oView = this.getView();
                    // 내가 선택한 ROW의 Model Binding Path 값을 가져옴 ==> "/SalesOrderSet('내가 선택한 ROW의 KEY')""

                    var oModel = this.getView().getModel("list");

                    oModel.read( sPath, {
                        success: function(oReturn) {
                            console.log(oReturn);
                            // sap.m.Input의 value 프로퍼티에 세팅
                            oView.byId("idUpCodernum").setValue(oReturn.Codernum);
                            // 상품코드 추가
                            oView.byId("idUpGocod").setValue(oReturn.Gocod);
                            oView.byId("idUpGonam").setValue(oReturn.Gonam);
                            oView.byId("idUpDeliflag").setValue(oReturn.Deliflag);
                            

                        },
                        error: function(oReturn) {
                            console.log(oReturn);
                        }

                    });
                },

               onUpdate: function() {
                // put요청: /sap/opu/odata/sap/ZGWSALESBOO_SRV/SalesOrderSet + KEY + BODY
               //debugger;
               var oView = this.getView();
               var oModel2 = oView.getModel("list2"); // odata Model
               var oModel1 = oView.getModel("list");
            
               var odata = { // UPDATE 요청 시 JSON DATA로 Body 구성
                   "Deliflag" : oView.byId("idUpDeliflag").getValue(),
                   
               };
               //키값 잡아주기 
               var path = oModel2.createKey("/ZZ2C_CORDERFIORI2", { // "/SalesOrderSet('선택ROW의Sonum값')" 와 같음
                   Codernum : oView.byId("idUpCodernum").getValue(),

               }); // 내부적으로는 "/SalesOrderSet"('선택ROW의Sonum값')의 형태가 됨.

               // Server에 PUT 요청을 보냄.
               oModel2.update(path, odata, {
                   success: function(oReturn) { //성공 시 함수 실행
                       sap.m.MessageToast.show("배송 확정 변경 완료");
                       // UPDATE 되면 READ하게
                       oModel1.refresh(true);
                   },
                   error: function(oError) {
                       sap.m.MessageToast.show("변경이 적용되지 않았습니다");
                   }, // 에러 발생 시 함수 실행

               })

           },

            onFilterSearch: function() {

                var oView = this.getView();
                // var itemValue = Number(oView.byId("inpFilterItem").getValue()); //  키값인 Gocod와 Item 근데 Item은 넘버라서 타입을 넘버로 바꿔줘야함 

                var oComboBox1 = this.byId("idFilBikecod").getSelectedKey();
                var oDatePicker = this.byId("idFilHopedate").getDateValue();
                var oComboBox3 = this.byId("idFilDcode").getSelectedKey();
                var oComboBox4 = this.byId("idFilOrtype").getSelectedKey();
                var oComboBox5 = this.byId("idFilDeliflag").getSelectedKey();

                //필터여러개면 배열
                var aFilter = [ new Filter("Gocod", "Contains", 'LU') ];
                
                if(oComboBox1 !== ''){
                    var oFilter1 = new Filter("Bikecod", "EQ", oComboBox1);
                    aFilter.push(oFilter1)
                };

                if(oDatePicker !== ''){
                        // UTC 타임을 00h00m00s로 맞춰줘야함 시간 09:00 로 맞춰서 절대시간 000000으로 세팅한 상태
                         oDatePicker = new Date(oDatePicker-oDatePicker.getTimezoneOffset()*60000);
                        var oFilter2 = new Filter("Hopedate", "EQ", oDatePicker ); // odata v2 date only X
                        // datetime -> 00h00m00s UTC 0시
                        aFilter.push(oFilter2)};
                
                if (oComboBox3 !== ''){
                    var oFilter3 = new Filter("Dcode", "EQ", oComboBox3);
                        aFilter.push(oFilter3)
                    };

                if (oComboBox4 !== ''){
                    var oFilter4 = new Filter("Ortype", "EQ", oComboBox4);
                        aFilter.push(oFilter4)
                    };
                
                if (oComboBox5 !== ''){
                    var oFilter5 = new Filter("Deliflag", "EQ", oComboBox5);
                        aFilter.push(oFilter5)
                    };    

                this.byId("idProductsTable").getBinding("items").filter(aFilter);

                // 여기서 read entity 로 갖고오려 했는데 이래도 배송기사가 반드시 한명만 나오는건 아니라서 하면 안된다 그냥 로그인 이있으면 만들어보고 아니면 버리기
                // var oDataModel = this.getView().getModel("list"); //var oReadEntity =
                // var path = oDataModel.createKey("/ZZ2C_CORDERFIORI", {
                //     // 새로바뀐 테이블의 Dpname을 갖고와야하는데
                //     Dpname : oView.getValue(),});

                //     oDataModel.read(path, {
                //         success : function(oReturn) {
                //             console.log(oReturn);
                //             oView.byId("idReadDpname").setText(oReturn.Dpname);       //  .byId 로 먼저 주소를 가져오고  .setText 로 return 값을 가져온다
                //         },
                //         error : function(oError) {},

                //     })


            },

            onChart : function(oEvent) {

                var oView = this.getView();
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteView2", {
                    Binum : oEvent.getSource().getText()
                });

            }

        });
    });
