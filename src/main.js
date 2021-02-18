"use strict";
exports.__esModule = true;
exports.stdDeviation = exports.mean = exports.LinkedList = void 0;
var LinkedList = /** @class */ (function () {
    function LinkedList() {
        this.head = undefined;
    }
    LinkedList.prototype.isEmpty = function () {
        return !this.head;
    };
    LinkedList.prototype.append = function (value) {
        if (!this.head) {
            var newNode = { value: value };
            this.head = newNode;
            return;
        }
        var current = this.head;
        while (current.next) {
            current = current.next;
        }
        var tail = current;
        tail.next = { value: value };
    };
    LinkedList.prototype.get = function (index) {
        if (!this.head || index < 0)
            return undefined;
        var currentItem = this.head;
        var currentIndex = 0;
        do {
            if (currentIndex === index)
                return currentItem; // RETURN SELECTED NODE
            currentItem = currentItem.next;
            currentIndex += 1;
        } while (currentItem);
        return undefined;
    };
    LinkedList.prototype.fromArray = function (array) {
        var linkedList = new LinkedList();
        array.forEach(function (elem) { linkedList.append(elem); });
        return linkedList;
    };
    LinkedList.prototype.toArray = function () {
        var array = [];
        var current = this.head;
        while (current) {
            array.push(current.value);
            current = current.next;
        }
        return array;
    };
    return LinkedList;
}());
exports.LinkedList = LinkedList;
function mean(list) {
    var sum = 0;
    var count = 0;
    var current = list.head;
    while (current) {
        sum += current.value;
        count += 1;
        current = current.next;
    }
    if (count === 0)
        return 0;
    return sum / count;
}
exports.mean = mean;
function stdDeviation(list) {
    var avg = mean(list);
    var n = 0;
    var current = list.head;
    var diffSquaresSum = 0;
    while (current) {
        var diff = current.value - avg;
        diffSquaresSum += (diff * diff);
        current = current.next;
        n += 1;
    }
    if (diffSquaresSum === 0)
        return 0;
    return Math.sqrt(diffSquaresSum / (n - 1));
}
exports.stdDeviation = stdDeviation;
function main() {
    console.log('**********************************************************************');
    console.log('**** UANL FCFM 9no semestre - Estimación de proyectos de software ****');
    console.log('****    PSP Problema 1: Cálculo de Media y Desviación estándar    ****');
    console.log('**** Estudiante: Rafael Baruc Almaguer López - Matricula: 1443335 ****');
    console.log('**********************************************************************');
    var estimateProxySizes = new LinkedList().fromArray([
        160, 591, 114, 229, 230, 270, 128, 1657, 624, 1503
    ]);
    var developmentHours = new LinkedList().fromArray([
        15.0, 69.9, 6.5, 22.4, 28.4, 65.9, 19.4, 198.7, 38.8, 138.2
    ]);
    // * calculations ProxySizes
    var meanValue1 = mean(estimateProxySizes);
    var stdDevValue1 = stdDeviation(estimateProxySizes);
    // * calculations ProxySizes
    var meanValue2 = mean(developmentHours);
    var stdDevValue2 = stdDeviation(developmentHours);
    console.log('\n\n');
    console.log('Resultados:');
    console.log("Media columna 1: " + meanValue1.toFixed(2) + "  ||  Desv std Col1: " + stdDevValue1.toFixed(2));
    console.log("Media columna 2:  " + meanValue2.toFixed(2) + "  ||  Desv std Col2: " + stdDevValue2.toFixed(2));
}
// main()
