import React, { useEffect } from 'react';
import * as dat from 'dat.gui';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "@/app/store/store";
import {updateRotation} from "@/app/store/simulationSlice"

interface CelestialBodyGUIProps {
  id: string;
}

const CelestialBodyGUI: React.FC<CelestialBodyGUIProps> = ({ id }) => {
  const dispatch = useDispatch<AppDispatch>();
  const celestialBody = useSelector((state: RootState) =>
      state.celestialBody.bodies.find(body => body.id === id)
  );

  useEffect(() => {
    if (!celestialBody) return;

    const gui = new dat.GUI();
    const rotationFolder = gui.addFolder(`Rotation - ${celestialBody.name}`);
    rotationFolder.add(celestialBody.rotation, 'x', 0, Math.PI * 2).onChange((value) => {
      dispatch(updateRotation({ id, axis: 'x', value }));
    });
    rotationFolder.add(celestialBody.rotation, 'y', 0, Math.PI * 2).onChange((value) => {
      dispatch(updateRotation({ id, axis: 'y', value }));
    });
    rotationFolder.add(celestialBody.rotation, 'z', 0, Math.PI * 2).onChange((value) => {
      dispatch(updateRotation({ id, axis: 'z', value }));
    });
    rotationFolder.open();

    return () => {
      gui.destroy();
    };
  }, [celestialBody, dispatch, id]);

  return null;
}

export default CelestialBodyGUI;