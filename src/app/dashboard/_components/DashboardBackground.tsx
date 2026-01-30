'use client';

import { useEffect, useRef } from 'react';
import type { ThreeBackgroundProps } from '@/types';
import type * as THREE from 'three';

export const DashboardBackground = ({ theme }: ThreeBackgroundProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const materialsRef = useRef<{
    primary?: THREE.MeshPhongMaterial;
    secondary?: THREE.MeshPhongMaterial;
  }>({});

  useEffect(() => {
    let animationId: number;
    let geometry: THREE.BoxGeometry;
    let renderer: THREE.WebGLRenderer;
    const particles: Array<{
      mesh: THREE.Mesh;
      speed: number;
      rotSpeed: number;
    }> = [];

    const init = async () => {
      const THREE = await import('three');
      if (!mountRef.current) return;

      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const bgHex = theme === 'dark' ? 0x0f172a : 0xf8fafc;
      scene.background = new THREE.Color(bgHex);
      scene.fog = new THREE.FogExp2(bgHex, 0.002);

      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mountRef.current.appendChild(renderer.domElement);

      // Materials
      materialsRef.current = {
        primary: new THREE.MeshPhongMaterial({
          color: theme === 'dark' ? 0x3b82f6 : 0x60a5fa,
          transparent: true,
          opacity: 0.6,
          flatShading: true,
        }),
        secondary: new THREE.MeshPhongMaterial({
          color: theme === 'dark' ? 0x6366f1 : 0xa5b4fc,
          wireframe: true,
          transparent: true,
          opacity: 0.3,
        }),
      };

      // Create abstract "Data Blocks"
      geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

      for (let i = 0; i < 30; i++) {
        const mat =
          Math.random() > 0.5
            ? materialsRef.current.primary!
            : materialsRef.current.secondary!;
        const mesh = new THREE.Mesh(geometry, mat);

        mesh.position.set(
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 60 - 10
        );
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

        const scale = Math.random() * 0.5 + 0.5;
        mesh.scale.set(scale, scale, scale);

        scene.add(mesh);
        particles.push({
          mesh,
          speed: Math.random() * 0.005 + 0.001,
          rotSpeed: (Math.random() - 0.5) * 0.01,
        });
      }

      // Lights
      const ambient = new THREE.AmbientLight(0x404040, 3);
      scene.add(ambient);
      const dirLight = new THREE.DirectionalLight(0xffffff, 1);
      dirLight.position.set(5, 10, 7);
      scene.add(dirLight);

      const animate = () => {
        animationId = requestAnimationFrame(animate);

        // Gentle rotation flow
        particles.forEach((p) => {
          p.mesh.rotation.x += p.rotSpeed;
          p.mesh.rotation.y += p.rotSpeed;
          p.mesh.position.y +=
            Math.sin(Date.now() * 0.001 + p.mesh.position.x) * 0.005;
        });

        // Slow camera drift
        camera.position.x = Math.sin(Date.now() * 0.0001) * 2;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };

      const handleVisibilityChange = () => {
        if (document.hidden) {
          cancelAnimationFrame(animationId);
        } else {
          animate();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      animate();

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        cancelAnimationFrame(animationId);
        geometry.dispose();
        if (materialsRef.current.primary) materialsRef.current.primary.dispose();
        if (materialsRef.current.secondary) materialsRef.current.secondary.dispose();
        renderer.dispose();
      };
    };

    let cleanup: (() => void) | undefined;
    init().then((cleanupFn) => {
      cleanup = cleanupFn;
    });

    return () => {
      cleanup?.();
      if (mountRef.current?.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild);
      }
    };
  }, []);

  // Theme Update
  useEffect(() => {
    if (!sceneRef.current) return;

    const updateTheme = async () => {
      const THREE = await import('three');
      if (!sceneRef.current) return;

      const bgHex = theme === 'dark' ? 0x0f172a : 0xf8fafc;
      sceneRef.current.background = new THREE.Color(bgHex);
      if (sceneRef.current.fog) {
        (sceneRef.current.fog as THREE.FogExp2).color = new THREE.Color(bgHex);
      }

      if (materialsRef.current.primary) {
        materialsRef.current.primary.color.setHex(
          theme === 'dark' ? 0x3b82f6 : 0x60a5fa
        );
      }
    };

    updateTheme();
  }, [theme]);

  return <div ref={mountRef} className="fixed inset-0 -z-10" />;
};
