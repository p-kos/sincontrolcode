module.exports=new verhoeff();
function verhoeff() {

    // The multiplication table
    d =
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
    p = [
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
    inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];
    
    return {
        /**
         * Validates that an entered number is Verhoeff compliant.
         * @param {string} num
         * @returns bool True if Verhoeff compliant, otherwise false
         */
        validateVerhoeff: function (num) {
            var c = 0;
            var myArray = this.stringToReversedIntArray(num);

            for (var i = 0; i < myArray.length; i++) {
                c = d[c][p[(i % 8)][myArray[i]]];
            }

            return c === 0;
        },

        /**
         * For a given number generates a Verhoeff digit
         * Append this check digit to num
         * @param {string} num
         * @returns string Verhoeff check digit as string
         */
        generateVerhoeff: function (num) {
            var c = 0;
            var myArray = this.stringToReversedIntArray(num);

            for (var i = 0; i < myArray.length; i++) {
                c = d[c][p[((i + 1) % 8)][myArray[i]]];
            }

            return String(inv[c]);
        },

        /**
         * Converts a string to a reversed integer array.
         * @param {string} num
         * @returns Reversed integer array
         */
        stringToReversedIntArray: function (num) {
            var myArray = num.split("").reverse();
            var result = [];
            myArray.forEach(n => {
                result.push(Number(n));
            });
            return result;
        }
    }
}