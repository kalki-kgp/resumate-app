'use client';

import { useEffect, useRef } from 'react';
import type { ThreeBackgroundProps } from '@/types';

// Declare THREE as a global for dynamic import
declare global {
  interface Window {
    THREE: typeof import('three');
  }
}

export const ThreeBackground = ({ theme }: ThreeBackgroundProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const sceneRef = useRef<import('three').Scene | null>(null);
  const materialsRef = useRef<{
    solid?: import('three').MeshPhongMaterial;
    wireframe?: import('three').MeshPhongMaterial;
    accent?: import('three').MeshPhongMaterial;
  }>({});

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.async = true;
    
    let camera: import('three').PerspectiveCamera;
    let renderer: import('three').WebGLRenderer;
    let floatingShapes: Array<{
      mesh: import('three').Mesh;
      speed: number;
      rotationSpeed: { x: number; y: number; z: number };
      initialZ: number;
      offset: number;
    }>;
    let animationId: number;

    const initThree = () => {
      const THREE = window.THREE;
      if (!THREE || !mountRef.current) return;

      const scene = new THREE.Scene();
      sceneRef.current = scene;
      
      const bgHex = theme === 'dark' ? 0x020617 : 0xf8fafc;
      scene.fog = new THREE.FogExp2(bgHex, 0.0015);
      scene.background = new THREE.Color(bgHex);

      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mountRef.current.appendChild(renderer.domElement);

      const geometries = [
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.OctahedronGeometry(0.5),
        new THREE.TetrahedronGeometry(0.6),
        new THREE.IcosahedronGeometry(0.5)
      ];

      materialsRef.current = {
        solid: new THREE.MeshPhongMaterial({ 
          color: theme === 'dark' ? 0x3b82f6 : 0x2563EB,
          transparent: true,
          opacity: 0.7,
          flatShading: true,
          shininess: 100
        }),
        wireframe: new THREE.MeshPhongMaterial({
          color: theme === 'dark' ? 0x94a3b8 : 0x93C5FD,
          wireframe: true,
          transparent: true,
          opacity: 0.6
        }),
        accent: new THREE.MeshPhongMaterial({
          color: theme === 'dark' ? 0x818cf8 : 0x6366F1,
          transparent: true,
          opacity: 0.5,
          flatShading: true
        })
      };

      floatingShapes = [];
      
      for (let i = 0; i < 180; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const materialType = Math.random() > 0.7 ? 'wireframe' : (Math.random() > 0.5 ? 'solid' : 'accent');
        const material = materialsRef.current[materialType];
        if (!material) continue;
        
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.x = (Math.random() - 0.5) * 50;
        mesh.position.y = (Math.random() - 0.5) * 50;
        mesh.position.z = (Math.random() - 0.5) * 120 - 60;
        
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;

        const scale = Math.random() * 0.6 + 0.15;
        mesh.scale.set(scale, scale, scale);

        scene.add(mesh);
        floatingShapes.push({
          mesh,
          speed: Math.random() * 0.015 + 0.005,
          rotationSpeed: {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.01
          },
          initialZ: mesh.position.z,
          offset: Math.random() * Math.PI * 2
        });
      }

      const ambientLight = new THREE.AmbientLight(0x404040, 2.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
      directionalLight.position.set(10, 10, 10);
      scene.add(directionalLight);
      
      const blueLight = new THREE.PointLight(0x2563EB, 3, 60);
      blueLight.position.set(-10, 0, 10);
      scene.add(blueLight);

      const purpleLight = new THREE.PointLight(0x6366F1, 2, 50);
      purpleLight.position.set(10, 10, 0);
      scene.add(purpleLight);

      const handleMouseMove = (event: MouseEvent) => {
        mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
      };
      window.addEventListener('mousemove', handleMouseMove);

      const animate = () => {
        animationId = requestAnimationFrame(animate);

        const scrollY = window.scrollY;
        const docHeight = Math.max(document.body.scrollHeight - window.innerHeight, 1);
        const scrollPercent = Math.min(scrollY / docHeight, 1);

        camera.position.z = 5 - (scrollPercent * 60);
        camera.rotation.z = scrollPercent * 0.3;
        camera.position.x += (mouseRef.current.x * 2 - camera.position.x) * 0.05;
        camera.position.y += (mouseRef.current.y * 2 - camera.position.y) * 0.05;

        const time = Date.now() * 0.0005;

        floatingShapes.forEach((item) => {
          item.mesh.position.y += Math.sin(time + item.offset) * 0.002;
          item.mesh.position.x += Math.cos(time + item.offset * 0.5) * 0.001;
          
          item.mesh.rotation.x += item.rotationSpeed.x;
          item.mesh.rotation.y += item.rotationSpeed.y;
          item.mesh.rotation.z += item.rotationSpeed.z;
          
          const dx = item.mesh.position.x - mouseRef.current.x * 10;
          const dy = item.mesh.position.y - mouseRef.current.y * 10;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 5) {
            item.mesh.position.x += dx * 0.01;
            item.mesh.position.y += dy * 0.01;
          }
        });

        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
      };
    };

    script.onload = initThree;
    document.body.appendChild(script);

    return () => {
      if(mountRef.current && mountRef.current.firstChild) {
         mountRef.current.removeChild(mountRef.current.firstChild);
      }
      cancelAnimationFrame(animationId);
      if(script.parentNode) script.parentNode.removeChild(script);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to theme changes separately
  useEffect(() => {
    const THREE = window.THREE;
    if (!THREE || !sceneRef.current) return;

    const bgHex = theme === 'dark' ? 0x020617 : 0xf8fafc;
    const solidColor = theme === 'dark' ? 0x3b82f6 : 0x2563EB;
    const wireframeColor = theme === 'dark' ? 0x94a3b8 : 0x93C5FD;
    const accentColor = theme === 'dark' ? 0x818cf8 : 0x6366F1;

    sceneRef.current.background = new THREE.Color(bgHex);
    if (sceneRef.current.fog) {
      (sceneRef.current.fog as import('three').FogExp2).color = new THREE.Color(bgHex);
    }

    if (materialsRef.current.solid) materialsRef.current.solid.color.setHex(solidColor);
    if (materialsRef.current.wireframe) materialsRef.current.wireframe.color.setHex(wireframeColor);
    if (materialsRef.current.accent) materialsRef.current.accent.color.setHex(accentColor);

  }, [theme]);

  return <div ref={mountRef} className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />;
};
