"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";

export default function SnowScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points;
    planeMesh: THREE.Mesh;
  }>();

  useEffect(() => {
    if (!containerRef.current) return;

    const noise = createNoise2D();
    const particleNum = 10000;
    const maxRange = 1000;
    const minRange = maxRange / 2;
    const textureSize = 64.0;

    const drawRadialGradation = (
      ctx: CanvasRenderingContext2D,
      canvasRadius: number,
      canvasW: number,
      canvasH: number
    ) => {
      ctx.save();
      const gradient = ctx.createRadialGradient(
        canvasRadius,
        canvasRadius,
        0,
        canvasRadius,
        canvasRadius,
        canvasRadius
      );
      gradient.addColorStop(0, "rgba(255,255,255,1.0)");
      gradient.addColorStop(0.5, "rgba(255,255,255,0.5)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasW, canvasH);
      ctx.restore();
    };

    const getTexture = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return new THREE.Texture();

      const diameter = textureSize;
      canvas.width = diameter;
      canvas.height = diameter;
      const canvasRadius = diameter / 2;

      // Clear the canvas first
      ctx.clearRect(0, 0, diameter, diameter);

      // Create a radial gradient with sharper falloff
      const gradient = ctx.createRadialGradient(
        canvasRadius,
        canvasRadius,
        0,
        canvasRadius,
        canvasRadius,
        canvasRadius
      );

      // Adjust gradient stops for better circle definition
      gradient.addColorStop(0, "rgba(255,255,255,1.0)");
      gradient.addColorStop(0.3, "rgba(255,255,255,0.8)");
      gradient.addColorStop(0.5, "rgba(255,255,255,0.3)");
      gradient.addColorStop(0.7, "rgba(255,255,255,0.1)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");

      ctx.fillStyle = gradient;

      // Draw a circle instead of a rectangle
      ctx.beginPath();
      ctx.arc(canvasRadius, canvasRadius, canvasRadius, 0, Math.PI * 2);
      ctx.fill();

      const texture = new THREE.Texture(canvas);
      texture.premultiplyAlpha = true;
      texture.needsUpdate = true;
      return texture;
    };

    const makeRoughGround = (mesh: THREE.Mesh) => {
      if (!mesh.geometry.isBufferGeometry) return;

      const positions = mesh.geometry.attributes.position;
      const time = Date.now();

      for (let i = 0; i < positions.count; i++) {
        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute(positions, i);

        const noise1 =
          noise(
            vertex.x * 0.01 + time * 0.0003,
            vertex.y * 0.01 + time * 0.0003
          ) * 5;

        const noise2 =
          noise(
            vertex.x * 0.02 + time * 0.00012,
            vertex.y * 0.02 + time * 0.00015
          ) * 4;

        const noise3 =
          noise(
            vertex.x * 0.009 + time * 0.00015,
            vertex.y * 0.012 + time * 0.00009
          ) * 4;

        vertex.z = noise1 + noise2 + noise3;
        positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }

      positions.needsUpdate = true;
      mesh.geometry.computeVertexNormals();
    };

    const init = () => {
      // Scene setup
      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x000036, 0, minRange * 2);

      // Get container dimensions
      const width = containerRef.current?.clientWidth || window.innerWidth;
      const height = containerRef.current?.clientHeight || window.innerHeight;

      // Camera setup
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
      camera.position.set(0, -100, 400);
      camera.lookAt(scene.position);

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(width, height);
      renderer.shadowMap.enabled = true;

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 2);
      scene.add(ambientLight);

      const spotLight = new THREE.SpotLight(0xffffff, 2);
      spotLight.distance = 2000;
      spotLight.position.set(-200, 700, 0);
      spotLight.castShadow = true;
      scene.add(spotLight);

      // Ground plane with snow-like material
      const planeGeometry = new THREE.PlaneGeometry(500, 500, 100, 100);
      const planeMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        shininess: 50,
        specular: 0x444444,
      });
      const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
      planeMesh.receiveShadow = true;
      planeMesh.rotation.x = -0.5 * Math.PI;
      planeMesh.position.set(0, -100, 0);
      scene.add(planeMesh);

      // Snow particles
      const pointGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleNum * 3);
      const velocities: THREE.Vector3[] = [];

      for (let i = 0; i < particleNum; i++) {
        const x = Math.floor(Math.random() * maxRange - minRange);
        const y = Math.floor(Math.random() * maxRange - minRange);
        const z = Math.floor(Math.random() * maxRange - minRange);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        velocities.push(
          new THREE.Vector3(
            Math.floor(Math.random() * 6 - 3) * 0.1,
            Math.floor(Math.random() * 10 + 3) * -0.05,
            Math.floor(Math.random() * 6 - 3) * 0.1
          )
        );
      }

      pointGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      const pointMaterial = new THREE.PointsMaterial({
        size: 8,
        color: 0xffffff,
        map: getTexture(),
        transparent: true,
        fog: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0.8,
        alphaTest: 0.1,
        sizeAttenuation: true,
      });

      const particles = new THREE.Points(pointGeometry, pointMaterial);
      (particles.geometry as any).velocities = velocities;
      scene.add(particles);

      // Store references for resize handling
      sceneRef.current = {
        scene,
        camera,
        renderer,
        particles,
        planeMesh,
      };

      // Add to container
      containerRef.current?.appendChild(renderer.domElement);
    };

    const render = (timeStamp: number) => {
      if (!sceneRef.current) return;
      const { scene, camera, renderer, particles, planeMesh } =
        sceneRef.current;

      makeRoughGround(planeMesh);

      const positions = particles.geometry.attributes.position;
      const velocities = (particles.geometry as any).velocities;

      for (let i = 0; i < particleNum; i++) {
        const velocity = velocities[i];

        const velX = Math.sin(timeStamp * 0.001 * velocity.x) * 0.1;
        const velZ = Math.cos(timeStamp * 0.0015 * velocity.z) * 0.1;

        positions.setXYZ(
          i,
          positions.getX(i) + velX,
          positions.getY(i) + velocity.y,
          positions.getZ(i) + velZ
        );

        if (positions.getY(i) < -minRange) {
          positions.setY(i, minRange);
        }
      }

      positions.needsUpdate = true;
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };

    const handleResize = () => {
      if (!containerRef.current || !sceneRef.current) return;

      const { camera, renderer } = sceneRef.current;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      // Update renderer
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance

      // Update camera
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    // Initialize scene
    init();

    // Start animation
    let animationFrameId = requestAnimationFrame(render);

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Add resize observer for container size changes
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);

      if (sceneRef.current) {
        const { renderer } = sceneRef.current;
        containerRef.current?.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full absolute top-0 left-0 -z-10"
    />
  );
}
