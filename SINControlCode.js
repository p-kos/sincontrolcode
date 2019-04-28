class AllegedRC4 {

    /**
     * @param {String} message Message to encrypt
     * @param {String} key 
     * @param {bool} unscripted 
     * @returns string
     */
    static encryptMessageRC4 = (message, key, unscripted) => {
        let state = []//new Array[256];            
        let x = 0;
        let y = 0;
        let index1 = 0;
        let index2 = 0;
        let nmen;
        let messageEncryption = "";

        for (let i = 0; i <= 255; i++) {
            state[i] = i;
        }

        for (let i = 0; i <= 255; i++) {
            index2 = (key.charCodeAt(index1) + state[i] + index2) % 256;
            let aux = state[i];
            state[i] = state[index2];
            state[index2] = aux;
            index1 = (index1 + 1) % key.length;
        }

        for (let i = 0; i < message.length; i++) {
            x = (x + 1) % 256;
            y = (state[x] + y) % 256;
            let aux = state[x];
            state[x] = state[y];
            state[y] = aux;
            nmen = message.charCodeAt(i) ^ state[(state[x] + state[y]) % 256];
            let nmenHex = nmen.toString(16).toUpperCase();
            messageEncryption = messageEncryption + ((unscripted) ? "" : "-") + ((nmenHex.length === 1) ? ("0" + nmenHex) : nmenHex);
        }
        return (unscripted === true) ? messageEncryption : messageEncryption.substr(1, messageEncryption.length - 1);
    }

}

class Base64SIN {

    /**
     * @param {String} value
     * @returns String Base64 string
     */
    static convertBase64 = (value) => {
        let dictionary = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
            "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
            "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d",
            "e", "f", "g", "h", "i", "j", "k", "l", "m", "n",
            "o", "p", "q", "r", "s", "t", "u", "v", "w", "x",
            "y", "z", "+", "/"];
        let quotient = 1;
        let remainder;
        let word = "";
        while (quotient > 0) {
            quotient = Math.floor(value / 64);
            remainder = value % 64;
            word = dictionary[remainder] + word;
            value = quotient;
        }
        return word;
    }
}

