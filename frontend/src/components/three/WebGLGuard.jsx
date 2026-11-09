import React, { useEffect, useState } from "react";

const GL_ATTRS = {
  antialias: true,
  alpha: true,
  failIfMajorPerformanceCaveat: false,
  powerPreference: "default",
};

let cached = null;
export function supportsWebGL() {
  if (cached !== null) return cached;
  let canvas = document.createElement("canvas");
  try {
    const gl =
      canvas.getContext("webgl2", GL_ATTRS) ||
      canvas.getContext("webgl", GL_ATTRS) ||
      canvas.getContext("experimental-webgl", GL_ATTRS);
    cached = !!gl;
    if (gl && gl.getExtension) {
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
    }
  } catch (e) {
    cached = false;
  }
  canvas = null;
  return cached;
}

class CanvasErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.warn("NAMOA 3D canvas failed, using static fallback:", error && error.message);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export const StaticFallback = () => (
  <div
    data-testid="webgl-fallback"
    className="absolute inset-0 overflow-hidden pointer-events-none"
    style={{
      backgroundImage:
        "radial-gradient(circle at 1.5px 1.5px, rgba(11,39,66,0.14) 1.5px, transparent 0)",
      backgroundSize: "36px 36px",
    }}
  >
    <div className="absolute right-[8%] top-1/2 -translate-y-1/2 hidden md:block">
      <div className="relative w-[420px] h-[420px]">
        <div className="absolute inset-0 rounded-full border border-[#0B2742]/15" />
        <div className="absolute inset-[16%] rounded-full border border-[#C8A44D]/40" />
        <div className="absolute inset-[34%] rounded-full border border-[#0B2742]/10" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#C8A44D]" />
        <div className="absolute left-[12%] top-[28%] w-2.5 h-2.5 rounded-full bg-[#0B2742]" />
        <div className="absolute right-[16%] top-[18%] w-2 h-2 rounded-full bg-[#174E73]" />
        <div className="absolute right-[10%] bottom-[30%] w-2.5 h-2.5 rounded-full bg-[#0B2742]" />
        <div className="absolute left-[22%] bottom-[16%] w-2 h-2 rounded-full bg-[#C8A44D]" />
      </div>
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent" />
  </div>
);

const isWebGLError = (msg) =>
  typeof msg === "string" &&
  (msg.includes("Error creating WebGL context") || msg.includes("WebGL context"));

export function WebGLGuard({ children }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const onError = (e) => {
      const msg = (e && (e.message || (e.error && e.error.message))) || "";
      if (isWebGLError(msg)) {
        e.preventDefault();
        setFailed(true);
      }
    };
    const onRejection = (e) => {
      const msg = (e && e.reason && e.reason.message) || "";
      if (isWebGLError(msg)) {
        e.preventDefault();
        setFailed(true);
      }
    };
    window.addEventListener("error", onError, true);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError, true);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  if (failed || !supportsWebGL()) return <StaticFallback />;
  return <CanvasErrorBoundary fallback={<StaticFallback />}>{children}</CanvasErrorBoundary>;
}
