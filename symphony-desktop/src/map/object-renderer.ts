import * as Cesium from "cesium";

class ObjectRenderer {
  viewer: Cesium.Viewer;
  imageCache: Map<string, string>;
  billboardCollection: Cesium.BillboardCollection;
  objects: Map<string, string>;

  constructor(viewer: Cesium.Viewer) {
    this.viewer = viewer;
    this.imageCache = new Map();
    this.billboardCollection = new Cesium.BillboardCollection();
    this.objects = new Map();

    // Enable rendering on map
    this.viewer.scene.primitives.add(this.billboardCollection);

    // Enable frustum culling optimization
    this.billboardCollection.show = true;
  }
}