class Verhoeff {
    // The multiplication table
    static d =
        [
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
            [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
            [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
            [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
            [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
            [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
            [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
            [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
            [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
        ];

    // The permutation table
    static p = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
        [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
        [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
        [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
        [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
        [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
        [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
    ];

    // The inverse table
    static inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

    /**
     * Validates that an entered number is Verhoeff compliant.
     * @param {string} num
     * @returns bool True if Verhoeff compliant, otherwise false
     */
    static validateVerhoeff = (num) => {
        let c = 0;
        let myArray = this.stringToReversedIntArray(num);

        for (let i = 0; i < myArray.length; i++) {
            c = this.d[c][this.p[(i % 8)][myArray[i]]];
        }

        return c === 0;
    }

    /**
     * For a given number generates a Verhoeff digit
     * Append this check digit to num
     * @param {string} num
     * @returns string Verhoeff check digit as string
     */
    static generateVerhoeff = (num) => {
        let c = 0;
        let myArray = this.stringToReversedIntArray(num);

        for (let i = 0; i < myArray.length; i++) {
            c = this.d[c][this.p[((i + 1) % 8)][myArray[i]]];
        }

        return String(this.inv[c]);
    }

    /**
     * Converts a string to a reversed integer array.
     * @param {string} num
     * @returns Reversed integer array
     */
    static stringToReversedIntArray = (num) => {
        let myArray = num.split("").reverse();
        let result = [];
        myArray.forEach(n => {
            result.push(Number(n));
        });
        return result;
    }

}

class SINControlCode {

    /**
     * @param {String} authorizationNumber 
     * @param {String} invoiceNumber 
     * @param {String} nitci Número de Identificación Tributaria o Carnet de Identidad
     * @param {String} dateOfTransaction fecha de transaccion de la forma AAAAMMDD
     * @param {String} transactionAmount Monto de la transacción
     * @param {String} dosageKey Llave de dosificación
     * @returns String Codigo de Control generado de la forma 6A-DC-53-05-14
     */
    static generateControlCode = (authorizationNumber, invoiceNumber, nitci,
        dateOfTransaction, transactionAmount, dosageKey) => {

        //round up the amount
        transactionAmount = this.roundUp(transactionAmount);

        /* ========== Step 1 ============= */
        invoiceNumber = this.addVerhoeffDigit(invoiceNumber, 2);
        nitci = this.addVerhoeffDigit(nitci, 2);
        dateOfTransaction = this.addVerhoeffDigit(dateOfTransaction, 2);
        transactionAmount = this.addVerhoeffDigit(transactionAmount, 2);
        
        //sum of all values got
        let sumOfVariables = 0;
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
        let sumOfVariables5Verhoeff = this.addVerhoeffDigit(String(sumOfVariables), 5);

        /* ========== Step 2 ============= */
        let fiveDigitsVerhoeff = sumOfVariables5Verhoeff.substr(sumOfVariables5Verhoeff.length - 5);
        let numbers = [];
        for (let i = 0; i < 5; i++) {
            numbers[i] = Number(String(fiveDigitsVerhoeff[i])) + 1;
        }

        let string1 = dosageKey.substr(0, numbers[0]);
        let string2 = dosageKey.substr(numbers[0], numbers[1]);
        let string3 = dosageKey.substr(numbers[0] + numbers[1], numbers[2]);
        let string4 = dosageKey.substr(numbers[0] + numbers[1] + numbers[2], numbers[3]);
        let string5 = dosageKey.substr(numbers[0] + numbers[1] + numbers[2] + numbers[3], numbers[4]);

        let authorizationNumberDKey = authorizationNumber + string1;
        let invoiceNumberdKey = invoiceNumber + string2;
        let NITCIDKey = nitci + string3;
        let dateOfTransactionDKey = dateOfTransaction + string4;
        let transactionAmountDKey = transactionAmount + string5;

        /* ========== Step 3 ============= */
        //Concat all string from step 2
        let stringDKey = authorizationNumberDKey + invoiceNumberdKey + NITCIDKey + dateOfTransactionDKey + transactionAmountDKey;
        // cypher key + 5 Verhoeff digits from step 2
        let keyForEncryption = dosageKey + fiveDigitsVerhoeff;
        //apply AllegedRC4
        let allegedRC4String = AllegedRC4.encryptMessageRC4(stringDKey, keyForEncryption, true);

        /* ========== Step 4 ============= */
        //sum of ascii values
        let totalAmount = 0;
        let sp1 = 0;
        let sp2 = 0;
        let sp3 = 0;
        let sp4 = 0;
        let sp5 = 0;
        var asciiBytes = [];
        var charCode;
        for (var i = 0; i < allegedRC4String.length; ++i) {
            charCode = allegedRC4String.charCodeAt(i);
            //asciiBytes.push((charCode & 0xFF00) >> 8);
            asciiBytes.push(charCode & 0xFF);
        }

        let tmp = 1;
        for (let i = 0; i < asciiBytes.length; i++) {
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
        let tmp1 = Math.floor(totalAmount * sp1 / numbers[0]);
        let tmp2 = Math.floor(totalAmount * sp2 / numbers[1]);
        let tmp3 = Math.floor(totalAmount * sp3 / numbers[2]);
        let tmp4 = Math.floor(totalAmount * sp4 / numbers[3]);
        let tmp5 = Math.floor(totalAmount * sp5 / numbers[4]);
        //sum of results
        let sumProduct = tmp1 + tmp2 + tmp3 + tmp4 + tmp5;
        // base64 of result
        let base64SIN = Base64SIN.convertBase64(sumProduct);

        /* ========== Step 6 ============= */
        //Apply AllegedRC4 to previous value
        return AllegedRC4.encryptMessageRC4(base64SIN, `${dosageKey}${fiveDigitsVerhoeff}`, false);
    }

    /**
     * Add N Verhoeff digits to a text
     * @param {string} value
     * @param {number} max Digits to add
     */
    static addVerhoeffDigit = (value, max) => {
        for (let i = 1; i <= max; i++) {
            value = value + Verhoeff.generateVerhoeff(value);
        }
        return value;
    }

    /**
     * Round up value
     * @param {string} value
     * @returns {Number} result without decimals
     */
    static roundUp = (value) => {
        let a = ".";//Convert.ToChar(CultureInfo.CurrentCulture.NumberFormat.NumberDecimalSeparator);            
        value = (a === ',') ? value.replace(".", ",") : (a === '.') ? value.replace(",", ".") : value;
        let decimalVal = Number(value);
        //redondea a 0 decimales                                    
        return `${Math.round(decimalVal)}`;
    }
}

export default SINControlCode;