import { useState, useCallback } from "react";
import * as Cesium from "cesium";
import { ObjectWithUlid } from "@/lib/proto_api";

interface UseObjectSelectionOptions {
  viewer: Cesium.Viewer | null;
  onSelectionChange?: (objectId: string | null) => void;
}

export function useObjectSelection({
  viewer,
  onSelectionChange,
}: UseObjectSelectionOptions) {
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  const selectObject = useCallback(
    (objectId: string | null) => {
      setSelectedObjectId(objectId);
      onSelectionChange?.(objectId);
    },
    [onSelectionChange],
  );

  const flyToObject = useCallback(
    (object: ObjectWithUlid) => {
      if (!viewer) return;

      const position = Cesium.Cartesian3.fromDegrees(
        object.longitude,
        object.latitude,
        object.altitude * 0.3048,
      );

      viewer.camera.flyToBoundingSphere(
        new Cesium.BoundingSphere(position, 12_000),
        {
          duration: 1.1,
          offset: new Cesium.HeadingPitchRange(
            viewer.camera.heading,
            Cesium.Math.toRadians(-75),
            20_000,
          ),
        },
      );
    },
    [viewer],
  );

  const selectAndFlyTo = useCallback(
    (object: ObjectWithUlid) => {
      selectObject(object.ulidString);
      flyToObject(object);
    },
    [selectObject, flyToObject],
  );

  return {
    selectedObjectId,
    selectObject,
    flyToObject,
    selectAndFlyTo,
  };
}
