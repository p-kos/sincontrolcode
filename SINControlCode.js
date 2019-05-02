var AllegedRC4 = require('./lib/allegedrc4');
var Base64SIN = require('./lib/base64sin');
var Verhoeff = require('./lib/verhoeff');

function SINControlCode (){
    
    return {
        /**
         * @param {String} authorizationNumber 
         * @param {String} invoiceNumber 
         * @param {String} nitci Número de Identificación Tributaria o Carnet de Identidad
         * @param {String} dateOfTransaction fecha de transaccion de la forma AAAAMMDD
         * @param {String} transactionAmount Monto de la transacción
         * @param {String} dosageKey Llave de dosificación
         * @returns String Codigo de Control generado de la forma 6A-DC-53-05-14
         */
        generateControlCode: function (authorizationNumber, invoiceNumber, nitci,dateOfTransaction, transactionAmount, dosageKey) {

            //round up the amount
            transactionAmount = this.roundUp(transactionAmount);

            /* ========== Step 1 ============= */
            invoiceNumber = this.addVerhoeffDigit(invoiceNumber, 2);
            nitci = this.addVerhoeffDigit(nitci, 2);
            dateOfTransaction = this.addVerhoeffDigit(dateOfTransaction, 2);
            transactionAmount = this.addVerhoeffDigit(transactionAmount, 2);

            //sum of all values got
            var sumOfVariables = 0;
            try {
                sumOfVariables = Number(invoiceNumber)
                    + Number(nitci)
                    + Number(dateOfTransaction)
                    + Number(transactionAmount);
            }
            catch (e) {
                console.log(`FormatException source: ${e} `);
                throw e;
            }

            //Add 5 Verhoeff digits to total sum 
            var sumOfVariables5Verhoeff = this.addVerhoeffDigit(String(sumOfVariables), 5);

            /* ========== Step 2 ============= */
            var fiveDigitsVerhoeff = sumOfVariables5Verhoeff.substr(sumOfVariables5Verhoeff.length - 5);
            var numbers = [];
            for (var i = 0; i < 5; i++) {
                numbers[i] = Number(String(fiveDigitsVerhoeff[i])) + 1;
            }

            var string1 = dosageKey.substr(0, numbers[0]);
            var string2 = dosageKey.substr(numbers[0], numbers[1]);
            var string3 = dosageKey.substr(numbers[0] + numbers[1], numbers[2]);
            var string4 = dosageKey.substr(numbers[0] + numbers[1] + numbers[2], numbers[3]);
            var string5 = dosageKey.substr(numbers[0] + numbers[1] + numbers[2] + numbers[3], numbers[4]);

            var authorizationNumberDKey = authorizationNumber + string1;
            var invoiceNumberdKey = invoiceNumber + string2;
            var NITCIDKey = nitci + string3;
            var dateOfTransactionDKey = dateOfTransaction + string4;
            var transactionAmountDKey = transactionAmount + string5;

            /* ========== Step 3 ============= */
            //Concat all string from step 2
            var stringDKey = authorizationNumberDKey + invoiceNumberdKey + NITCIDKey + dateOfTransactionDKey + transactionAmountDKey;
            // cypher key + 5 Verhoeff digits from step 2
            var keyForEncryption = dosageKey + fiveDigitsVerhoeff;
            //apply AllegedRC4
            var allegedRC4String = AllegedRC4.encryptMessageRC4(stringDKey, keyForEncryption, true);

            /* ========== Step 4 ============= */
            //sum of ascii values
            var totalAmount = 0;
            var sp1 = 0;
            var sp2 = 0;
            var sp3 = 0;
            var sp4 = 0;
            var sp5 = 0;
            var asciiBytes = [];
            var charCode;
            for (var i = 0; i < allegedRC4String.length; ++i) {
                charCode = allegedRC4String.charCodeAt(i);
                //asciiBytes.push((charCode & 0xFF00) >> 8);
                asciiBytes.push(charCode & 0xFF);
            }

            var tmp = 1;
            for (var i = 0; i < asciiBytes.length; i++) {
                totalAmount += asciiBytes[i];
                switch (tmp) {
                    case 1: sp1 += asciiBytes[i]; break;
                    case 2: sp2 += asciiBytes[i]; break;
                    case 3: sp3 += asciiBytes[i]; break;
                    case 4: sp4 += asciiBytes[i]; break;
                    case 5: sp5 += asciiBytes[i]; break;
                }
                tmp = (tmp < 5) ? tmp + 1 : 1;
            }

            /* ========== Step 5 ============= */
            //total sum * parciales sums / results 
            var tmp1 = Math.floor(totalAmount * sp1 / numbers[0]);
            var tmp2 = Math.floor(totalAmount * sp2 / numbers[1]);
            var tmp3 = Math.floor(totalAmount * sp3 / numbers[2]);
            var tmp4 = Math.floor(totalAmount * sp4 / numbers[3]);
            var tmp5 = Math.floor(totalAmount * sp5 / numbers[4]);
            //sum of results
            var sumProduct = tmp1 + tmp2 + tmp3 + tmp4 + tmp5;
            // base64 of result
            var base64SIN = Base64SIN.convertBase64(sumProduct);

            /* ========== Step 6 ============= */
            //Apply AllegedRC4 to previous value
            return AllegedRC4.encryptMessageRC4(base64SIN, `${dosageKey}${fiveDigitsVerhoeff}`, false);
        },

        /**
         * Add N Verhoeff digits to a text
         * @param {string} value
         * @param {number} max Digits to add
         */
        addVerhoeffDigit: function (value, max) {
            for (var i = 1; i <= max; i++) {
                value = value + Verhoeff.generateVerhoeff(value);
            }
            return value;
        },

        /**
         * Round up value
         * @param {string} value
         * @returns {Number} result without decimals
         */
        roundUp: function (value) {
            var a = ".";//Convert.ToChar(CultureInfo.CurrentCulture.NumberFormat.NumberDecimalSeparator);            
            value = (a === ',') ? value.replace(".", ",") : (a === '.') ? value.replace(",", ".") : value;
            var decimalVal = Number(value);
            //redondea a 0 decimales                                    
            return `${Math.round(decimalVal)}`;
        }
    }
}
module.exports = SINControlCode;
