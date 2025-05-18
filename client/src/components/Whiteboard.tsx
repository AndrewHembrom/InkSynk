// client/src/components/Whiteboard.tsx

import React, { useEffect, useRef } from "react";
import { Canvas, Path } from "fabric";
import socket from "../socket"; // adjust the path as needed

const Whiteboard: React.FC = () => {
  const canvasRef = useRef<Canvas | null>(null);

  useEffect(() => {
    const canvas = new Canvas("whiteboard", {
      isDrawingMode: true,
      backgroundColor: "#ffffff",
    });
    canvas.height = window.innerHeight - 100;
    canvas.width = window.innerWidth - 50;

    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = 3;
      canvas.freeDrawingBrush.color = "#000000";
    }

    canvasRef.current = canvas;

    // Emit drawing paths
    canvas.on("path:created", (e) => {
      const path = e.path;
      socket.emit("draw", path);
    });

    // Listen to drawing paths from others
    socket.on("draw", (pathData) => {
      const path = new Path(pathData.path, {
        ...pathData,
        selectable: false,
      });
      canvas.add(path);
    });

    return () => {
      socket.off("draw");
      canvas.dispose();
    };
  }, []);

  return (
    <div className="p-4">
      <canvas id="whiteboard" className="border border-gray-400 shadow-lg" />
    </div>
  );
};

export default Whiteboard;
