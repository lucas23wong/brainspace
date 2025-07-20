'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import { 
  Pen, 
  Eraser, 
  Square, 
  Circle, 
  Type, 
  Image as ImageIcon,
  Undo,
  Redo,
  Save,
  Share,
  Settings,
  Sparkles
} from 'lucide-react';

interface WhiteboardCanvasProps {
  initialData?: any;
  onSave?: (data: any) => void;
  onShare?: () => void;
  isCollaborative?: boolean;
}

const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({
  initialData,
  onSave,
  onShare,
  isCollaborative = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser' | 'select' | 'shape' | 'text'>('pen');
  const [selectedShape, setSelectedShape] = useState<'rectangle' | 'circle' | 'line'>('rectangle');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth - 100,
      height: window.innerHeight - 200,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true,
    });

    fabricCanvasRef.current = canvas;

    // Set up event listeners
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);

    // Load initial data if provided
    if (initialData) {
      canvas.loadFromJSON(initialData, () => {
        canvas.renderAll();
      });
    }

    // Handle window resize
    const handleResize = () => {
      canvas.setDimensions({
        width: window.innerWidth - 100,
        height: window.innerHeight - 200,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, [initialData]);

  // Tool handlers
  const handleMouseDown = useCallback((e: any) => {
    if (currentTool === 'pen' && fabricCanvasRef.current) {
      setIsDrawing(true);
      const pointer = fabricCanvasRef.current.getPointer(e.e);
      fabricCanvasRef.current.isDrawingMode = true;
      if (fabricCanvasRef.current.freeDrawingBrush) {
        fabricCanvasRef.current.freeDrawingBrush.width = brushSize;
        fabricCanvasRef.current.freeDrawingBrush.color = color;
      }
    }
  }, [currentTool, brushSize, color]);

  const handleMouseMove = useCallback((e: any) => {
    if (currentTool === 'pen' && isDrawing) {
      // Drawing is handled automatically by Fabric.js
    }
  }, [currentTool, isDrawing]);

  const handleMouseUp = useCallback(() => {
    if (currentTool === 'pen') {
      setIsDrawing(false);
    }
  }, [currentTool]);

  // Tool selection handlers
  const selectTool = (tool: 'pen' | 'eraser' | 'select' | 'shape' | 'text') => {
    setCurrentTool(tool);
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.isDrawingMode = tool === 'pen';
      fabricCanvasRef.current.selection = tool === 'select';
    }
  };

  const addShape = () => {
    if (!fabricCanvasRef.current) return;

    let shape: fabric.Object;
    const left = 100;
    const top = 100;

    switch (selectedShape) {
      case 'rectangle':
        shape = new fabric.Rect({
          left,
          top,
          width: 100,
          height: 100,
          fill: color,
          stroke: color,
          strokeWidth: 2,
        });
        break;
      case 'circle':
        shape = new fabric.Circle({
          left,
          top,
          radius: 50,
          fill: color,
          stroke: color,
          strokeWidth: 2,
        });
        break;
      case 'line':
        shape = new fabric.Line([left, top, left + 100, top + 100], {
          stroke: color,
          strokeWidth: brushSize,
        });
        break;
      default:
        return;
    }

    fabricCanvasRef.current.add(shape);
    fabricCanvasRef.current.setActiveObject(shape);
    fabricCanvasRef.current.renderAll();
  };

  const addText = () => {
    if (!fabricCanvasRef.current) return;

    const text = new fabric.IText('Double click to edit', {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: color,
    });

    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    fabricCanvasRef.current.renderAll();
  };

  const clearCanvas = () => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.clear();
      fabricCanvasRef.current.backgroundColor = '#ffffff';
      fabricCanvasRef.current.renderAll();
    }
  };

  const undo = () => {
    // Implement undo functionality
    console.log('Undo');
  };

  const redo = () => {
    // Implement redo functionality
    console.log('Redo');
  };

  const saveCanvas = () => {
    if (fabricCanvasRef.current && onSave) {
      const data = fabricCanvasRef.current.toJSON();
      onSave(data);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Drawing Tools */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => selectTool('pen')}
              className={`p-2 rounded ${currentTool === 'pen' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              title="Pen"
            >
              <Pen size={20} />
            </button>
            <button
              onClick={() => selectTool('eraser')}
              className={`p-2 rounded ${currentTool === 'eraser' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              title="Eraser"
            >
              <Eraser size={20} />
            </button>
            <button
              onClick={() => selectTool('select')}
              className={`p-2 rounded ${currentTool === 'select' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              title="Select"
            >
              <Square size={20} />
            </button>
          </div>

          {/* Shapes */}
          <div className="flex items-center space-x-2">
            <select
              value={selectedShape}
              onChange={(e) => setSelectedShape(e.target.value as any)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="rectangle">Rectangle</option>
              <option value="circle">Circle</option>
              <option value="line">Line</option>
            </select>
            <button
              onClick={addShape}
              className="p-2 rounded hover:bg-gray-100"
              title="Add Shape"
            >
              <Square size={20} />
            </button>
            <button
              onClick={addText}
              className="p-2 rounded hover:bg-gray-100"
              title="Add Text"
            >
              <Type size={20} />
            </button>
          </div>

          {/* Color Picker */}
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded border border-gray-300"
            />
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-20"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={undo}
            className="p-2 rounded hover:bg-gray-100"
            title="Undo"
          >
            <Undo size={20} />
          </button>
          <button
            onClick={redo}
            className="p-2 rounded hover:bg-gray-100"
            title="Redo"
          >
            <Redo size={20} />
          </button>
          <button
            onClick={saveCanvas}
            className="p-2 rounded hover:bg-gray-100"
            title="Save"
          >
            <Save size={20} />
          </button>
          <button
            onClick={onShare}
            className="p-2 rounded hover:bg-gray-100"
            title="Share"
          >
            <Share size={20} />
          </button>
          <button
            className="p-2 rounded hover:bg-gray-100"
            title="AI Assistant"
          >
            <Sparkles size={20} />
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="flex-1 bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-white border-t border-gray-200 p-2 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <span>Tool: {currentTool}</span>
          <span>Color: {color}</span>
          <span>Size: {brushSize}px</span>
          {isCollaborative && <span className="text-green-600">● Live Collaboration</span>}
        </div>
      </div>
    </div>
  );
};

export default WhiteboardCanvas; 