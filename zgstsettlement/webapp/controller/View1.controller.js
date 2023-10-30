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
        var sSrviceURI,oModel,AccGLtoGL,AccCustVendor,AccGLCut,AccGLVendor,oBusyIndicator,fName;
        var EdmType = exportLibrary.EdmType;
        var DType = "Valid";
        return Controller.extend("fischer.zgstsettlement.controller.View1", {
            onInit: function () {
                sSrviceURI = "/sap/opu/odata/sap/Z_GST_SETTLEMENT_ENTRY_SRV/";
            oModel = new sap.ui.model.odata.ODataModel(sSrviceURI, true);
            oModel.setUseBatch(false);
            oModel.getSecurityToken();
            oBusyIndicator = new sap.m.BusyDialog();
        },

        fnClose : function(){
            MessageBox.error("Invalid Document Type");
        },

        exit: function() {
            //... do any further cleanups of your subclass, e.g. detach events ...
            this.$().off("click", this.handleClick);

            if (SomeControl.prototype.exit) { // check whether superclass implements the method
                   SomeControl.prototype.exit.apply(this, arguments); // call the method with the original arguments
            }
      } ,

        fnUpload : function(){
        // var json = [];
        var that = this;
        var filename = this.getView().byId("FileUploaderid").getValue();
        AccGLtoGL = that.getView().byId("RB1").mProperties.selected;
        AccCustVendor = that.getView().byId("RB2").mProperties.selected;
        AccGLCut = that.getView().byId("RB3").mProperties.selected ;
        AccGLVendor = that.getView().byId("RB4").mProperties.selected;

        
        if(AccGLCut === false && AccGLtoGL === false && AccGLVendor === false && AccCustVendor === false){
            MessageBox.information("Fill the requirement details");
        }else{

        oBusyIndicator.open();
        var gst_json = {
            "Srno": "1",
            "AccGlPost": "",
            "AccCustVenPost": "",
            "AccGlCustPost": " ",
            "AccGlVendPost": " ",
            "NavToZGST_JV_STR": [
            {
                "Srno": "",
                "Itemno": "",
                "Company": "",
                "Docdate": "",
                "Postingdate": "",
                "Glaccount": "",
                "Customer": "",
                "Vendor": "",
                "Itemtext": "",
                "Accounttype": "",
                "Taxcode": "",
                "Plant": "",
                "Currency": "",
                "Amtdoccur": "",
                "Itemnotax": "",
                "Profitcenter": "",
                "Costcenter": "",
                "Businessplace": "",
                "Reftext": "",
                "Empcode":"",
                "DocType": "",
                "RefKey1": "",
                "RefKey2": "",
                "RefKey3": ""
            },
            ],
            "NavToReturn": [
            {
                "Srno": "",
                "Message": "",
                "Docno": "",
                "Fiscal": ""
            }
            ]
            }
        var that = this;
       
        
        var oTable = that.getView().byId("table0");
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
        
        for(var i=0;i<excelData.length;i++)
        {  
            jQuery.sap.require("sap.ui.core.format.DateFormat");
            var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "yyyy-MM-ddTHH:mm:ss"
            });
            var splitDate = [];
            var splitDateChar = [];
            splitDateChar = excelData[i].Postingdate.split('');;
            splitDate =  excelData[i].Postingdate.split(splitDateChar[2]);
            var pDate = new Date( splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0])
            excelData[i].Postingdate = oDateFormat.format(pDate); 
            
            splitDate =  excelData[i].Docdate.split('.');
            var ddate = new Date(splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0]);
            excelData[i].Docdate = oDateFormat.format(ddate);


            var Amtdoccur  = parseFloat(excelData[i].Amtdoccur.replaceAll(',',''));
            excelData[i].Amtdoccur = Amtdoccur.toString();

            // excelData[i].Empcode = parseInt(excelData[i].Empcode)


            //Code added by Atharva Bharekar on 4.10.2023 for 4 additional fields

            // if(AccGLCut === true && excelData[i].DocType != "DA" && excelData[i].DocType != "DZ"){
            //     // if(excelData[i].DocType != "DA" && excelData[i].DocType != "DZ"){ 
            //         DType = "Invalid";
            //         break;
            //     // }   
            // }else
            // if(AccGLtoGL === true && excelData[i].DocType != "AB"){
            //     // if(excelData[i].DocType != "AB"){  
            //         DType = "Invalid";
            //     // }   
            // }else
            // if(AccGLVendor === true && excelData[i].DocType != "KA" && excelData[i].DocType != "KZ"){
            //     // if(excelData[i].DocType != "KA" && excelData[i].DocType != "KZ"){    
            //         DType = "Invalid";
            //     // }   
            // }else
            // if(AccCustVendor === true && excelData[i].DocType != "DA" && excelData[i].DocType != "KA"){
            //     // if(excelData[i].DocType != "DA" && excelData[i].DocType != "KA"){ 
            //         DType = "Invalid";  
            //         break;                     
            //     // }   
            // } 

            }    

        // if(DType == "Valid"){

        // }
        // else{
        
        var ojson = new sap.ui.model.json.JSONModel({
            "data": excelData
        });

        if(AccGLtoGL === true)
           {  gst_json.AccGlPost = 'X';}

        if(AccCustVendor === true)
        {  gst_json.AccCustVenPost = 'X';}

        if(AccGLCut === true)
        {  gst_json.AccGlCustPost = 'X';}

        if(AccGLVendor === true)
        {  gst_json.AccGlVendPost = 'X';}

        gst_json.NavToZGST_JV_STR = ojson.oData.data;
        
        if(AccGLtoGL === true || AccCustVendor === true || AccGLCut === true || AccGLVendor === true){
            oModel.create("/HeaderSet",gst_json,{
                success: function(odata, oresponse){
                    oBusyIndicator.close();
                    var tjson = new sap.ui.model.json.JSONModel({
                        "data": odata.NavToReturn.results
                    });
                    oTable.setVisible(true);
                    oTable.setModel(tjson, "tdata");

                    var adCols = [];
                    var oSettings,oSheet;
                       
                                    adCols.push({
                                        lable : 'Srno',
                                        property: 'Srno',
                                        type: EdmType.Number,
                                    });
                                    adCols.push({
                                        lable : 'Message',
                                        property: 'Message',
                                    type: EdmType.String,
                                    });
                                    adCols.push({
                                        lable : 'Docno',
                                        property: 'Docno',
                                        type: EdmType.String,
                                    });
                                    adCols.push({
                                        lable : 'Fiscal',
                                        property: 'Fiscal',
                                        type: EdmType.Number,
                                    });
                                    var splitfname = file.name.split('.');
                                    fName = splitfname[0] + '_result.'+splitfname[1];

                    oSettings = {
                        workbook: {
                            columns: adCols,
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
            });
        }


    // }


// }

        // Code added by atharva bharekar

        // else{

        //     // if(DType == "Invalid"){
        //         // MessageBox.error("Invalid Document Type");
        //     // }
        //     oBusyIndicator.close();
        //     MessageBox.error("Invalid Document Type");
        //     DType = "Valid";
        //     // MessageBox.error("Please select the checkbox");

        // }   
        
            
        },
    
        reader.onerror = function (ex) {
                      console.log(ex);
                        };
                        reader.readAsBinaryString(file);
                    }
          
                }       //Else block for filename condtion
        },

        
    
        fnClear : function(){
            oBusyIndicator.open();
            this.getView().byId("FileUploaderid").setValue("");
            this.getView().byId("RB1").setSelected(false);
            this.getView().byId("RB2").setSelected(false);
            this.getView().byId("RB3").setSelected(false);
            this.getView().byId("RB4").setSelected(false);
            // oTable.setModel(blankJson, "tdata");
            var blankJson = [];
            var bjson = new sap.ui.model.json.JSONModel({
                "data": blankJson
            });
            var oTable = this.getView().byId("table0");
            oTable.setModel(bjson);
            oTable.setVisible(false);
            oBusyIndicator.close();
        },


    fnDownloadTemplate : function(){
        oBusyIndicator.open();
        var aCols, oRowBinding, oSettings, oSheet, oTable;
        var DfName, blank = [];
        var that = this;
        AccGLtoGL = that.getView().byId("RB1").mProperties.selected;
        AccCustVendor = that.getView().byId("RB2").mProperties.selected;
        AccGLCut = that.getView().byId("RB3").mProperties.selected ;
        AccGLVendor = that.getView().byId("RB4").mProperties.selected;

        if(AccGLtoGL === true || AccCustVendor === true || AccGLCut === true || AccGLVendor === true){

        if(AccGLtoGL === true)
           { DfName = 'Gl-GL.xlsx';}

        if(AccCustVendor === true)
        {  DfName = 'Customer-Vendor.xlsx';}

        if(AccGLCut === true)
        {  DfName = 'GL-Customer.xlsx';}

        if(AccGLVendor === true)
        {  DfName = 'GL-Vendor.xlsx';}

        if (!this._oTable) {
            this._oTable = this.getView().byId("table0");;
        }
        oTable = this._oTable;
        // oRowBinding = oTable.getBinding('items');
        aCols = this.createColumnConfig();
        oSettings = {
            workbook: {
                columns: aCols,
                hierarchyLevel: 'Level'
            },
            dataSource: blank,
            fileName: DfName,
            worker: true // We need to disable worker because we are using a MockServer as OData Service
        };

        oSheet = new Spreadsheet(oSettings);
        oSheet.build().finally(function() {
            // oSheet.destroy();
        });
        // oSheet.then(function() {
            
        // });

        oBusyIndicator.close();
        }
        else{
            oBusyIndicator.close();
            MessageBox.error("Please select the checkbox");
        }
    },
    createColumnConfig: function() {
        var aCols = [];

        if(AccGLtoGL === true)
        {  

            aCols.push({
                lable : 'Srno',
                property: 'Srno',
                type: EdmType.Number,
            });
            aCols.push({
                lable: 'Itemno',
                property: 'Itemno',
                type: EdmType.String
            });
            aCols.push({
                lable: 'Company',
                property: 'Company',
                type: EdmType.String
            });
            aCols.push({
                property: 'Docdate',
                type: EdmType.Date
                // type: sap.ui.export.EdmType.DateTime
            });
            aCols.push({
                property: 'Postingdate',
                type: EdmType.Date
                // type: sap.ui.export.EdmType.DateTime
            });
            aCols.push({
                property: 'Glaccount',
                type: EdmType.String
            });
            aCols.push({
                property: 'Itemtext',
                type: EdmType.String
            });
            aCols.push({
                property: 'Accounttype',
                type: EdmType.String
            });
            aCols.push({
                property: 'Taxcode',
                type: EdmType.String
            });
            aCols.push({
                property: 'Currency',
                type: EdmType.String
            });
            aCols.push({
                property: 'Amtdoccur',
                type: EdmType.Number,
                scale : 4
            });
            aCols.push({
                property: 'Itemnotax',
                type: EdmType.String
            });
            aCols.push({
                property: 'Costcenter',
                type: EdmType.String
            });
            aCols.push({
                property: 'Profitcenter',
                type: EdmType.String
            });
            aCols.push({
                property: 'Businessplace',
                type: EdmType.String
            });
            aCols.push({
                property: 'Reftext',
                type: EdmType.String
            });

            //Code added by Atharva Bharekar on 4.10.2023 for 4 additional fields

            aCols.push({
                property: 'DocType',
                type: EdmType.String
            });
            aCols.push({
                property: 'RefKey1',
                type: EdmType.String
            });
            aCols.push({
                property: 'RefKey2',
                type: EdmType.String
            });
            aCols.push({
                property: 'RefKey3',
                type: EdmType.String
            });
            return aCols;

        }

        if(AccCustVendor === true)
        {  
            aCols.push({
                property: 'Srno',
                type: EdmType.Number
            });
            aCols.push({
                property: 'Itemno',
                type: EdmType.String
            });
            aCols.push({
                property: 'Company',
                type: EdmType.String
            });
            aCols.push({
                property: 'Docdate',
                type: EdmType.Date
                // type: sap.ui.export.EdmType.DateTime
            });
            aCols.push({
                property: 'Postingdate',
                type: EdmType.Date
                // type: sap.ui.export.EdmType.DateTime
            });
            aCols.push({
                property: 'Customer',
                type: EdmType.String
            });
            aCols.push({
                property: 'Vendor',
                type: EdmType.String
            });
            aCols.push({
                property: 'Glaccount',
                type: EdmType.String
            });
            aCols.push({
                property: 'Itemtext',
                type: EdmType.String
            });
            aCols.push({
                property: 'Currency',
                type: EdmType.String
            });
            aCols.push({
                property: 'Amtdoccur',
                type: EdmType.Number
            });
            aCols.push({
                property: 'Profitcenter',
                type: EdmType.String
            });
            aCols.push({
                property: 'Businessplace',
                type: EdmType.String
            });
            aCols.push({
                property: 'Reftext',
                type: EdmType.String
            });

            //Code added by Atharva Bharekar on 4.10.2023 for 4 additional fields

            aCols.push({
                property: 'DocType',
                type: EdmType.String
            });
            aCols.push({
                property: 'RefKey1',
                type: EdmType.String
            });
            aCols.push({
                property: 'RefKey2',
                type: EdmType.String
            });
            aCols.push({
                property: 'RefKey3',
                type: EdmType.String
            });
            return aCols;

        }

        if(AccGLCut === true)
        { 
            aCols.push({
                property: 'Srno',
                type: EdmType.Number
            });
            aCols.push({
                property: 'Itemno',
                type: EdmType.String,
                scale: 0
            });
            aCols.push({
                property: 'Company',
                type: EdmType.String
            });
            aCols.push({
                property: 'Docdate',
                type: EdmType.Date
                // type: sap.ui.export.EdmType.DateTime
            });
            aCols.push({
                property: 'Postingdate',
                type: EdmType.Date
                // type: sap.ui.export.EdmType.DateTime
            });
            aCols.push({
                property: 'Customer',
                type: EdmType.String
            });
            aCols.push({
                property: 'Glaccount',
                type: EdmType.String
            });
            aCols.push({
                property: 'Itemtext',
                type: EdmType.String
            });
            aCols.push({
                property: 'Accounttype',
                type: EdmType.String
            });
            aCols.push({
                property: 'Taxcode',
                type: EdmType.String
            });
            aCols.push({
                property: 'Currency',
                type: EdmType.String
            });
            aCols.push({
                property: 'Amtdoccur',
                type: EdmType.Number
            });
            aCols.push({
                property: 'Itemnotax',
                type: EdmType.String
            });
            aCols.push({
                property: 'Costcenter',
                type: EdmType.String
            });
            aCols.push({
                property: 'Profitcenter',
                type: EdmType.String
            });
            aCols.push({
                property: 'Businessplace',
                type: EdmType.String
            });
            aCols.push({
                property: 'Reftext',
                type: EdmType.String
            });
            aCols.push({
                property: 'Spglind',
                type: EdmType.String
            });
            aCols.push({
                property: 'Empcode',
                type: EdmType.String
            });

            //Code added by Atharva Bharekar on 4.10.2023 for 4 additional fields

            aCols.push({
                property: 'DocType',
                type: EdmType.String
            });
            aCols.push({
                property: 'RefKey1',
                type: EdmType.String
            });
            aCols.push({
                property: 'RefKey2',
                type: EdmType.String
            });
            aCols.push({
                property: 'RefKey3',
                type: EdmType.String
            });
            return aCols;

           
        }


        if(AccGLVendor === true)
        {  
            aCols.push({
                property: 'Srno',
                type: EdmType.Number,
                textAlign: "center"
            });
            aCols.push({
                property: 'Itemno',
                type: EdmType.String
            });
            aCols.push({
                property: 'Company',
                type: EdmType.String
            });
            aCols.push({
                property: 'Docdate',
                type: EdmType.Date
                // type: sap.ui.export.EdmType.DateTime
            });
            aCols.push({
                property: 'Postingdate',
                type: EdmType.Date
                // type: sap.ui.export.EdmType.DateTime
            });
            aCols.push({
                property: 'Vendor',
                type: EdmType.String
            });
            aCols.push({
                property: 'Glaccount',
                type: EdmType.String
            });
            aCols.push({
                property: 'Itemtext',
                type: EdmType.String
            });
            aCols.push({
                property: 'Accounttype',
                type: EdmType.String
            });
            aCols.push({
                property: 'Plant',
                type: EdmType.String
            });
            aCols.push({
                property: 'Taxcode',
                type: EdmType.String
            });
            aCols.push({
                property: 'Currency',
                type: EdmType.String
            });
            aCols.push({
                property: 'Amtdoccur',
                type: EdmType.Number
            });
            aCols.push({
                property: 'Itemnotax',
                type: EdmType.String
            });
            aCols.push({
                property: 'Costcenter',
                type: EdmType.String
            });
            aCols.push({
                property: 'Profitcenter',
                type: EdmType.String
            });
            aCols.push({
                property: 'Businessplace',
                type: EdmType.String
            });
            aCols.push({
                property: 'Reftext',
                type: EdmType.String
            });

            //Code added by Atharva Bharekar on 4.10.2023 for 4 additional fields

            aCols.push({
                property: 'DocType',
                type: EdmType.String
            });
            aCols.push({
                property: 'RefKey1',
                type: EdmType.String
            });
            aCols.push({
                property: 'RefKey2',
                type: EdmType.String
            });
            aCols.push({
                property: 'RefKey3',
                type: EdmType.String
            });

            return aCols;
        }

    },          
    });
});

