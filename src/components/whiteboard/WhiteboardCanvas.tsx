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
  MousePointer,
  PlusSquare
} from 'lucide-react';
import { WhiteboardTemplate, WhiteboardElement } from '@/lib/ai-service';
import { motion, AnimatePresence } from 'framer-motion';
import ReactDOM from 'react-dom';

// Fix 'any' types in props and state
interface WhiteboardCanvasProps {
  initialData?: object;
  onSave?: (data: object) => void;
  onShare?: () => void;
  isCollaborative?: boolean;
  template?: WhiteboardTemplate;
  onEndSession?: () => void;
  whiteboardTitle?: string;
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
  onEndSession,
  whiteboardTitle
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser' | 'select' | 'text' | 'sticky' | 'shape'>('select');
  const [selectedShape, setSelectedShape] = useState<'rectangle' | 'circle' | 'triangle' | 'line' | 'arrow' | 'star' | 'hexagon'>('rectangle');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  // Fix 'any' in useState
  const [history, setHistory] = useState<object[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showShapePicker, setShowShapePicker] = useState(false);
  const [penType, setPenType] = useState<'solid' | 'dashed' | 'dotted'>('solid');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(20);
  const [showFontControls, setShowFontControls] = useState(false);
  // Ruler state
  const [showRuler, setShowRuler] = useState(false);
  const [rulerPos, setRulerPos] = useState({ x: 200, y: 200 });
  const [rulerAngle, setRulerAngle] = useState(0);
  const [isDraggingRuler, setIsDraggingRuler] = useState(false);
  const [isRotatingRuler, setIsRotatingRuler] = useState(false);
  const [rulerSnap, setRulerSnap] = useState(false);

  // Vanishing guides state
  const [showGuides, setShowGuides] = useState(false);
  const [guidesFade, setGuidesFade] = useState(false);

  // --- Add more shapes to the picker ---
  const SHAPES = [
    { label: 'Rectangle', value: 'rectangle' },
    { label: 'Circle', value: 'circle' },
    { label: 'Triangle', value: 'triangle' },
    { label: 'Line', value: 'line' },
    { label: 'Arrow', value: 'arrow' },
    { label: 'Star', value: 'star' },
    { label: 'Hexagon', value: 'hexagon' },
  ];

