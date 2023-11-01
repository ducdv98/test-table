import {Component} from '@angular/core';

interface CellData {
  id?: string | number;
  value: string;
  colspan?: number;
  rowspan?: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'test-table';

  data = {
    "id": 17319506,
    "productionDay": "2023-11-01",
    "productId": "826100",
    "productName": "PARBOILED REIS",
    "level": 1,
    "availability": true,
    "children": [
      {
        "id": 17319420,
        "parentId": 17319506,
        "productionDay": "2023-11-01",
        "productId": "825430",
        "productName": "KICHERERBSEN",
        "level": 2,
        "availability": true
      },
      {
        "id": 17310640,
        "parentId": 17319506,
        "productionDay": "2023-10-31",
        "productId": "824610",
        "productName": "LKG.SPITZE KB G+G",
        "level": 2,
        "availability": true
      },
      {
        "id": 17319331,
        "parentId": 17319506,
        "productionDay": "2023-10-31",
        "productId": "825563",
        "productName": "P BIO COUSCOUS DE",
        "level": 2,
        "availability": true
      }
    ]
  };

  data2 = {
    "id": 17319506,
    "productionDay": "2023-11-01",
    "productId": "826100",
    "productName": "PARBOILED REIS",
    "level": 1,
    "availability": true,
    "children": [
      {
        "id": 17319420,
        "parentId": 17319506,
        "productionDay": "2023-11-01",
        "productId": "825430",
        "productName": "KICHERERBSEN",
        "level": 2,
        "availability": true
      },
      {
        "id": 17310640,
        "parentId": 17319506,
        "productionDay": "2023-10-31",
        "productId": "824610",
        "productName": "LKG.SPITZE KB G+G",
        "level": 2,
        "availability": true,
        children: [
          {
            "id": 17319354,
            "parentId": 17310640,
            "productionDay": "2023-10-31",
            "productId": "825563",
            "productName": "test level 3",
            "level": 3,
            "availability": true
          },
          {
            "id": 17769345,
            "parentId": 17310640,
            "productionDay": "2023-10-31",
            "productId": "825563",
            "productName": "test level 5453",
            "level": 3,
            "availability": true
          }
        ]
      },
    ]
  };

  getColumns() {
    const maxLevel = this.findMaxLevel(this.data2);
    return [
      ...Array.from({length: maxLevel}, (_, i) => `${i + 1} lvl`),
      'Product',
      'Manufacturing Date',
      'Material availability'
    ]
  }

  generateTable() {
    const table: any[][] = [];

    const recursiveParse = (node: any, parentPath: string[] = []) => {
      const row: any[] = [];
      const path = [...parentPath, node.level.toString()];

      row.push({
        value: path.join('.'),
        rowspan: node.children?.length > 0 ? this.countDescendants(node) + 1 : 1
      });

      if (node.level === 1 && node.children?.length > 0) {
        // @ts-ignore
        row.push({value: '', colspan: this.findMaxLevel(node) - 1});
      } else if (this.hasSiblingWithChildren(this.data2, node.id)) {
        // @ts-ignore
        row.push({value: '', colspan: this.findRelativeDepth(this.data2, node) - 1});
      }

      row.push({value: `${node.productId} ${node.productName}`});
      row.push({value: node.productionDay});
      row.push({value: node.availability});

      table.push(row);

      if (node.children) {
        for (const child of node.children) {
          recursiveParse(child, path);
        }
      }
    }

    recursiveParse(this.data2);
    return table;
  }

  findMaxLevel = (tree: any) => {
    console.log(tree)
    if (!tree.children) {
      return tree.level;
    }

    const childLevels = tree.children.map(this.findMaxLevel);
    return Math.max(...childLevels);
  }

  private countDescendants(tree: any): number {
    if (!tree || !tree.children || tree.children.length === 0) {
      return 0;
    }

    let count = tree.children.length;
    for (const child of tree.children) {
      count += this.countDescendants(child);
    }

    return count;
  }

  private hasSiblingWithChildren(root: any, targetId: number): boolean {
    function findSiblingWithChildren(node: any, level: number): boolean {
      if (node.id !== targetId && node.level === level) {
        return true;
      }

      if (node.children) {
        for (const child of node.children) {
          if (findSiblingWithChildren(child, level)) {
            return true;
          }
        }
      }

      return false;
    }

    let targetLevel: number | undefined = undefined;

    // Find the level of the target node
    function findTargetLevel(node: any, currentLevel: number): void {
      if (node.id === targetId) {
        targetLevel = currentLevel;
      }

      if (node.children) {
        for (const child of node.children) {
          findTargetLevel(child, currentLevel + 1);
        }
      }
    }

    findTargetLevel(root, 1);

    if (targetLevel === undefined) {
      return false; // The target node is not in the tree
    }

    return findSiblingWithChildren(root, targetLevel);
  }

  private findRelativeDepth(root: any, targetId: number, currentDepth: number = 0): number | undefined {
    if (root.id === targetId) {
      return currentDepth;
    }

    if (root.children) {
      for (const child of root.children) {
        const depth = this.findRelativeDepth(child, targetId, currentDepth + 1);
        if (depth !== undefined) {
          return depth;
        }
      }
    }

    return undefined;
  }

}
