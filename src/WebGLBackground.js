import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const WebGLBackground = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current || sceneRef.current) return;
    
    console.log('Initializing WebGL...');
    
    // Store mount reference
    const currentMount = mountRef.current;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    // Configure renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff, 1); // WHITE background
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100vw';
    renderer.domElement.style.height = '100vh';
    renderer.domElement.style.zIndex = '1';
    currentMount.appendChild(renderer.domElement);
    
    console.log('Canvas added to DOM:', currentMount.contains(renderer.domElement));
    console.log('Canvas element:', renderer.domElement);
    console.log('Canvas size:', window.innerWidth, 'x', window.innerHeight);
    
    // Store scene reference to prevent double initialization
    sceneRef.current = scene;
    
    // Create a HUGE test cube to make sure rendering works
    const testGeometry = new THREE.BoxGeometry(10, 10, 10);
    const testMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xFFFFFE,
      shininess: 30,
      specular: 0xFFFFFD
    });
    const testCube = new THREE.Mesh(testGeometry, testMaterial);
    testCube.position.set(0, 0, 0);
    scene.add(testCube);
    
              // Create floating spheres (data nodes) - BIGGER and CLOSER
     const spheres = [];
     for (let i = 0; i < 10; i++) {
       const geometry = new THREE.SphereGeometry(3, 32, 32); // Higher resolution for smoothness
       const material = new THREE.MeshPhongMaterial({
         color: 0xFFFFFE,
         shininess: 20,
         specular: 0xFFFFFE
       });
       
       const sphere = new THREE.Mesh(geometry, material);
       sphere.position.set(
         (Math.random() - 0.5) * 30,
         (Math.random() - 0.5) * 20,
         (Math.random() - 0.5) * 15
       );
      
             sphere.userData = {
         originalX: sphere.position.x,
         originalY: sphere.position.y,
         originalZ: sphere.position.z,
         speed: 0.5 + Math.random() * 1.0,
         phase: Math.random() * Math.PI * 2
       };
      
      spheres.push(sphere);
      scene.add(sphere);
    }
    
         // Create solid geometric shapes (not wireframe for better 3D effect)
     const shapes = [];
     const geometries = [
       new THREE.OctahedronGeometry(1.5, 1), // Higher detail
       new THREE.TetrahedronGeometry(2, 1),
       new THREE.IcosahedronGeometry(1.2, 1)
     ];
     
     for (let i = 0; i < 15; i++) {
       const geometry = geometries[Math.floor(Math.random() * geometries.length)];
       const material = new THREE.MeshPhongMaterial({
         color: 0xFFFFFE,
         shininess: 40,
         specular: 0xFFFFFE,
         wireframe: false // Solid shapes for better 3D appearance
       });
      
      const shape = new THREE.Mesh(geometry, material);
      shape.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25
      );
      
             shape.userData = {
         originalX: shape.position.x,
         originalY: shape.position.y,
         originalZ: shape.position.z,
         rotationSpeed: new THREE.Vector3(
           (Math.random() - 0.5) * 0.02,
           (Math.random() - 0.5) * 0.02,
           (Math.random() - 0.5) * 0.02
         )
       };
      
      shapes.push(shape);
      scene.add(shape);
    }
    
         // Position camera MUCH closer
     camera.position.set(0, 0, 30);
     camera.lookAt(0, 0, 0);
    
         // Animation
     let animationId;
     let time = 0;
     
     const animate = () => {
       animationId = requestAnimationFrame(animate);
       time += 0.005; // Much slower time progression
       
       const mouse = mouseRef.current;
       
       // Slowly rotate test cube with mouse influence
       testCube.rotation.x += 0.003 + mouse.y * 0.001;
       testCube.rotation.y += 0.003 + mouse.x * 0.001;
       
       // Mouse influence on cube position
       testCube.position.x = mouse.x * 2;
       testCube.position.y = mouse.y * 2;
       
       // Animate spheres with mouse interaction
       spheres.forEach((sphere, index) => {
         const userData = sphere.userData;
         
         // Slow floating motion
         sphere.position.y = userData.originalY + Math.sin(time * userData.speed * 0.3 + userData.phase) * 2;
         
         // Mouse influence on position
         sphere.position.x = userData.originalX + mouse.x * (3 + index * 0.5);
         sphere.position.z = userData.originalZ + mouse.y * (2 + index * 0.3);
         
         // Slow rotation with mouse influence
         sphere.rotation.x += 0.002 + mouse.y * 0.001;
         sphere.rotation.y += 0.003 + mouse.x * 0.001;
       });
       
       // Animate shapes with mouse interaction
       shapes.forEach((shape, index) => {
         const userData = shape.userData;
         
         // Much slower rotation
         shape.rotation.x += userData.rotationSpeed.x * 0.3 + mouse.y * 0.001;
         shape.rotation.y += userData.rotationSpeed.y * 0.3 + mouse.x * 0.001;
         shape.rotation.z += userData.rotationSpeed.z * 0.3;
         
         // Mouse influence on position
         shape.position.x = userData.originalX + mouse.x * (4 + index * 0.2);
         shape.position.y = userData.originalY + mouse.y * (3 + index * 0.2);
       });
       
       // Gentle camera movement with mouse influence
       camera.position.x = Math.sin(time * 0.05) * 8 + mouse.x * 3;
       camera.position.y = Math.cos(time * 0.05) * 4 + mouse.y * 2;
       camera.lookAt(mouse.x * 2, mouse.y * 2, 0);
      
             renderer.render(scene, camera);
       
       // Debug log every 60 frames
       if (Math.floor(time * 100) % 60 === 0) {
         console.log('WebGL rendering... cube rotation:', testCube.rotation.x.toFixed(2));
       }
     };
    
         // Handle mouse movement
     const handleMouseMove = (event) => {
       // Normalize mouse position to -1 to 1 range
       mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
       mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
     };

     // Handle resize
     const handleResize = () => {
       const width = window.innerWidth;
       const height = window.innerHeight;
       
       camera.aspect = width / height;
       camera.updateProjectionMatrix();
       renderer.setSize(width, height);
     };
     
     window.addEventListener('mousemove', handleMouseMove);
     window.addEventListener('resize', handleResize);
    
         // Add proper lighting for 3D shading
     const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
     scene.add(ambientLight);

     const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
     directionalLight1.position.set(10, 10, 5);
     scene.add(directionalLight1);

     const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
     directionalLight2.position.set(-10, -10, -5);
     scene.add(directionalLight2);

     console.log('Starting WebGL animation...');
     animate();
    
         // Cleanup function
     return () => {
       console.log('Cleaning up WebGL...');
       sceneRef.current = null;
       window.removeEventListener('mousemove', handleMouseMove);
       window.removeEventListener('resize', handleResize);
       
       if (animationId) {
         cancelAnimationFrame(animationId);
       }
       
       // Clean up Three.js objects
       scene.traverse((object) => {
         if (object.geometry) {
           object.geometry.dispose();
         }
         if (object.material) {
           if (Array.isArray(object.material)) {
             object.material.forEach(material => material.dispose());
           } else {
             object.material.dispose();
           }
         }
       });
       
       renderer.dispose();
       
       // Remove canvas from DOM
       if (currentMount && currentMount.contains(renderer.domElement)) {
         currentMount.removeChild(renderer.domElement);
       }
     };
  }, []);

      return (
    <div 
      ref={mountRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        zIndex: 1,
        pointerEvents: 'none'
      }} 
    />
  );
};

export default WebGLBackground; 