  // --- Update toolbar pop-out state and logic for top-center floating toolbar ---
  const [toolbarOpen, setToolbarOpen] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  // Show toolbar if mouse is near top edge, hide otherwise (after first interaction)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!hasInteracted && e.clientY > 180) setHasInteracted(true);
      if (!hasInteracted || e.clientY < 100) setToolbarOpen(true);
      else if (hasInteracted && e.clientY > 180) setToolbarOpen(false);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hasInteracted]);

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

    // Debug log
    console.log('WhiteboardCanvas mount:', { initialData, template });

    // Helper to check if initialData is empty
    const isEmptyData =
      !initialData ||
      (typeof initialData === 'object' && Object.keys(initialData).length === 0);

    if (!isEmptyData) {
      canvas.loadFromJSON(initialData, () => {
        canvas.renderAll();
        saveToHistory();
      });
    } else if (template) {
      if (typeof template === 'string') {
        if (template === 'calendar') addCalendarTemplate();
        // Add more templates here as needed
      } else {
        applyTemplate(template);
      }
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

    let shape: fabric.Object | null = null;
    const left = 100;
    const top = 100;

    switch (selectedShape) {
      case 'rectangle':
        shape = new fabric.Rect({ left, top, width: 100, height: 100, fill: 'transparent', stroke: color, strokeWidth: 2 });
        break;
      case 'circle':
        shape = new fabric.Circle({ left, top, radius: 50, fill: 'transparent', stroke: color, strokeWidth: 2 });
        break;
      case 'triangle':
        shape = new fabric.Triangle({ left, top, width: 100, height: 100, fill: 'transparent', stroke: color, strokeWidth: 2 });
        break;
      case 'line':
        shape = new fabric.Line([left, top, left + 100, top], { stroke: color, strokeWidth: 2 });
        break;
      case 'arrow':
        shape = new fabric.Line([left, top, left + 100, top], { stroke: color, strokeWidth: 2 });
        // Add arrowhead using a triangle
        const arrowHead = new fabric.Triangle({ left: left + 90, top: top - 10, width: 20, height: 20, angle: 90, fill: color });
        const group = new fabric.Group([shape, arrowHead]);
        shape = group;
        break;
      case 'star': {
        // Draw a 5-pointed star using polygon
        const points = Array.from({ length: 10 }).map((_, i) => {
          const angle = (i * Math.PI) / 5;
          const radius = i % 2 === 0 ? 50 : 20;
          return {
            x: left + 50 + Math.cos(angle - Math.PI / 2) * radius,
            y: top + 50 + Math.sin(angle - Math.PI / 2) * radius,
          };
        });
        shape = new fabric.Polygon(points, { fill: 'transparent', stroke: color, strokeWidth: 2 });
        break;
      }
      case 'hexagon': {
        const points = Array.from({ length: 6 }).map((_, i) => {
          const angle = (i * Math.PI) / 3;
          return {
            x: left + 50 + Math.cos(angle) * 50,
            y: top + 50 + Math.sin(angle) * 50,
          };
        });
        shape = new fabric.Polygon(points, { fill: 'transparent', stroke: color, strokeWidth: 2 });
        break;
      }
      default:
        return;
    }
    if (shape) {
      fabricCanvasRef.current.add(shape);
      fabricCanvasRef.current.setActiveObject(shape);
      fabricCanvasRef.current.renderAll();
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

  const downloadCanvas = () => {
    if (!fabricCanvasRef.current) return;

    const dataURL = fabricCanvasRef.current.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1
    });

    // Use the whiteboardTitle prop for the filename, fallback to 'whiteboard'
    let filename = (whiteboardTitle || 'whiteboard').trim();
    if (!filename) filename = 'whiteboard';
    // Remove illegal filename characters
    filename = filename.replace(/[^a-zA-Z0-9-_ ]/g, '');
    const link = document.createElement('a');
    link.download = `${filename}.png`;
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
        let parsed: unknown = null;
        try {
          parsed = JSON.parse(data.result);
        } catch (e) { }
        if (parsed && typeof parsed === 'object' && (parsed as any).type) {
          addElementToCanvas(parsed as WhiteboardElement);
          setAiResponse('Element added to whiteboard!');
        } else {
          setAiResponse(data.result);
        }
      } else setAiResponse(data.error || 'No response from AI.');
    } catch (err) {
      setAiResponse('Error contacting AI.');
    } finally {
      setAiLoading(false);
      setAiPrompt('');
    }
  };

  // Ruler snap logic
  const snapAngle = (angle: number) => {
    const snapAngles = [0, 45, 90, 135, 180, 225, 270, 315, 360];
    for (const snap of snapAngles) {
      if (Math.abs(angle - snap) < 7) return snap;
    }
    return angle;
  };

  // --- Update ruler drag/rotate logic for robust UX ---
  // Mouse event handlers for ruler
  const handleRulerMouseDown = (e: React.MouseEvent) => {
    // Only drag if not clicking the rotate handle
    if ((e.target as HTMLElement).dataset.rotate === '1') return;
    e.preventDefault();
    e.stopPropagation();
    console.log('Ruler drag start', e);
    setIsDraggingRuler(true);
  };
  const handleRulerMouseUp = (e: React.MouseEvent) => {
    setIsDraggingRuler(false);
    setIsRotatingRuler(false);
    setRulerSnap(false);
  };
  const handleRulerMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRuler) {
      setRulerPos({ x: e.clientX - 75, y: e.clientY - 10 });
    }
    if (isRotatingRuler) {
      const centerX = rulerPos.x + 75;
      const centerY = rulerPos.y + 10;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      if (angle < 0) angle += 360;
      const snapped = snapAngle(angle);
      setRulerAngle(snapped);
      setRulerSnap(Math.abs(snapped - angle) < 7);
    }
  };
  const handleRulerRotateStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Ruler rotate start', e);
    setIsRotatingRuler(true);
  };

  useEffect(() => {
    if (!isDraggingRuler && !isRotatingRuler) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRuler) {
        setRulerPos(prev => ({
          x: e.clientX - 75,
          y: e.clientY - 10,
        }));
      }
      if (isRotatingRuler) {
        const centerX = rulerPos.x + 75;
        const centerY = rulerPos.y + 10;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        if (angle < 0) angle += 360;
        const snapped = snapAngle(angle);
        setRulerAngle(snapped);
        setRulerSnap(Math.abs(snapped - angle) < 7);
      }
    };
    const handleMouseUp = () => {
      setIsDraggingRuler(false);
      setIsRotatingRuler(false);
      setRulerSnap(false);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingRuler, isRotatingRuler, rulerPos]);

  // Show guides during shape drawing
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    const handlePathStart = () => setShowGuides(true);
    const handlePathEnd = () => {
      setGuidesFade(true);
      setTimeout(() => {
        setShowGuides(false);
        setGuidesFade(false);
      }, 800);
    };
    fabricCanvasRef.current.on('mouse:down', handlePathStart);
    fabricCanvasRef.current.on('mouse:up', handlePathEnd);
    return () => {
      fabricCanvasRef.current?.off('mouse:down', handlePathStart);
      fabricCanvasRef.current?.off('mouse:up', handlePathEnd);
    };
  }, []);

  // --- Move the ruler overlay to a portal ---
  // Ruler overlay as a portal
  const rulerOverlay = showRuler ? ReactDOM.createPortal(
    <div
      className={`absolute z-20 select-none pointer-events-auto ${isDraggingRuler ? 'ring-2 ring-blue-300' : ''}`}
      style={{ left: rulerPos.x, top: rulerPos.y, width: 150, height: 20, transform: `rotate(${rulerAngle}deg)`, cursor: isDraggingRuler ? 'grabbing' : 'grab', position: 'fixed' }}
      onMouseDown={handleRulerMouseDown}
    >
      <div
        className={`w-full h-full bg-gray-200 border border-gray-400 rounded flex items-center relative ${rulerSnap ? 'ring-2 ring-blue-400' : ''}`}
        style={{ boxShadow: rulerSnap ? '0 0 8px #3b82f6' : undefined }}
      >
        {/* Ruler ticks */}
        {[...Array(15)].map((_, i) => (
          <div key={i} style={{ left: `${i * 10}px` }} className="absolute top-0 h-full w-px bg-gray-400" />
        ))}
        {/* Rotate handle */}
        <div
          className={`absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-400 rounded-full cursor-pointer border-2 border-white ${isRotatingRuler ? 'ring-2 ring-blue-500' : ''}`}
          data-rotate="1"
          onMouseDown={handleRulerRotateStart}
          style={{ zIndex: 2 }}
          title="Rotate Ruler"
        />
      </div>
    </div>,
    document.body
  ) : null;

  // --- Move the guides overlay to a portal ---
  // Guides overlay as a portal
  const guidesOverlay = showGuides ? ReactDOM.createPortal(
    <div
      className={`fixed left-0 top-0 w-full h-full pointer-events-none z-30 transition-opacity duration-800 ${guidesFade ? 'opacity-0' : 'opacity-40'}`}
      style={{ pointerEvents: 'none' }}
    >
      {/* Simple gridlines */}
      <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
        {[...Array(10)].map((_, i) => (
          <line
            key={`v-${i}`}
            x1={`${(i + 1) * 10}%`} y1="0%"
            x2={`${(i + 1) * 10}%`} y2="100%"
            stroke="#b3b3b3" strokeDasharray="4 4" strokeWidth="1" opacity="0.3"
          />
        ))}
        {[...Array(6)].map((_, i) => (
          <line
            key={`h-${i}`}
            y1={`${(i + 1) * 14.3}%`} x1="0%"
            y2={`${(i + 1) * 14.3}%`} x2="100%"
            stroke="#b3b3b3" strokeDasharray="4 4" strokeWidth="1" opacity="0.3"
          />
        ))}
      </svg>
    </div>,
    document.body
  ) : null;

  // --- Add audio elements for feedback ---
  const pencilAudioRef = useRef<HTMLAudioElement | null>(null);
  const pageTurnAudioRef = useRef<HTMLAudioElement | null>(null);

  // Play pencil sound when drawing
  const playPencilSound = () => {
    if (pencilAudioRef.current) {
      pencilAudioRef.current.currentTime = 0;
      pencilAudioRef.current.play();
    }
  };
  // Play page turn sound when switching tools
  const playPageTurnSound = () => {
    if (pageTurnAudioRef.current) {
      pageTurnAudioRef.current.currentTime = 0;
      pageTurnAudioRef.current.play();
    }
  };

  // Attach pencil sound to drawing events
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    const handleDraw = () => {
      if (currentTool === 'pen') playPencilSound();
    };
    fabricCanvasRef.current.on('mouse:down', handleDraw);
    fabricCanvasRef.current.on('mouse:move', handleDraw);
    fabricCanvasRef.current.on('mouse:up', handleDraw);
    return () => {
      fabricCanvasRef.current?.off('mouse:down', handleDraw);
      fabricCanvasRef.current?.off('mouse:move', handleDraw);
      fabricCanvasRef.current?.off('mouse:up', handleDraw);
    };
  }, [currentTool]);

  // Attach page turn sound to tool switching
  const selectToolWithSound = (tool: 'pen' | 'eraser' | 'select' | 'text' | 'sticky' | 'shape') => {
    playPageTurnSound();
    selectTool(tool);
  };

  // --- Add state for pen settings pop-up ---
  const [showPenMenu, setShowPenMenu] = useState(false);
  const penColors = ['#000000', '#FF4136', '#2ECC40', '#0074D9', '#FFDC00', '#FFFFFF', '#B10DC9'];
  const bgColors = ['#FFFFFF', '#F3F4F6', '#E0E7FF', '#D1FAE5', '#FEF3C7', '#FEE2E2', 'transparent'];
  const [penOpacity, setPenOpacity] = useState(1);
  // Layering: 0 = bottom, 1 = up, 2 = down, 3 = top
  const handleLayer = (action: 'up' | 'down' | 'top' | 'bottom') => {
    // Implement layer logic here
  };

  // Close pen menu on outside click
  useEffect(() => {
    if (!showPenMenu) return;
    const handleClick = (e: MouseEvent) => {
      const menu = document.getElementById('pen-menu');
      if (menu && !menu.contains(e.target as Node)) setShowPenMenu(false);
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [showPenMenu]);

  // --- Add state for template modal ---
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Add template elements to canvas
  const addFlowchartTemplate = () => {
    if (!fabricCanvasRef.current) return;
    // Simple flowchart: Start -> Process -> Decision -> End
    const start = new fabric.Rect({ left: 100, top: 100, width: 100, height: 50, fill: '#e0e7ff', stroke: '#6366f1', strokeWidth: 2, rx: 25, ry: 25 });
    const process = new fabric.Rect({ left: 100, top: 200, width: 100, height: 50, fill: '#fef3c7', stroke: '#f59e42', strokeWidth: 2 });
    const decision = new fabric.Polygon([
      { x: 150, y: 300 }, { x: 200, y: 325 }, { x: 150, y: 350 }, { x: 100, y: 325 }
    ], { fill: '#fce7f3', stroke: '#db2777', strokeWidth: 2 });
    const end = new fabric.Rect({ left: 100, top: 400, width: 100, height: 50, fill: '#e0e7ff', stroke: '#6366f1', strokeWidth: 2, rx: 25, ry: 25 });
    fabricCanvasRef.current.add(start, process, decision, end);
    // Connectors (lines)
    const line1 = new fabric.Line([150, 150, 150, 200], { stroke: '#6366f1', strokeWidth: 2 });
    const line2 = new fabric.Line([150, 250, 150, 300], { stroke: '#f59e42', strokeWidth: 2 });
    const line3 = new fabric.Line([150, 350, 150, 400], { stroke: '#db2777', strokeWidth: 2 });
    fabricCanvasRef.current.add(line1, line2, line3);
    fabricCanvasRef.current.renderAll();
    setShowTemplateModal(false);
  };
  const addMindmapTemplate = () => {
    if (!fabricCanvasRef.current) return;
    // Simple mindmap: central node with 4 branches
    const center = new fabric.Circle({ left: 350, top: 200, radius: 40, fill: '#fef3c7', stroke: '#f59e42', strokeWidth: 2 });
    const branch1 = new fabric.Rect({ left: 200, top: 100, width: 80, height: 40, fill: '#e0e7ff', stroke: '#6366f1', strokeWidth: 2 });
    const branch2 = new fabric.Rect({ left: 500, top: 100, width: 80, height: 40, fill: '#e0e7ff', stroke: '#6366f1', strokeWidth: 2 });
    const branch3 = new fabric.Rect({ left: 200, top: 300, width: 80, height: 40, fill: '#e0e7ff', stroke: '#6366f1', strokeWidth: 2 });
    const branch4 = new fabric.Rect({ left: 500, top: 300, width: 80, height: 40, fill: '#e0e7ff', stroke: '#6366f1', strokeWidth: 2 });
    fabricCanvasRef.current.add(center, branch1, branch2, branch3, branch4);
    // Connectors
    const l1 = new fabric.Line([390, 240, 240, 120], { stroke: '#f59e42', strokeWidth: 2 });
    const l2 = new fabric.Line([390, 240, 540, 120], { stroke: '#f59e42', strokeWidth: 2 });
    const l3 = new fabric.Line([390, 240, 240, 320], { stroke: '#f59e42', strokeWidth: 2 });
    const l4 = new fabric.Line([390, 240, 540, 320], { stroke: '#f59e42', strokeWidth: 2 });
    fabricCanvasRef.current.add(l1, l2, l3, l4);
    fabricCanvasRef.current.renderAll();
    setShowTemplateModal(false);
  };

  // Add calendar template
  const addCalendarTemplate = () => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    canvas.clear();
    // Calendar dimensions
    const left = 100;
    const top = 80;
    const width = 700;
    const height = 500;
    const rows = 6;
    const cols = 7;
    // Main calendar body
    const calendarBody = new fabric.Rect({
      left,
      top,
      width,
      height,
      fill: '#f8fafc',
      stroke: '#a5b4fc',
      strokeWidth: 3,
      rx: 24,
      ry: 24,
      selectable: false,
      evented: false,
    });
    canvas.add(calendarBody);
    // Title (current month/year)
    const now = new Date();
    const monthName = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
    const title = new fabric.Text(`${monthName} ${year}`, {
      left: left + width / 2,
      top: top - 40,
      fontSize: 36,
      fontFamily: 'Arial',
      fill: '#6366f1',
      fontWeight: 'bold',
      originX: 'center',
      selectable: false,
      evented: false,
    });
    canvas.add(title);
    // Day labels
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach((day, i) => {
      const label = new fabric.Text(day, {
        left: left + (i + 0.5) * (width / cols),
        top: top + 16,
        fontSize: 20,
        fontFamily: 'Arial',
        fill: '#64748b',
        originX: 'center',
        selectable: false,
        evented: false,
      });
      canvas.add(label);
    });
    // Grid lines
    for (let i = 1; i < cols; i++) {
      const x = left + (i * width) / cols;
      const line = new fabric.Line([x, top + 48, x, top + height], {
        stroke: '#c7d2fe',
        strokeWidth: 2,
        selectable: false,
        evented: false,
      });
      canvas.add(line);
    }
    for (let i = 1; i < rows; i++) {
      const y = top + 48 + (i * (height - 48)) / (rows - 1);
      const line = new fabric.Line([left, y, left + width, y], {
        stroke: '#c7d2fe',
        strokeWidth: 2,
        selectable: false,
        evented: false,
      });
      canvas.add(line);
    }
    // Calculate days for current month
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const startDay = firstDay.getDay();
    const numDays = lastDay.getDate();
    let day = 1;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cellIndex = row * cols + col;
        if (cellIndex >= startDay && day <= numDays) {
          const x = left + col * (width / cols) + (width / cols) * 0.08;
          const y = top + 48 + row * ((height - 48) / (rows - 1)) + 8;
          const dayText = new fabric.Text(day.toString(), {
            left: x,
            top: y,
            fontSize: 18,
            fontFamily: 'Arial',
            fill: '#334155',
            selectable: false,
            evented: false,
          });
          canvas.add(dayText);
          day++;
        }
      }
    }
    canvas.renderAll();
    saveToHistory();
  };

  // Zoom state
  const [zoom, setZoom] = useState(1);
  const minZoom = 0.2;
  const maxZoom = 4.0;

  // Helper: zoom to a point (x, y in canvas coordinates)
  const zoomToPoint = (zoomTarget: number, point: { x: number; y: number }) => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    const oldZoom = canvas.getZoom();
    const newZoom = Math.max(minZoom, Math.min(maxZoom, zoomTarget));
    // Convert screen point to canvas point
    const pt = new fabric.Point(point.x, point.y);
    canvas.zoomToPoint(pt, newZoom);
    setZoom(newZoom);
  };

  // Wheel zoom (Ctrl/Cmd + wheel) - zoom to cursor
  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (!fabricCanvasRef.current) return;
        const rect = canvasEl.getBoundingClientRect();
        const pointer = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
        const delta = -e.deltaY * 0.001;
        const newZoom = Math.max(minZoom, Math.min(maxZoom, fabricCanvasRef.current.getZoom() + delta));
        zoomToPoint(newZoom, pointer);
      }
    };
    canvasEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvasEl.removeEventListener('wheel', handleWheel);
  }, []);

  // Pinch-to-zoom for touch devices - zoom to pinch center
  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    let lastDist: number | null = null;
    let lastCenter: { x: number; y: number } | null = null;
    const getDist = (touches: TouchList) => {
      if (touches.length < 2) return 0;
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };
    const getCenter = (touches: TouchList) => {
      if (touches.length < 2) return { x: 0, y: 0 };
      return {
        x: (touches[0].clientX + touches[1].clientX) / 2 - canvasEl.getBoundingClientRect().left,
        y: (touches[0].clientY + touches[1].clientY) / 2 - canvasEl.getBoundingClientRect().top,
      };
    };
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        lastDist = getDist(e.touches);
        lastCenter = getCenter(e.touches);
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && lastDist && lastCenter) {
        const dist = getDist(e.touches);
        const center = getCenter(e.touches);
        const delta = dist - lastDist;
        if (Math.abs(delta) > 2) {
          if (!fabricCanvasRef.current) return;
          const currentZoom = fabricCanvasRef.current.getZoom();
          let next = currentZoom + delta * 0.002;
          next = Math.max(minZoom, Math.min(maxZoom, next));
          zoomToPoint(next, center);
          lastDist = dist;
          lastCenter = center;
        }
      }
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        lastDist = null;
        lastCenter = null;
      }
    };
    canvasEl.addEventListener('touchstart', handleTouchStart);
    canvasEl.addEventListener('touchmove', handleTouchMove);
    canvasEl.addEventListener('touchend', handleTouchEnd);
    return () => {
      canvasEl.removeEventListener('touchstart', handleTouchStart);
      canvasEl.removeEventListener('touchmove', handleTouchMove);
      canvasEl.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Toolbar zoom buttons - zoom to center of viewport
  const handleZoomIn = () => {
    if (!fabricCanvasRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const center = { x: rect.width / 2, y: rect.height / 2 };
    zoomToPoint(zoom + 0.1, center);
  };
  const handleZoomOut = () => {
    if (!fabricCanvasRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const center = { x: rect.width / 2, y: rect.height / 2 };
    zoomToPoint(zoom - 0.1, center);
  };
  const handleZoomReset = () => {
    if (!fabricCanvasRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const center = { x: rect.width / 2, y: rect.height / 2 };
    zoomToPoint(1, center);
  };

  // Apply zoom to fabric canvas
  useEffect(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.setZoom(zoom);
      // Center the canvas after zoom
      const vpt = fabricCanvasRef.current.viewportTransform;
      if (vpt) {
        vpt[4] = (fabricCanvasRef.current.getWidth() / 2) * (1 - zoom);
        vpt[5] = (fabricCanvasRef.current.getHeight() / 2) * (1 - zoom);
        fabricCanvasRef.current.setViewportTransform(vpt);
      }
      fabricCanvasRef.current.renderAll();
    }
  }, [zoom]);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: toolbarOpen ? 0 : -60, opacity: toolbarOpen ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        className="fixed left-1/4 top-6 z-50 bg-white border border-gray-200 px-6 py-3 flex flex-row items-center gap-4 rounded-2xl shadow-2xl group"
        onMouseEnter={() => setToolbarOpen(true)}
        onMouseLeave={() => hasInteracted && setToolbarOpen(false)}
        style={{ pointerEvents: toolbarOpen ? 'auto' : 'none' }}
      >
        <div className="flex items-center space-x-4">
          {/* Drawing Tools */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => selectToolWithSound('select')}
              className={`p-2 rounded ${currentTool === 'select' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              title="Select"
            >
              <MousePointer size={20} />
            </button>
            <button
              onClick={() => selectToolWithSound('pen')}
              className={`p-2 rounded ${currentTool === 'pen' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              title="Pen"
            >
              <Pen size={20} />
            </button>
            <button
              onClick={() => selectToolWithSound('eraser')}
              className={`p-2 rounded ${currentTool === 'eraser' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              title="Eraser"
            >
              <Eraser size={20} />
            </button>
            <button
              onClick={() => setShowTemplateModal(true)}
              className="p-2 rounded hover:bg-gray-100"
              title="Templates"
            >
              <PlusSquare size={20} />
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
                selectToolWithSound('text');
                addText();
              }}
              className={`p-2 rounded ${currentTool === 'text' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              title="Add Text"
            >
              <Type size={20} />
            </button>
            <button
              onClick={() => {
                selectToolWithSound('sticky');
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
                    {SHAPES.map((shape) => (
                      <button
                        key={shape.value}
                        onClick={() => {
                          setSelectedShape(shape.value as any);
                          setShowShapePicker(false);
                          selectToolWithSound('shape');
                          addShape();
                        }}
                        className="p-2 hover:bg-gray-100 rounded text-sm text-left w-full"
                      >
                        {shape.label}
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
          <button
            onClick={() => setShowRuler(r => !r)}
            className={`p-2 rounded ${showRuler ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            title="Toggle Ruler"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="6" rx="2" /><path d="M6 7v6M10 7v6M14 7v6M18 7v6" /></svg>
          </button>
          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 ml-4">
            <button
              onClick={handleZoomOut}
              className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-lg font-bold"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              –
            </button>
            <span className="w-12 text-center text-sm font-medium select-none">{Math.round(zoom * 100)}%</span>
            <button
              onClick={handleZoomIn}
              className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-lg font-bold"
              title="Zoom In"
              aria-label="Zoom In"
            >
              +
            </button>
            <button
              onClick={handleZoomReset}
              className="p-2 rounded bg-gray-50 hover:bg-gray-100 text-xs font-medium ml-1"
              title="Reset Zoom"
              aria-label="Reset Zoom"
            >
              Reset
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
      </motion.div>
      {/* Canvas Container */}
      <div className="flex-1 bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl border-4 border-blue-200 overflow-hidden relative" style={{ boxShadow: '0 8px 32px rgba(59,130,246,0.10), 0 1.5px 8px rgba(59,130,246,0.08)' }}>
          {/* Vanishing Guides Portal */}
          {guidesOverlay}
          {/* Virtual Ruler Portal */}
          {rulerOverlay}
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
      <audio ref={pencilAudioRef} src="/pencil.mp3" preload="auto" />
      <audio ref={pageTurnAudioRef} src="/pageturn.mp3" preload="auto" />

      {/* --- Add the pen settings pop-up menu (floating panel) --- */}
      {/* --- In the toolbar, wrap the pen button in a relative container and center the pop-up below it --- */}
      <div className="relative flex items-center">
        <button
          className={`p-2 rounded-lg ${currentTool === 'pen' ? 'bg-violet-100' : ''}`}
          onClick={() => {
            setCurrentTool('pen');
            setShowPenMenu((v) => !v);
          }}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-6-6-2 2 6 6 2-2z" /></svg>
        </button>
      </div>
      {/* --- Render the pen settings panel as a fixed left-side floating card --- */}
      {currentTool === 'pen' && (
        <motion.div
          id="pen-menu"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="fixed top-20 left-6 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-50 w-64 flex flex-col items-stretch"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
        >
          <div className="mb-2 font-semibold text-sm">Stroke</div>
          <div className="flex gap-2 mb-3">
            {penColors.map((c) => (
              <button
                key={c}
                className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-violet-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-violet-300`}
                style={{ background: c }}
                onClick={() => {
                  // Set color as rgba with current opacity
                  let rgb = c;
                  if (penOpacity < 1) {
                    // Convert hex to rgb
                    const hex = c.replace('#', '');
                    const bigint = parseInt(hex, 16);
                    const r = (bigint >> 16) & 255;
                    const g = (bigint >> 8) & 255;
                    const b = bigint & 255;
                    rgb = `rgba(${r},${g},${b},${penOpacity})`;
                  }
                  setColor(rgb);
                }}
              />
            ))}
          </div>
          <div className="mb-2 font-semibold text-sm">Stroke width</div>
          <div className="flex gap-2 mb-3">
            {[2, 4, 6, 8, 12].map((w) => (
              <button
                key={w}
                className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center ${brushSize === w ? 'border-violet-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-violet-300`}
                onClick={() => setBrushSize(w)}
              >
                <div style={{ width: w, height: 2, background: color, borderRadius: 2 }} />
              </button>
            ))}
          </div>
          <div className="mb-2 font-semibold text-sm">Opacity</div>
          <div className="flex items-center gap-2 mb-3">
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.01}
              value={penOpacity}
              onChange={(e) => {
                const newOpacity = Number(e.target.value);
                setPenOpacity(newOpacity);
                // If color is hex, convert to rgba
                if (color.startsWith('#')) {
                  const hex = color.replace('#', '');
                  const bigint = parseInt(hex, 16);
                  const r = (bigint >> 16) & 255;
                  const g = (bigint >> 8) & 255;
                  const b = bigint & 255;
                  setColor(`rgba(${r},${g},${b},${newOpacity})`);
                } else if (color.startsWith('rgba')) {
                  // Replace alpha in rgba
                  setColor(color.replace(/rgba\((\d+),(\d+),(\d+),([\d.]+)\)/, (m, r, g, b) => `rgba(${r},${g},${b},${newOpacity})`));
                }
              }}
              className="w-full accent-violet-500"
            />
            <span className="w-8 text-right text-xs">{Math.round(penOpacity * 100)}</span>
          </div>
          <div className="mb-2 font-semibold text-sm">Layers</div>
          <div className="flex gap-2">
            <button className="p-2 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300" onClick={() => handleLayer('up')}>↑</button>
            <button className="p-2 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300" onClick={() => handleLayer('down')}>↓</button>
            <button className="p-2 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300" onClick={() => handleLayer('top')}>⤒</button>
            <button className="p-2 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300" onClick={() => handleLayer('bottom')}>⤓</button>
          </div>
        </motion.div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-80 flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4">Choose a Template</h2>
            <button
              className="w-full py-2 mb-3 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium"
              onClick={() => { addCalendarTemplate(); setShowTemplateModal(false); }}
            >
              Calendar
            </button>
            <button
              className="w-full py-2 mb-3 rounded bg-violet-100 hover:bg-violet-200 text-violet-700 font-medium"
              onClick={addMindmapTemplate}
            >
              Mindmap
            </button>
            <button
              className="w-full py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium mt-2"
              onClick={() => setShowTemplateModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhiteboardCanvas; 