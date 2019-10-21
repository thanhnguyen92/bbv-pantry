interface MenuNode {
  name: string;
  action?: string;
  children?: MenuNode[];
}

interface MenuFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
