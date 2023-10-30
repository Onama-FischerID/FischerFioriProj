sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    'sap/ui/export/library',
	'sap/ui/export/Spreadsheet',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageBox,exportLibrary,Spreadsheet) {
        "use strict";
        var sSrviceURI,oModel,fName,oBusyIndicator ;
        var EdmType = exportLibrary.EdmType;
        return Controller.extend("fischer.zcreatecustinv.controller.View1", {
            onInit: function () {

                sSrviceURI = "/sap/opu/odata/sap/Z_CREATE_CUSTOMER_INVOICE_SRV/";
				oModel = new sap.ui.model.odata.ODataModel(sSrviceURI, true);
                oModel.setUseBatch(false);
                oModel.getSecurityToken();
                oBusyIndicator = new sap.m.BusyDialog();
            },
            

            fnUpload: function(){
                oBusyIndicator.open();
                var that = this;
                var oCompancode = that.getView().byId("inp_cc").getValue();
                if(oCompancode !== "")
                {
                    
                    var fb60_json = {
                        "Serialno": "1",
                        "Compcode": "",
                        "NavtoZFB60STR": [
                            {   "Serialno":"",
                                "Compcode":"",
                                "Vendorno":"",
                                "Pstngdate":"",
                                "Docdate":"",
                                "Fiscperiod":"",
                                "Headertxt":"",
                                "Reference":"",
                                "Caltax":"",
                                "Currency":"",
                                "Businessplace":"",
                                "Secco":"",
                                "Glaccount":"",
                                "Amtbase":"",
                                "Taxcode":"",
                                "Itemtext":"",
                                "Costcenter":"",
                                "Hsnsac":"",
                                "Withtaxc":"",
                                "Doctype":"",
                                "RefKey1": "",
                                "RefKey2": "",
                                "RefKey3": ""
                            },
                        ],
                        "NavtoReturn": [
                            {
                                "Srno": "",
                                "Message": "",
                                "Docno": "",
                                "Fiscal": ""
                            }
                        ]
                    }

                    
                        var oFileUploader = that.getView().byId("FileUploaderid");
                        var file = oFileUploader.getFocusDomRef().files[0];
                        fName = file.name;
                        var excelData = {};
                        if (file && window.FileReader) {
                            var reader = new FileReader();
                            reader.onload = function (evt) {
                            var data = evt.target.result;
                            var workbook = XLSX.read(data, 
                                {
                                    type: 'binary'
                                });
                                workbook.SheetNames.forEach(function (sheetName) 
                                {
                                    excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                                });

                                var ojson = new sap.ui.model.json.JSONModel({
                                    "data": excelData
                                });

                                for(var i=0;i<excelData.length;i++)
                                {
                                    jQuery.sap.require("sap.ui.core.format.DateFormat");
                                    var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					                pattern: "yyyy-MM-ddTHH:mm:ss"
				                    });
                                    var splitDate = [];
                                    var splitDateChar = [];
                                    splitDateChar = excelData[i].Pstngdate.split('');
                                    splitDate =  excelData[i].Pstngdate.split(splitDateChar[2]);
                                    var pDate = new Date( splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0])
                                    excelData[i].Pstngdate = oDateFormat.format(pDate); 

                                    splitDate =  excelData[i].Docdate.split('.');
                                    var ddate = new Date(splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0]);
                                    excelData[i].Docdate = oDateFormat.format(ddate);
                                }

                                fb60_json.Compcode = oCompancode ;
                                fb60_json.NavtoZFB60STR = ojson.oData.data;
                                
                                oModel.create("/ZFB60_HEADERSTRSet",fb60_json,{
                                    success: function(odata, oresponse){
                                        var aCols,oSettings,oSheet,blank = [];
                                        that = this;
                                        oBusyIndicator.close();
                        
                                        var tjson = new sap.ui.model.json.JSONModel({
                                            "data": odata.NavtoReturn.results
                                        });
                                        aCols = [];
                           
                                        aCols.push({
                                            lable : 'Srno',
                                            property: 'Srno',
                                            type: EdmType.Number,
                                        });
                                        aCols.push({
                                            lable : 'Message',
                                            property: 'Message',
                                        type: EdmType.String,
                                        });
                                        aCols.push({
                                            lable : 'Docno',
                                            property: 'Docno',
                                            type: EdmType.String,
                                        });
                                        aCols.push({
                                            lable : 'Fiscal',
                                            property: 'Fiscal',
                                            type: EdmType.Number,
                                        });
                                        var splitfname = file.name.split('.');
                                        fName = splitfname[0] + '_result.'+splitfname[1];
                           
                                        oSettings = {
                                            workbook: {
                                                columns: aCols,
                                                hierarchyLevel: 'Level'
                                            },
                                            dataSource: tjson.oData.data,
                                            fileName: fName,
                                            worker: true // We need to disable worker because we are using a MockServer as OData Service
                                        };
                                        oSheet = new Spreadsheet(oSettings);
			                            oSheet.build().finally(function() {
				                        // oSheet.destroy();
			                        });
                                },
                                error: function(oerror){
                                    oBusyIndicator.close();
                                    MessageBox.error("Something went wrong");
                                }
                            });//omodel close
                    
                        },//FileReader close
                
                    reader.onerror = function (ex) {
                        console.log(ex);
                          };
                          reader.readAsBinaryString(file);
                        }    
                
                }
                else{
                    oBusyIndicator.close();
                    MessageBox.error("Please enter Company code");
                }        
            },
            fnClear : function(){
                oBusyIndicator.open();
                this.getView().byId("FileUploaderid").setValue("");
                this.getView().byId("inp_cc").setValue("");
                oBusyIndicator.close();
            }
        
        });
    });