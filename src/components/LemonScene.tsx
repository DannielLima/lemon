"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const LemonScene = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load(
      "/lemon_4k.gltf",
      (gltf) => {
        const model = gltf.scene;
        if (!model) {
          console.error("O modelo GLTF não foi carregado corretamente.");
          return;
        }

        console.log("Modelo carregado:", model);

        const textureLoader = new THREE.TextureLoader();
        const diffuseTexture = textureLoader.load("/textures/lemon_diff_4k.jpg");
        const normalTexture = textureLoader.load("/textures/lemon_nor_gl_4k.jpg");
        const armTexture = textureLoader.load("/textures/lemon_arm_4k.jpg");

        Promise.all([diffuseTexture, normalTexture, armTexture]).then(() => {
          model.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Mesh && child.material) {
              console.log("Aplicando texturas no modelo:", child);
              if (child.material instanceof THREE.MeshStandardMaterial) {
                // Verificar se o material está configurado corretamente
                // child.material.map = diffuseTexture; 
                // child.material.normalMap = normalTexture;
                // child.material.roughnessMap = armTexture;
                child.material.needsUpdate = true;

                if (child.material.map) {
                  child.material.map.wrapS = THREE.RepeatWrapping;
                  child.material.map.wrapT = THREE.RepeatWrapping;
                  child.material.map.repeat.set(1, 1);
                }
              }
            }
          });

          scene.add(model);
          model.scale.set(55, 55, 55);
          model.position.set(0, 0, 0);

          setModelLoaded(true);
        }).catch((error) => {
          console.error("Erro ao carregar as texturas:", error);
        });
      },
      (xhr) => {
        console.log(`Carregando modelo... ${(xhr.loaded / xhr.total) * 100}%`);
      },
      (error) => {
        console.error("Erro ao carregar o modelo GLTF:", error);
      }
    );

    camera.position.z = 10;

    const animate = () => {
      requestAnimationFrame(animate);

      if (modelLoaded) {
        scene.traverse((child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh) {
            child.rotation.y += 0.01;
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, [modelLoaded]);

  return <div><canvas ref={canvasRef} /></div>;
};

export default LemonScene;
