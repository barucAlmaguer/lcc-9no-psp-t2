var LinkedList = /** @class */ (function () {
    function LinkedList() {
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
var linkedList = new LinkedList();
linkedList.append(0);
linkedList.append(1);
linkedList.append(2);
linkedList.append(3);
linkedList.append(4);
console.log(linkedList.head);
var list = linkedList.toArray();
console.log(list);
