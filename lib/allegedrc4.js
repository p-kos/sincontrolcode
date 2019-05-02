module.exports = {

        /**
         * @param {String} message Message to encrypt
         * @param {String} key 
         * @param {bool} unscripted 
         * @returns string
         */
        encryptMessageRC4: function (message, key, unscripted) {
            var state = []//new Array[256];            
            var x = 0;
            var y = 0;
            var index1 = 0;
            var index2 = 0;
            var nmen;
            var messageEncryption = "";

            for (var i = 0; i <= 255; i++) {
                state[i] = i;
            }

            for (var i = 0; i <= 255; i++) {
                index2 = (key.charCodeAt(index1) + state[i] + index2) % 256;
                var aux = state[i];
                state[i] = state[index2];
                state[index2] = aux;
                index1 = (index1 + 1) % key.length;
            }

            for (var i = 0; i < message.length; i++) {
                x = (x + 1) % 256;
                y = (state[x] + y) % 256;
                var aux = state[x];
                state[x] = state[y];
                state[y] = aux;
                nmen = message.charCodeAt(i) ^ state[(state[x] + state[y]) % 256];
                var nmenHex = nmen.toString(16).toUpperCase();
                messageEncryption = messageEncryption + ((unscripted) ? "" : "-") + ((nmenHex.length === 1) ? ("0" + nmenHex) : nmenHex);
            }
            return (unscripted === true) ? messageEncryption : messageEncryption.substr(1, messageEncryption.length - 1);
        }
    }
