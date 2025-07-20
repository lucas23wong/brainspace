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
  Sparkles,
  StickyNote,
  Ruler,
  GitBranch,
  Palette,
  Layers,
  Download,
  Upload,
  Trash2,
  RotateCcw,
  RotateCw,
  Move,
  MousePointer
} from 'lucide-react';
import { WhiteboardTemplate, WhiteboardElement } from '@/lib/ai-service';
import AIPromptModal from '@/components/ai/AIPromptModal';

interface WhiteboardCanvasProps {
  initialData?: any;
  onSave?: (data: any) => void;
  onShare?: () => void;
  isCollaborative?: boolean;
  template?: WhiteboardTemplate;
}

const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({
  initialData,
  onSave,
  onShare,
  isCollaborative = false,
  template
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser' | 'select' | 'shape' | 'text' | 'sticky' | 'ruler' | 'move'>('select');
  const [selectedShape, setSelectedShape] = useState<'rectangle' | 'circle' | 'line' | 'triangle' | 'diamond'>('rectangle');
  const [color, setColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showShapePicker, setShowShapePicker] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth - 100,
      height: window.innerHeight - 200,
      backgroundColor: backgroundColor,
      selection: true,
      preserveObjectStacking: true,
      enableRetinaScaling: true,
    });

    fabricCanvasRef.current = canvas;

    // Set up event listeners
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:removed', handleObjectRemoved);

    // Load initial data if provided
    if (initialData) {
      canvas.loadFromJSON(initialData, () => {
        canvas.renderAll();
        saveToHistory();
      });
    }

    // Apply template if provided
    if (template) {
      applyTemplate(template);
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
  }, [initialData, template, backgroundColor]);

  // Apply AI template
  const applyTemplate = (template: WhiteboardTemplate) => {
    if (!fabricCanvasRef.current) return;

    // Clear existing content
    fabricCanvasRef.current.clear();

    // Set background
    if (template.backgroundColor) {
      fabricCanvasRef.current.backgroundColor = template.backgroundColor;
      setBackgroundColor(template.backgroundColor);
    }

    // Add grid if specified
    if (template.grid) {
      addGrid();
    }

    // Add template elements
    template.elements.forEach((element) => {
      addElementToCanvas(element);
    });

    fabricCanvasRef.current.renderAll();
    saveToHistory();
  };

  // Add element to canvas
  const addElementToCanvas = (element: WhiteboardElement) => {
    if (!fabricCanvasRef.current) return;

    let fabricObject: fabric.Object;

    switch (element.type) {
      case 'text':
        fabricObject = new fabric.IText(element.content || 'Text', {
          left: element.position.x,
          top: element.position.y,
          fontSize: element.style?.fontSize || 20,
          fontFamily: element.style?.fontFamily || 'Arial',
          fill: element.style?.fill || '#000000',
          backgroundColor: element.style?.backgroundColor,
          borderColor: element.style?.borderColor,
          borderRadius: element.style?.borderRadius,
        });
        break;

      case 'shape':
        if (element.size) {
          fabricObject = new fabric.Rect({
            left: element.position.x,
            top: element.position.y,
            width: element.size.width,
            height: element.size.height,
            fill: element.style?.fill || '#ffffff',
            stroke: element.style?.stroke || '#000000',
            strokeWidth: element.style?.strokeWidth || 2,
            rx: element.style?.borderRadius,
            ry: element.style?.borderRadius,
          });
        } else {
          fabricObject = new fabric.Circle({
            left: element.position.x,
            top: element.position.y,
            radius: 50,
            fill: element.style?.fill || '#ffffff',
            stroke: element.style?.stroke || '#000000',
            strokeWidth: element.style?.strokeWidth || 2,
          });
        }
        break;

      case 'line':
        fabricObject = new fabric.Line([
          element.position.x,
          element.position.y,
          element.position.x + (element.size?.width || 100),
          element.position.y + (element.size?.height || 0)
        ], {
          stroke: element.style?.stroke || '#000000',
          strokeWidth: element.style?.strokeWidth || 2,
        });
        break;

      case 'sticky':
        fabricObject = new fabric.Rect({
          left: element.position.x,
          top: element.position.y,
          width: element.size?.width || 150,
          height: element.size?.height || 100,
          fill: element.style?.backgroundColor || '#fef3c7',
          stroke: element.style?.borderColor || '#f59e0b',
          strokeWidth: element.style?.strokeWidth || 1,
          rx: element.style?.borderRadius || 8,
          ry: element.style?.borderRadius || 8,
        });
        break;

      default:
        return;
    }

    fabricCanvasRef.current.add(fabricObject);
  };

  // Add grid
  const addGrid = () => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    const gridSize = 20;

    for (let i = 0; i < width; i += gridSize) {
      const line = new fabric.Line([i, 0, i, height], {
        stroke: '#e5e7eb',
        strokeWidth: 1,
        selectable: false,
        evented: false,
      });
      canvas.add(line);
    }

    for (let i = 0; i < height; i += gridSize) {
      const line = new fabric.Line([0, i, width, i], {
        stroke: '#e5e7eb',
        strokeWidth: 1,
        selectable: false,
        evented: false,
      });
      canvas.add(line);
    }
  };

  // History management
  const saveToHistory = () => {
    if (!fabricCanvasRef.current) return;

    const json = fabricCanvasRef.current.toJSON();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(json);

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleObjectAdded = () => saveToHistory();
  const handleObjectModified = () => saveToHistory();
  const handleObjectRemoved = () => saveToHistory();

  // Tool handlers
  const handleMouseDown = useCallback((e: any) => {
    if (currentTool === 'pen' && fabricCanvasRef.current) {
      setIsDrawing(true);
      fabricCanvasRef.current.isDrawingMode = true;
      if (fabricCanvasRef.current.freeDrawingBrush) {
        fabricCanvasRef.current.freeDrawingBrush.width = brushSize;
        fabricCanvasRef.current.freeDrawingBrush.color = color;
      }
    } else if (currentTool === 'eraser' && fabricCanvasRef.current) {
      setIsDrawing(true);
      fabricCanvasRef.current.isDrawingMode = true;
      if (fabricCanvasRef.current.freeDrawingBrush) {
        fabricCanvasRef.current.freeDrawingBrush.width = 20;
        fabricCanvasRef.current.freeDrawingBrush.color = 'rgba(255,255,255,1)';
      }
    }
  }, [currentTool, brushSize, color]);

  const handleMouseMove = useCallback((e: any) => {
    // Drawing is handled automatically by Fabric.js
  }, []);

  const handleMouseUp = useCallback(() => {
    if (currentTool === 'pen' || currentTool === 'eraser') {
      setIsDrawing(false);
    }
  }, [currentTool]);

  // Tool selection handlers
  const selectTool = (tool: 'pen' | 'eraser' | 'select' | 'shape' | 'text' | 'sticky' | 'ruler' | 'move') => {
    setCurrentTool(tool);
    if (fabricCanvasRef.current) {
      if (tool === 'pen') {
        fabricCanvasRef.current.isDrawingMode = true;
        fabricCanvasRef.current.selection = false;
        if (fabricCanvasRef.current.freeDrawingBrush) {
          fabricCanvasRef.current.freeDrawingBrush.width = brushSize;
          fabricCanvasRef.current.freeDrawingBrush.color = color;
        }
      } else if (tool === 'eraser') {
        fabricCanvasRef.current.isDrawingMode = true;
        fabricCanvasRef.current.selection = false;
        if (fabricCanvasRef.current.freeDrawingBrush) {
          fabricCanvasRef.current.freeDrawingBrush.width = 20;
          fabricCanvasRef.current.freeDrawingBrush.color = 'rgba(255,255,255,1)';
        }
      } else if (tool === 'select') {
        fabricCanvasRef.current.isDrawingMode = false;
        fabricCanvasRef.current.selection = true;
      } else {
        fabricCanvasRef.current.isDrawingMode = false;
        fabricCanvasRef.current.selection = false;
      }
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
      case 'triangle':
        shape = new fabric.Triangle({
          left,
          top,
          width: 100,
          height: 100,
          fill: color,
          stroke: color,
          strokeWidth: 2,
        });
        break;
      case 'diamond':
        shape = new fabric.Polygon([
          { x: 0, y: 50 },
          { x: 50, y: 0 },
          { x: 100, y: 50 },
          { x: 50, y: 100 }
        ], {
          left,
          top,
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

  const addStickyNote = () => {
    if (!fabricCanvasRef.current) return;

    const sticky = new fabric.Rect({
      left: 100,
      top: 100,
      width: 150,
      height: 100,
      fill: '#fef3c7',
      stroke: '#f59e0b',
      strokeWidth: 1,
      rx: 8,
      ry: 8,
    });

    fabricCanvasRef.current.add(sticky);
    fabricCanvasRef.current.setActiveObject(sticky);
    fabricCanvasRef.current.renderAll();
  };

  const clearCanvas = () => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.clear();
      fabricCanvasRef.current.backgroundColor = backgroundColor;
      fabricCanvasRef.current.renderAll();
      saveToHistory();
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      fabricCanvasRef.current?.loadFromJSON(history[historyIndex - 1], () => {
        fabricCanvasRef.current?.renderAll();
      });
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      fabricCanvasRef.current?.loadFromJSON(history[historyIndex + 1], () => {
        fabricCanvasRef.current?.renderAll();
      });
    }
  };

  const saveCanvas = () => {
    if (fabricCanvasRef.current && onSave) {
      const data = fabricCanvasRef.current.toJSON();
      onSave(data);
    }
  };

  const handleAIGenerate = (template: WhiteboardTemplate) => {
    applyTemplate(template);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && fabricCanvasRef.current) {
      const reader = new FileReader();
      reader.onload = (e) => {
        fabric.Image.fromURL(e.target?.result as string, {
          crossOrigin: 'anonymous'
        }, (img: fabric.Image) => {
          img.scaleToWidth(200);
          fabricCanvasRef.current?.add(img);
          fabricCanvasRef.current?.renderAll();
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadCanvas = () => {
    if (!fabricCanvasRef.current) return;

    const dataURL = fabricCanvasRef.current.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1
    });

    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = dataURL;
    link.click();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Drawing Tools */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => selectTool('select')}
              className={`p-2 rounded ${currentTool === 'select' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              title="Select"
            >
              <MousePointer size={20} />
            </button>
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
              onClick={() => selectTool('move')}
              className={`p-2 rounded ${currentTool === 'move' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              title="Move"
            >
              <Move size={20} />
            </button>
          </div>

          {/* Shapes */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                onClick={() => setShowShapePicker(!showShapePicker)}
                className="p-2 rounded hover:bg-gray-100"
                title="Shapes"
              >
                <Square size={20} />
              </button>
              {showShapePicker && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
                  <div className="grid grid-cols-2 gap-1">
                    {['rectangle', 'circle', 'triangle', 'diamond', 'line'].map((shape) => (
                      <button
                        key={shape}
                        onClick={() => {
                          setSelectedShape(shape as any);
                          setShowShapePicker(false);
                          addShape();
                        }}
                        className="p-2 hover:bg-gray-100 rounded text-sm"
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={addText}
              className="p-2 rounded hover:bg-gray-100"
              title="Add Text"
            >
              <Type size={20} />
            </button>
            <button
              onClick={addStickyNote}
              className="p-2 rounded hover:bg-gray-100"
              title="Add Sticky Note"
            >
              <StickyNote size={20} />
            </button>
            <button
              className="p-2 rounded hover:bg-gray-100"
              title="Add Ruler"
            >
              <Ruler size={20} />
            </button>
          </div>

          {/* Color Picker */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-2 rounded hover:bg-gray-100"
                title="Color Palette"
              >
                <Palette size={20} />
              </button>
              {showColorPicker && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
                  <div className="grid grid-cols-6 gap-1">
                    {['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080', '#008000', '#ffc0cb', '#a52a2a'].map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          setColor(color);
                          setShowColorPicker(false);
                        }}
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
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

          {/* File Operations */}
          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="p-2 rounded hover:bg-gray-100 cursor-pointer"
              title="Upload Image"
            >
              <Upload size={20} />
            </label>
            <button
              onClick={downloadCanvas}
              className="p-2 rounded hover:bg-gray-100"
              title="Download"
            >
              <Download size={20} />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
            title="Undo"
          >
            <Undo size={20} />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
            title="Redo"
          >
            <Redo size={20} />
          </button>
          <button
            onClick={() => setShowAIModal(true)}
            className="p-2 rounded hover:bg-gray-100"
            title="AI Assistant"
          >
            <Sparkles size={20} />
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
            onClick={clearCanvas}
            className="p-2 rounded hover:bg-gray-100"
            title="Clear Canvas"
          >
            <Trash2 size={20} />
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

      {/* AI Modal */}
      <AIPromptModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerate={handleAIGenerate}
      />
    </div>
  );
};

export default WhiteboardCanvas; 