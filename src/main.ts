export interface ILinkedListNode<T> {
  value: T
  next?: ILinkedListNode<T>
}

export interface ILinkedList<T> {
  head?: ILinkedListNode<T>
  get: (index: number) => ILinkedListNode<T> | undefined
  append: (value: T) => void
  // pop: () => T
  isEmpty: () => boolean
  fromArray: (value: T[]) => ILinkedList<T>
  toArray: () => T[]
}

export class LinkedList<T> implements ILinkedList<T> {
  head: ILinkedListNode<T> | undefined = undefined

  isEmpty () {
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

export function mean(list: LinkedList<number>): number {
  let sum = 0
  let count = 0 
  let current = list.head
  while (current) {
    sum += current.value
    count += 1
    current = current.next
  }
  if (count === 0) return 0
  return sum / count
}

export function stdDeviation(list: LinkedList<number>): number {
  const avg = mean(list)
  let n = 0
  let current = list.head
  let diffSquaresSum = 0
  while (current) {
    const diff = current.value - avg

    diffSquaresSum += (diff * diff)
    current = current.next
    n += 1
  }
  if (diffSquaresSum === 0) return 0
  return Math.sqrt(diffSquaresSum / (n - 1))
}
