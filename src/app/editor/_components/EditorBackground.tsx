'use client';

import { useRef, useEffect } from 'react';

interface EditorBackgroundProps {
  theme: 'light' | 'dark';
}

export const EditorBackground = ({ theme }: EditorBackgroundProps) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let renderer: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let scene: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let camera: any;
    let animationId: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let geometry: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let material: any;
    let handleVisibilityChange: () => void;
    let handleResize: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const particles: Array<{
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mesh: any;
      speed: number;
      yOffset: number;
    }> = [];

    const init = async () => {
      const THREE = await import('three');

      scene = new THREE.Scene();
      const bgColor = theme === 'dark' ? 0x0f172a : 0xf1f5f9;
      scene.background = new THREE.Color(bgColor);
      scene.fog = new THREE.FogExp2(bgColor, 0.002);

      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 20;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      if (mountRef.current) {
        mountRef.current.appendChild(renderer.domElement);
      }

      geometry = new THREE.CircleGeometry(0.5, 32);
      material = new THREE.MeshBasicMaterial({
        color: theme === 'dark' ? 0x6366f1 : 0x3b82f6,
        transparent: true,
        opacity: theme === 'dark' ? 0.15 : 0.2,
      });

      for (let i = 0; i < 30; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
          (Math.random() - 0.5) * 50,
          (Math.random() - 0.5) * 50,
          (Math.random() - 0.5) * 20
        );
        mesh.scale.setScalar(Math.random() * 2 + 0.5);
        scene.add(mesh);
        particles.push({
          mesh,
          speed: Math.random() * 0.01 + 0.005,
          yOffset: Math.random() * Math.PI * 2,
        });
      }

      const animate = () => {
        animationId = requestAnimationFrame(animate);
        const time = Date.now() * 0.001;
        particles.forEach((p) => {
          p.mesh.position.y += Math.sin(time + p.yOffset) * 0.02;
          p.mesh.rotation.z += 0.001;
        });
        renderer.render(scene, camera);
      };
      animate();

      handleVisibilityChange = () => {
        if (document.hidden) {
          cancelAnimationFrame(animationId);
        } else {
          animate();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener('resize', handleResize);
    };

    init();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationId);

      // Dispose Three.js resources
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (renderer) renderer.dispose();

      if (mountRef.current?.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild);
      }
    };
  }, [theme]);

  return (
    <div ref={mountRef} className="fixed inset-0 -z-10 pointer-events-none" />
  );
};
