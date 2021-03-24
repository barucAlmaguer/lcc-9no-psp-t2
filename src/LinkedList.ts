interface ILinkedListNode<T> {
  value: T
  next?: ILinkedListNode<T>
}

interface ILinkedList<T> {
  head?: ILinkedListNode<T>
  get: (index: number) => ILinkedListNode<T> | undefined
  append: (value: T) => void
  // pop: () => T
  isEmpty: () => boolean
  fromArray: (value: T[]) => ILinkedList<T>
  toArray: () => T[]
}

class LinkedList<T> implements ILinkedList<T> {
  head: ILinkedListNode<T> | undefined = undefined

  isEmpty() {
    return !this.head
  }
  append(value: T) {
    if (!this.head) {
      const newNode: ILinkedListNode<T> = { value }
      this.head = newNode
      return
    }
    let current = this.head
    while (current.next) {
      current = current.next
    }
    const tail = current
    tail.next = { value }
  }

  get(index: number) {
    if (!this.head || index < 0) return undefined
    let currentItem: ILinkedListNode<T> | undefined = this.head
    let currentIndex = 0
    do {
      if (currentIndex === index) return currentItem // RETURN SELECTED NODE
      currentItem = currentItem.next
      currentIndex += 1
    } while (currentItem)
    return undefined
  }
  fromArray(array: T[]) {
    const linkedList = new LinkedList<T>()
    array.forEach(elem => { linkedList.append(elem) })
    return linkedList
  }
  toArray() {
    const array: T[] = []
    let current = this.head
    while (current) {
      array.push(current.value)
      current = current.next
    }
    return array
  }
}

export {
  LinkedList,
  ILinkedListNode,
  ILinkedList
}
