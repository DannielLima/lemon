declare module 'three/examples/jsm/loaders/GLTFLoader' {
    import * as THREE from 'three';
  
    export class GLTFLoader {
      load(
        url: string,
        onLoad: (gltf: { scene: THREE.Group }) => void,
        onProgress?: (xhr: ProgressEvent) => void,
        onError?: (error: ErrorEvent) => void
      ): void;
    }
  }
  