import { IObject } from './object.interface';

class ObjectManager {
  private _objects: IObject[];

  constructor() {
    this._objects = [];
  }

  public addObject(name: string, obj: IObject) {
    let newItem: IObject = {
      name: name,
      obj: obj,
    }
  }

  public remove(name: string) {
    var removeIndex = this._objects.map(function(item) { return item.name; }).indexOf(name);
    this._objects.splice(removeIndex, 1);
  }

  private add(object: IObject) {
    const index = this._objects.findIndex((i: IObject) => i.name === object.name);
    if (index === -1) {
      this._objects.push(object);
    } else {
      return index
    }
  }

}