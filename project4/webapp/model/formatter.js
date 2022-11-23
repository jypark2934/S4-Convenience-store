sap.ui.define([
], function() {
    'use strict';
    return{
        setImgUrl : function(sValue) {
            var sURL = "../Image/11.png";
            var sPath = jQuery.sap.getModulePath("project4");
            switch (sValue) {
                case 'LU10001':
                    sURL = sPath + '/Image/11.png';
                    break;
                case 'LU10002':
                    sURL = sPath + '/Image/ham.png';
                     break;
                 case 'LU10003':
                     sURL = sPath + '/Image/2d.png';
                     break;
                 case 'LU10004':
                     sURL = sPath + '/Image/sumi.png';
                     break;
                 case 'LU10005':
                      sURL = sPath + '/Image/cheesespa.png';
                     break;
                 case 'LU10006':
                      sURL = sPath + '/Image/kimch.png';
                     break;
                 case 'LU10007':
                      sURL = sPath + '/Image/recota.png';
                     break;
                 case 'LU10008':
                       sURL = sPath + '/Image/napollian.png';
                     break;
                 case 'LU10009':
                      sURL = sPath + '/Image/bibimbab.png';
                     break;
                 case 'LU10010':
                     sURL = sPath + '/Image/jonga.png';
                     break;
                default:
                    sURL = sPath + '/Image/napollian.png'; 
                    break;
            }

            return sURL;
        }
    }
});