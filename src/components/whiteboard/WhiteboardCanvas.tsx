'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import {
  Pen,
  Eraser,
  Type,
  StickyNote,
  Square,
  Circle,
  Undo,
  Redo,
  Download,
  LogOut,
  MousePointer
} from 'lucide-react';
import { WhiteboardTemplate, WhiteboardElement } from '@/lib/ai-service';

interface WhiteboardCanvasProps {
  initialData?: any;
  onSave?: (data: any) => void;
  onShare?: () => void;
  isCollaborative?: boolean;
  template?: WhiteboardTemplate;
  onEndSession?: () => void;
}

const PEN_TYPES = [
  { label: 'Solid', value: 'solid' },
  { label: 'Dashed', value: 'dashed' },
  { label: 'Dotted', value: 'dotted' },
];

const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({
  initialData,
  onSave,
  onShare,
  isCollaborative = false,
  template,
  onEndSession
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser' | 'select' | 'text' | 'sticky' | 'shape'>('select');
  const [selectedShape, setSelectedShape] = useState<'rectangle' | 'circle'>('rectangle');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showShapePicker, setShowShapePicker] = useState(false);
  const [penType, setPenType] = useState<'solid' | 'dashed' | 'dotted'>('solid');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(20);
  const [showFontControls, setShowFontControls] = useState(false);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth - 100,
      height: window.innerHeight - 200,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true,
      enableRetinaScaling: true,
    });

    fabricCanvasRef.current = canvas;

    // Set up event listeners
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
  }, [initialData, template]);

  // Apply AI template
  const applyTemplate = (template: WhiteboardTemplate) => {
    if (!fabricCanvasRef.current) return;

    // Clear existing content
    fabricCanvasRef.current.clear();

    // Set background
    if (template.backgroundColor) {
      fabricCanvasRef.current.backgroundColor = template.backgroundColor;
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

      default:
        return;
    }

    fabricCanvasRef.current.add(fabricObject);
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

  // Tool selection handlers
  const selectTool = (tool: 'pen' | 'eraser' | 'select' | 'text' | 'sticky' | 'shape') => {
    setCurrentTool(tool);
    setShowFontControls(false);
    if (fabricCanvasRef.current) {
      if (tool === 'pen') {
        fabricCanvasRef.current.isDrawingMode = true;
        fabricCanvasRef.current.selection = false;
        // Create a new brush for drawing
        const brush = new fabric.PencilBrush(fabricCanvasRef.current);
        brush.width = brushSize;
        brush.color = color;
        if (penType === 'dashed') brush.strokeLineCap = 'round';
        if (penType === 'dotted') brush.strokeDashArray = [1, 10];
        fabricCanvasRef.current.freeDrawingBrush = brush;
      } else if (tool === 'eraser') {
        fabricCanvasRef.current.isDrawingMode = true;
        fabricCanvasRef.current.selection = false;
        // Use a white pencil brush as eraser (circular effect)
        const brush = new fabric.PencilBrush(fabricCanvasRef.current);
        brush.width = brushSize * 2;
        brush.color = 'rgba(255,255,255,1)';
        fabricCanvasRef.current.freeDrawingBrush = brush;
      } else {
        fabricCanvasRef.current.isDrawingMode = false;
        fabricCanvasRef.current.selection = true;
      }
    }
  };

  // Update brush when color, size, or penType changes
  useEffect(() => {
    if (fabricCanvasRef.current && fabricCanvasRef.current.freeDrawingBrush) {
      if (currentTool === 'pen') {
        fabricCanvasRef.current.freeDrawingBrush.width = brushSize;
        fabricCanvasRef.current.freeDrawingBrush.color = color;
        if (penType === 'dashed') fabricCanvasRef.current.freeDrawingBrush.strokeDashArray = [10, 10];
        else if (penType === 'dotted') fabricCanvasRef.current.freeDrawingBrush.strokeDashArray = [1, 10];
        else fabricCanvasRef.current.freeDrawingBrush.strokeDashArray = null;
      } else if (currentTool === 'eraser') {
        fabricCanvasRef.current.freeDrawingBrush.width = brushSize * 2;
        fabricCanvasRef.current.freeDrawingBrush.color = 'rgba(255,255,255,1)';
      }
    }
  }, [currentTool, brushSize, color, penType]);

  // Add text
  const addText = () => {
    if (!fabricCanvasRef.current) return;
    const text = new fabric.IText('Type here', {
      left: 100,
      top: 100,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fill: color,
    });
    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    fabricCanvasRef.current.renderAll();
    setShowFontControls(true);
  };

  // Add sticky note (editable)
  const addStickyNote = () => {
    if (!fabricCanvasRef.current) return;
    const sticky = new fabric.IText('Sticky note', {
      left: 100,
      top: 100,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fill: '#b45309',
      backgroundColor: '#fef3c7',
      editable: true,
    });
    fabricCanvasRef.current.add(sticky);
    fabricCanvasRef.current.setActiveObject(sticky);
    fabricCanvasRef.current.renderAll();
    setShowFontControls(true);
  };

  // Font controls for selected text/sticky
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    const onSelection = () => {
      const obj = fabricCanvasRef.current?.getActiveObject();
      if (obj && (obj.type === 'i-text' || obj.type === 'textbox')) {
        setShowFontControls(true);
        // Type guard for fontFamily/fontSize
        const fontObj = obj as fabric.IText | fabric.Textbox;
        setFontFamily(fontObj.fontFamily || 'Arial');
        setFontSize(fontObj.fontSize || 20);
      } else {
        setShowFontControls(false);
      }
    };
    fabricCanvasRef.current.on('selection:created', onSelection);
    fabricCanvasRef.current.on('selection:updated', onSelection);
    fabricCanvasRef.current.on('selection:cleared', () => setShowFontControls(false));
    return () => {
      fabricCanvasRef.current?.off('selection:created', onSelection);
      fabricCanvasRef.current?.off('selection:updated', onSelection);
      fabricCanvasRef.current?.off('selection:cleared');
    };
  }, []);

  const updateFont = (property: 'fontFamily' | 'fontSize', value: string | number) => {
    if (!fabricCanvasRef.current) return;
    const obj = fabricCanvasRef.current.getActiveObject();
    if (obj && (obj.type === 'i-text' || obj.type === 'textbox')) {
      const fontObj = obj as fabric.IText | fabric.Textbox;
      if (property === 'fontFamily') fontObj.set('fontFamily', value);
      if (property === 'fontSize') fontObj.set('fontSize', value);
      fabricCanvasRef.current.renderAll();
    }
  };

  // Add shape
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
          fill: 'transparent',
          stroke: color,
          strokeWidth: 2,
        });
        break;
      case 'circle':
        shape = new fabric.Circle({
          left,
          top,
          radius: 50,
          fill: 'transparent',
          stroke: color,
          strokeWidth: 2,
        });
        break;
      default:
        return;
    }

    fabricCanvasRef.current.add(shape);
    fabricCanvasRef.current.setActiveObject(shape);
    fabricCanvasRef.current.renderAll();
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

  const endSession = () => {
    if (onEndSession) {
      onEndSession();
    } else {
      // Default behavior - go back to dashboard
      window.location.href = '/dashboard';
    }
  };

  // AI prompt submit handler
  const handleAISubmit = async () => {
    if (!aiPrompt) return;
    setAiLoading(true);
    setAiResponse(null);
    try {
      const res = await fetch('/api/ai/whiteboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await res.json();
      if (data.result) {
        // Try to parse as JSON and add to canvas if valid
        let parsed = null;
        try {
          parsed = JSON.parse(data.result);
        } catch (e) { }
        if (parsed && typeof parsed === 'object' && parsed.type) {
          addElementToCanvas(parsed);
          setAiResponse('Element added to whiteboard!');
        } else {
          setAiResponse(data.result);
        }
      } else setAiResponse(data.error || 'No response from AI.');
    } catch (err: any) {
      setAiResponse('Error contacting AI.');
    } finally {
      setAiLoading(false);
      setAiPrompt('');
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
          </div>
          {/* Pen Type Selector */}
          {currentTool === 'pen' && (
            <select
              value={penType}
              onChange={e => setPenType(e.target.value as any)}
              className="border rounded px-2 py-1 text-sm"
              title="Pen Type"
            >
              {PEN_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          )}
          {/* Content Tools */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                selectTool('text');
                addText();
              }}
              className={`p-2 rounded ${currentTool === 'text' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              title="Add Text"
            >
              <Type size={20} />
            </button>
            <button
              onClick={() => {
                selectTool('sticky');
                addStickyNote();
              }}
              className={`p-2 rounded ${currentTool === 'sticky' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              title="Add Sticky Note"
            >
              <StickyNote size={20} />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowShapePicker(!showShapePicker)}
                className={`p-2 rounded ${currentTool === 'shape' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                title="Add Shape"
              >
                <Square size={20} />
              </button>
              {showShapePicker && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-20 min-w-[120px]">
                  <div className="flex flex-col gap-1">
                    {['rectangle', 'circle'].map((shape) => (
                      <button
                        key={shape}
                        onClick={() => {
                          setSelectedShape(shape as 'rectangle' | 'circle');
                          setShowShapePicker(false);
                          selectTool('shape');
                          addShape();
                        }}
                        className="p-2 hover:bg-gray-100 rounded text-sm text-left w-full"
                      >
                        {shape.charAt(0).toUpperCase() + shape.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Color and Size Controls */}
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded border border-gray-300"
              title="Color"
            />
            <input
              type="range"
              min="1"
              max="40"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-20"
              title="Brush Size"
            />
            <span className="text-sm text-gray-600 w-8">{brushSize}</span>
          </div>
          {/* Font Controls */}
          {showFontControls && (
            <div className="flex items-center space-x-2 ml-4">
              <select
                value={fontFamily}
                onChange={e => { setFontFamily(e.target.value); updateFont('fontFamily', e.target.value); }}
                className="border rounded px-2 py-1 text-sm"
                title="Font Family"
              >
                {['Arial', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia'].map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
              <input
                type="number"
                min="8"
                max="72"
                value={fontSize}
                onChange={e => { setFontSize(Number(e.target.value)); updateFont('fontSize', Number(e.target.value)); }}
                className="border rounded px-2 py-1 text-sm w-16"
                title="Font Size"
              />
            </div>
          )}
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
            onClick={downloadCanvas}
            className="p-2 rounded hover:bg-gray-100"
            title="Export"
          >
            <Download size={20} />
          </button>
          <button
            onClick={endSession}
            className="p-2 rounded hover:bg-gray-100 text-red-600"
            title="End Session"
          >
            <LogOut size={20} />
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
      {/* AI Prompt Box */}
      <div className="bg-white border-t border-gray-200 p-3 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={aiPrompt}
            onChange={e => setAiPrompt(e.target.value)}
            placeholder="Ask AI to add something to the whiteboard..."
            className="flex-1 border rounded px-3 py-2 text-sm"
            disabled={aiLoading}
            onKeyDown={e => { if (e.key === 'Enter') handleAISubmit(); }}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={handleAISubmit}
            disabled={aiLoading || !aiPrompt}
          >
            {aiLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
        {aiResponse && (
          <div className="bg-gray-50 border border-gray-200 rounded p-2 text-sm text-gray-800 whitespace-pre-line mt-1">
            {aiResponse}
          </div>
        )}
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