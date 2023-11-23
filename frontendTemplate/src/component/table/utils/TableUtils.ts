

class Sort {
    static descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
        if (b[orderBy] < a[orderBy]) {
          return -1;
        }
        if (b[orderBy] > a[orderBy]) {
          return 1;
        }
        return 0;
      }
    
      static getComparator<Key extends keyof any>(
        order: any,
        orderBy: Key,
      ): (
        a: { [key in Key]: number | string },
        b: { [key in Key]: number | string },
      ) => number {
        return order === 'desc'
          ? (a, b) => this.descendingComparator(a, b, orderBy)
          : (a, b) => -this.descendingComparator(a, b, orderBy);
      }
    
      static stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
        const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
        stabilizedThis.sort((a, b) => {
          const order = comparator(a[0], b[0]);
          if (order !== 0) {
            return order;
          }
          return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
      }

      static sortData(data: any[],order: any, orderBy: any ) {
        return this.stableSort(data, this.getComparator(order, orderBy))
      }
}

export default class TableUtils {
    static sort = Sort;
  
}