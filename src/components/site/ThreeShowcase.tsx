"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ChevronDown, ChevronUp, Eye, Layers, RotateCw, Volume2, VolumeX } from "lucide-react";
import { projects, type Project } from "@/lib/content";
import { sound } from "@/lib/sound";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const _raycaster = new THREE.Raycaster();
const _mouse = new THREE.Vector2();

function paintedTexture(paint: (ctx: CanvasRenderingContext2D, size: number) => void, size = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  if (ctx) paint(ctx, size);
  texture.needsUpdate = true;
  return texture;
}

const orbit = [
  "shark-care",
  "tevo",
  "onyx",
  "protexa",
  "el-khateeb",
  "new-era",
  "glory",
  "aqar-expo",
]
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is Project => Boolean(project));

export function ThreeShowcase({ onSelectProject }: { onSelectProject: (project: Project) => void }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const reduceMotion = useReducedMotion();
  // Reduced motion disables auto-rotation, so reflect that in the control.
  const autoRotating = isAutoRotating && !reduceMotion;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState(false);

  const stateRef = useRef({
    camera: null as THREE.PerspectiveCamera | null,
    deckGroup: null as THREE.Group | null,
    cardMeshes: [] as { mesh: THREE.Mesh; project: Project }[],
    isMouseDown: false,
    prevMouseX: 0,
    prevMouseY: 0,
    targetRotY: 0,
    currentRotY: 0,
    targetRotX: 0,
    currentRotX: 0,
    autoRotate: true,
  });

  function toggleSound() {
    sound.enabled = !sound.enabled;
    setSoundOn(sound.enabled);
    if (sound.enabled) sound.playClick();
  }

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    if (reduceMotion) {
      stateRef.current.autoRotate = false;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070308, 0.018);
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 2.4, 12);
    camera.lookAt(0, 0.85, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.replaceChildren(renderer.domElement);

    scene.add(new THREE.DirectionalLight(0xffeedd, 2.4).translateX(6).translateY(12).translateZ(8));
    scene.add(new THREE.HemisphereLight(0x3a1820, 0x070709, 0.7));
    const redSpot = new THREE.PointLight(0xe50914, 4.2, 25);
    redSpot.position.set(-6, 3, 2);
    scene.add(redSpot);
    const redSpot2 = new THREE.PointLight(0xff1f1f, 3.2, 25);
    redSpot2.position.set(6, -2, -3);
    scene.add(redSpot2);

    const backdrop = new THREE.Mesh(
      new THREE.SphereGeometry(36, 48, 32),
      new THREE.MeshBasicMaterial({
        side: THREE.BackSide,
        map: paintedTexture((ctx, size) => {
          const sky = ctx.createLinearGradient(0, 0, 0, size);
          sky.addColorStop(0, "#050308");
          sky.addColorStop(0.38, "#10060c");
          sky.addColorStop(0.5, "#6e1524");
          sky.addColorStop(0.56, "#2a0a12");
          sky.addColorStop(0.7, "#09070a");
          sky.addColorStop(1, "#050506");
          ctx.fillStyle = sky;
          ctx.fillRect(0, 0, size, size);
        }, 256),
      }),
    );
    backdrop.position.y = 1.2;
    scene.add(backdrop);
    const stage = new THREE.Mesh(
      new THREE.CircleGeometry(18, 72),
      new THREE.MeshBasicMaterial({
        transparent: true,
        depthWrite: false,
        map: paintedTexture((ctx, size) => {
          const pool = ctx.createRadialGradient(size / 2, size / 2, size * 0.08, size / 2, size / 2, size * 0.5);
          pool.addColorStop(0, "rgba(92, 16, 28, 0.55)");
          pool.addColorStop(0.42, "rgba(28, 8, 12, 0.35)");
          pool.addColorStop(1, "rgba(5, 5, 8, 0)");
          ctx.fillStyle = pool;
          ctx.fillRect(0, 0, size, size);
        }),
      }),
    );
    stage.rotation.x = -Math.PI / 2;
    stage.position.y = -1.45;
    scene.add(stage);

    const particleCount = 420;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const red = new THREE.Color(0xe50914);
    const white = new THREE.Color(0xffffff);
    for (let i = 0; i < particleCount; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 36;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 36;
      const mixed = Math.random() > 0.45 ? red : white;
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const particles = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({ size: 0.07, vertexColors: true, transparent: true, opacity: 0.55 }),
    );
    scene.add(particles);

    const deckGroup = new THREE.Group();
    scene.add(deckGroup);
    const loader = new THREE.TextureLoader();
    const cardGeometry = new THREE.BoxGeometry(2.15, 3.05, 0.07);
    const sideMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.8, roughness: 0.25 });
    const cardMeshes: { mesh: THREE.Mesh; project: Project }[] = [];
    const radius = 6.1;

    orbit.forEach((project, index) => {
      const angle = (index / orbit.length) * Math.PI * 2;
      const texture = loader.load(project.images[0]);
      texture.colorSpace = THREE.SRGBColorSpace;
      const face = new THREE.MeshPhysicalMaterial({
        map: texture,
        metalness: 0.15,
        roughness: 0.35,
        clearcoat: 0.45,
      });
      const mesh = new THREE.Mesh(cardGeometry, [sideMat, sideMat, sideMat, sideMat, face, face]);
      mesh.position.set(Math.sin(angle) * radius, 1.7, Math.cos(angle) * radius);
      mesh.rotation.y = angle;
      const rim = new THREE.LineSegments(
        new THREE.EdgesGeometry(cardGeometry),
        new THREE.LineBasicMaterial({ color: 0xe50914, transparent: true, opacity: 0.8 }),
      );
      mesh.add(rim);
      deckGroup.add(mesh);
      cardMeshes.push({ mesh, project });
    });

    const state = stateRef.current;
    state.camera = camera;
    state.deckGroup = deckGroup;
    state.cardMeshes = cardMeshes;

    const resize = () => {
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    resize();

    const onPointerDown = (event: PointerEvent) => {
      state.isMouseDown = true;
      state.prevMouseX = event.clientX;
      state.prevMouseY = event.clientY;
    };
    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      _mouse.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
      if (state.isMouseDown) {
        state.targetRotY += (event.clientX - state.prevMouseX) * 0.007;
        state.targetRotX = Math.max(-0.4, Math.min(0.6, state.targetRotX + (event.clientY - state.prevMouseY) * 0.005));
        state.prevMouseX = event.clientX;
        state.prevMouseY = event.clientY;
      }
      _raycaster.setFromCamera(_mouse, camera);
      const hit = _raycaster.intersectObjects(state.cardMeshes.map((card) => card.mesh), false)[0];
      const match = hit ? state.cardMeshes.find((card) => card.mesh === hit.object) : undefined;
      setHoveredTitle(match?.project.title ?? null);
      container.style.cursor = match ? "pointer" : "grab";
    };
    const onPointerUp = () => {
      state.isMouseDown = false;
    };
    const onClick = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      _mouse.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
      _raycaster.setFromCamera(_mouse, camera);
      const hit = _raycaster.intersectObjects(state.cardMeshes.map((card) => card.mesh), false)[0];
      const match = hit ? state.cardMeshes.find((card) => card.mesh === hit.object) : undefined;
      if (match) {
        sound.playSuccess();
        onSelectProject(match.project);
      }
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    container.addEventListener("click", onClick);
    window.addEventListener("resize", resize);

    const timer = new THREE.Timer();
    let frame = 0;
    const animate = () => {
      timer.update();
      const delta = timer.getDelta();
      state.currentRotY = THREE.MathUtils.damp(state.currentRotY, state.targetRotY, 4.5, delta);
      state.currentRotX = THREE.MathUtils.damp(state.currentRotX, state.targetRotX, 4.5, delta);
      if (state.autoRotate && !state.isMouseDown) state.targetRotY += 0.22 * delta;
      deckGroup.rotation.y = state.currentRotY;
      deckGroup.rotation.x = state.currentRotX;
      particles.rotation.y += 0.03 * delta;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      timer.dispose();
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("click", onClick);
      window.removeEventListener("resize", resize);
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const materials = mesh.material;
        const list = Array.isArray(materials) ? materials : materials ? [materials] : [];
        list.forEach((material) => {
          const mapped = material as THREE.MeshStandardMaterial;
          mapped.map?.dispose();
          material.dispose();
        });
      });
      renderer.dispose();
    };
  }, [onSelectProject, reduceMotion]);

  return (
    <section
      id="showcase-3d"
      data-flow
      className="relative h-[620px] w-full overflow-hidden border-y border-zinc-900/80 bg-[#070709] select-none md:h-[740px] lg:h-[820px]"
    >
      <div ref={mountRef} className="absolute inset-0 z-0 h-full w-full cursor-grab active:cursor-grabbing" />
      <div className="pointer-events-none absolute inset-x-4 top-4 z-10 flex items-start justify-between gap-3 sm:inset-x-6 sm:top-6">
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-red-500/30 bg-black/70 px-3 py-1.5 backdrop-blur-md">
            <span className="h-2.5 w-2.5 rounded-full bg-red-600 shadow-[0_0_8px_#e50914]" />
            <span className="text-[11px] font-bold tracking-wider text-white sm:text-xs">B2B. 3D SPATIAL SHOWROOM</span>
          </div>
          {hoveredTitle ? (
            <div className="hidden items-center gap-2 rounded-full border border-red-500/50 bg-red-950/80 px-3 py-1.5 text-xs text-red-200 sm:flex">
              <Eye className="h-3.5 w-3.5" />
              Inspect: {hoveredTitle}
            </div>
          ) : null}
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            aria-label={soundOn ? "Mute sound" : "Enable sound"}
            onClick={toggleSound}
            className="rounded-full border border-zinc-800 bg-black/70 p-2 text-zinc-300 hover:text-white"
          >
            {soundOn ? <Volume2 className="h-4 w-4 text-red-500" /> : <VolumeX className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              stateRef.current.autoRotate = !stateRef.current.autoRotate;
              setIsAutoRotating(stateRef.current.autoRotate);
              sound.playClick();
            }}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
              autoRotating ? "border-red-500/60 bg-red-600/20 text-red-300" : "border-zinc-800 bg-black/70 text-zinc-400"
            }`}
          >
            <RotateCw className={`h-3.5 w-3.5 ${autoRotating ? "animate-spin" : ""}`} style={{ animationDuration: "6s" }} />
            <span className="hidden md:inline">Auto rotate</span>
          </button>
        </div>
      </div>
      <p className="pointer-events-none absolute top-16 left-1/2 z-10 hidden -translate-x-1/2 text-center text-[11px] tracking-widest text-zinc-400 uppercase sm:block">
        Drag to orbit · click a card to open the case
      </p>
      <div
        className={`absolute bottom-4 left-1/2 z-20 w-[94%] max-w-4xl -translate-x-1/2 transition-transform duration-300 sm:bottom-6 ${
          isCollapsed ? "translate-y-[calc(100%-40px)]" : "translate-y-0"
        }`}
      >
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => {
              setIsCollapsed((value) => !value);
              sound.playClick();
            }}
            className="flex items-center gap-1.5 rounded-t-xl border border-b-0 border-zinc-800 bg-zinc-900 px-4 py-1.5 text-xs font-medium text-zinc-300"
          >
            {isCollapsed ? <ChevronUp className="h-3.5 w-3.5 text-red-500" /> : <ChevronDown className="h-3.5 w-3.5 text-red-500" />}
            {isCollapsed ? "Show 3D controls" : "Cinema mode"}
          </button>
        </div>
        <div className="rounded-2xl border border-zinc-800/90 bg-black/85 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md md:p-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="flex items-center gap-1.5 px-2 text-xs font-semibold text-white">
              <Layers className="h-3.5 w-3.5 text-red-500" />
              Project deck
            </span>
            <span className="text-xs text-zinc-500">View</span>
            <button
              type="button"
              onClick={() => {
                stateRef.current.targetRotX = 0;
                stateRef.current.targetRotY = 0;
                sound.playClick();
              }}
              className="rounded bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300"
            >
              Front
            </button>
            <button
              type="button"
              onClick={() => {
                stateRef.current.targetRotX = 0.45;
                stateRef.current.targetRotY = 1.2;
                sound.playClick();
              }}
              className="rounded bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300"
            >
              Cinematic
            </button>
            <button
              type="button"
              onClick={() => {
                stateRef.current.targetRotX = 0.55;
                stateRef.current.targetRotY = 2.4;
                sound.playClick();
              }}
              className="rounded bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300"
            >
              Top orbit
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
