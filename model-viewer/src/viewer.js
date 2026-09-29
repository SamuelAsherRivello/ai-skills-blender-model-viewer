import { Engine } from "@babylonjs/core/Engines/engine.js";
import { Scene } from "@babylonjs/core/scene.js";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera.js";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";
import { Color4 } from "@babylonjs/core/Maths/math.color.js";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight.js";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight.js";
import { LoadAssetContainerAsync } from "@babylonjs/core/Loading/sceneLoader.js";
import { CubeTexture } from "@babylonjs/core/Materials/Textures/cubeTexture.js";
import "@babylonjs/loaders/glTF";
import { selectionGate } from "./catalog.js";
export function createViewer(canvas, onState) {
  const engine = new Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
  });
  const scene = new Scene(engine);
  scene.useRightHandedSystem = true;
  scene.clearColor = new Color4(0.055, 0.068, 0.085, 1);
  scene.environmentTexture = CubeTexture.CreateFromPrefilteredData(
    "https://assets.babylonjs.com/environments/environmentSpecular.env",
    scene,
  );
  scene.environmentIntensity = 0.75;
  const camera = new ArcRotateCamera(
    "orbit",
    -Math.PI / 3,
    Math.PI / 2.7,
    10,
    Vector3.Zero(),
    scene,
  );
  camera.attachControl(canvas, true);
  camera.wheelDeltaPercentage = 0.01;
  camera.pinchDeltaPercentage = 0.01;
  const sky = new HemisphericLight("ambient", new Vector3(0, 1, 0), scene);
  sky.intensity = 0.85;
  const sun = new DirectionalLight("key", new Vector3(-1, -2, 1), scene);
  sun.intensity = 1.5;
  const gate = selectionGate();
  let container = null,
    disposed = false,
    paused = false,
    sourceView = null;
  function fit() {
    if (!container) return;
    const meshes = container.meshes.filter((m) => m.getTotalVertices() > 0);
    if (!meshes.length)
      throw new Error("This export contains no visible geometry.");
    let min = new Vector3(Infinity, Infinity, Infinity),
      max = new Vector3(-Infinity, -Infinity, -Infinity);
    for (const m of meshes) {
      m.computeWorldMatrix(true);
      const b = m.getBoundingInfo().boundingBox;
      min = Vector3.Minimize(min, b.minimumWorld);
      max = Vector3.Maximize(max, b.maximumWorld);
    }
    const radius = Math.max(max.subtract(min).length() / 2, 0.1);
    camera.target = min.add(max).scale(0.5);
    camera.fov = 0.8;
    const horizontal =
      2 * Math.atan(Math.tan(camera.fov / 2) * engine.getAspectRatio(camera));
    camera.radius =
      (radius / Math.sin(Math.min(camera.fov, horizontal) / 2)) * 1.15;
    camera.lowerRadiusLimit = radius * 0.03;
    camera.upperRadiusLimit = radius * 12;
    camera.minZ = Math.max(radius / 10000, 0.001);
    camera.maxZ = radius * 100;
    camera.panningSensibility = 1000 / Math.max(radius, 1);
    camera.alpha = -Math.PI / 3;
    camera.beta = Math.PI / 2.7;
    camera.fov = 0.8;
    if (sourceView) {
      const eye = Vector3.FromArray(sourceView.position),
        target = Vector3.FromArray(sourceView.target);
      camera.target = target;
      camera.setPosition(eye);
      const distance = Vector3.Distance(eye, target);
      camera.fov =
        2 *
        Math.atan(
          (sourceView.frameHeight *
            Math.max(1, sourceView.aspect / engine.getAspectRatio(camera))) /
            (2 * distance),
        );
      camera.lowerRadiusLimit = distance * 0.02;
      camera.upperRadiusLimit = Math.max(distance * 12, radius * 12);
    }
  }
  engine.runRenderLoop(() => scene.render());
  const observer = new ResizeObserver(() => {
    engine.resize();
    if (sourceView) {
      const distance = Vector3.Distance(
        Vector3.FromArray(sourceView.position),
        Vector3.FromArray(sourceView.target),
      );
      camera.fov =
        2 *
        Math.atan(
          (sourceView.frameHeight *
            Math.max(1, sourceView.aspect / engine.getAspectRatio(camera))) /
            (2 * distance),
        );
    }
  });
  observer.observe(canvas);
  return {
    async load(url, view) {
      const token = gate.next();
      container?.dispose();
      container = null;
      sourceView = view;
      onState({ status: "loading" });
      let incoming;
      try {
        incoming = await LoadAssetContainerAsync(url, scene, {
          pluginExtension: ".glb",
        });
        if (disposed || !gate.current(token)) {
          incoming.dispose();
          return;
        }
        container = incoming;
        container.addAllToScene();
        fit();
        for (const a of container.animationGroups) {
          a.start(true);
          if (paused) a.pause();
        }
        await scene.whenReadyAsync();
        if (disposed || !gate.current(token)) return;
        scene.render();
        const meshes = container.meshes.filter((m) => m.getTotalVertices() > 0);
        onState({
          status: "ready",
          stats: {
            meshes: meshes.length,
            triangles: meshes.reduce((s, m) => s + m.getTotalIndices() / 3, 0),
            materials: container.materials.length,
            animations: container.animationGroups.map((a) => a.name),
          },
        });
      } catch (e) {
        incoming?.dispose();
        if (!disposed && gate.current(token)) {
          container = null;
          onState({
            status: "error",
            error: e.message || "Model could not be loaded.",
          });
        }
      }
    },
    fit,
    setPaused(v) {
      paused = v;
      for (const a of container?.animationGroups || [])
        v ? a.pause() : a.play(true);
    },
    dispose() {
      disposed = true;
      gate.next();
      observer.disconnect();
      container?.dispose();
      scene.dispose();
      engine.dispose();
    },
  };
}
