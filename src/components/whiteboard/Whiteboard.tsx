'use client';

import { useState, useRef, useEffect } from 'react';
import { useClerkAuth } from '@/components/auth/AuthProvider';
import {
  Pen,
  Eraser,
  Square,
  Circle,
  Type,
  Undo,
  Redo,
  Download,
  Upload,
  Trash2,
  Palette,
  MousePointer,
  Move,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';

interface DrawingTool {
  id: string;
  name: string;
  icon: any;
  cursor?: string;
}

interface Point {
  x: number;
  y: number;
}

interface DrawingElement {
  id: string;
  type: 'pen' | 'eraser' | 'rectangle' | 'circle' | 'text';
  points?: Point[];
  startPoint?: Point;
  endPoint?: Point;
  text?: string;
  color: string;
  strokeWidth: number;
  timestamp: number;
}

interface WhiteboardProps {
  roomId: string;
  onToggleWhiteboard: () => void;
  isMinimized?: boolean;
}

const drawingTools: DrawingTool[] = [
  { id: 'select', name: 'Select', icon: MousePointer, cursor: 'default' },
  { id: 'pen', name: 'Pen', icon: Pen, cursor: 'crosshair' },
  { id: 'eraser', name: 'Eraser', icon: Eraser, cursor: 'grab' },
  { id: 'rectangle', name: 'Rectangle', icon: Square, cursor: 'crosshair' },
  { id: 'circle', name: 'Circle', icon: Circle, cursor: 'crosshair' },
  { id: 'text', name: 'Text', icon: Type, cursor: 'text' },
  { id: 'move', name: 'Move', icon: Move, cursor: 'move' },
];

const colors = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FF8800', '#8800FF',
  '#88FF00', '#FF0088', '#0088FF', '#888888', '#FF88FF'
];

const strokeWidths = [1, 2, 4, 6, 8, 12];

export function Whiteboard({ roomId, onToggleWhiteboard, isMinimized = false }: WhiteboardProps) {
  const { user, isGuest } = useClerkAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState('pen');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentStrokeWidth, setCurrentStrokeWidth] = useState(2);
  const [elements, setElements] = useState<DrawingElement[]>([]);
  const [undoStack, setUndoStack] = useState<DrawingElement[][]>([]);
  const [redoStack, setRedoStack] = useState<DrawingElement[][]>([]);
  const [scale, setScale] = useState(1);
  const [isMinimizedState, setIsMinimizedState] = useState(isMinimized);

  useEffect(() => {
    if (isMinimizedState) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        redrawCanvas();
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [isMinimizedState]);

  useEffect(() => {
    redrawCanvas();
  }, [elements, scale]);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply scale
    ctx.save();
    ctx.scale(scale, scale);

    // Draw all elements
    elements.forEach(element => {
      ctx.strokeStyle = element.color;
      ctx.lineWidth = element.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      switch (element.type) {
        case 'pen':
          if (element.points && element.points.length > 0) {
            ctx.beginPath();
            ctx.moveTo(element.points[0].x, element.points[0].y);
            element.points.forEach(point => {
              ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
          }
          break;

        case 'eraser':
          if (element.points && element.points.length > 0) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.moveTo(element.points[0].x, element.points[0].y);
            element.points.forEach(point => {
              ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
            ctx.globalCompositeOperation = 'source-over';
          }
          break;

        case 'rectangle':
          if (element.startPoint && element.endPoint) {
            ctx.beginPath();
            const width = element.endPoint.x - element.startPoint.x;
            const height = element.endPoint.y - element.startPoint.y;
            ctx.rect(element.startPoint.x, element.startPoint.y, width, height);
            ctx.stroke();
          }
          break;

        case 'circle':
          if (element.startPoint && element.endPoint) {
            ctx.beginPath();
            const radius = Math.sqrt(
              Math.pow(element.endPoint.x - element.startPoint.x, 2) +
              Math.pow(element.endPoint.y - element.startPoint.y, 2)
            );
            ctx.arc(element.startPoint.x, element.startPoint.y, radius, 0, 2 * Math.PI);
            ctx.stroke();
          }
          break;

        case 'text':
          if (element.text && element.startPoint) {
            ctx.font = `${element.strokeWidth * 8}px Arial`;
            ctx.fillStyle = element.color;
            ctx.fillText(element.text, element.startPoint.x, element.startPoint.y);
          }
          break;
      }
    });

    ctx.restore();
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isGuest) return; // Guests can't draw

    const pos = getMousePos(e);
    setIsDrawing(true);

    const newElement: DrawingElement = {
      id: `element_${Date.now()}_${user?.id || 'guest'}`,
      type: currentTool as any,
      color: currentColor,
      strokeWidth: currentStrokeWidth,
      timestamp: Date.now(),
    };

    switch (currentTool) {
      case 'pen':
      case 'eraser':
        newElement.points = [pos];
        break;
      case 'rectangle':
      case 'circle':
      case 'text':
        newElement.startPoint = pos;
        if (currentTool === 'text') {
          const text = prompt('Enter text:');
          if (text) {
            newElement.text = text;
            setElements([...elements, newElement]);
            saveToUndoStack();
          }
          setIsDrawing(false);
          return;
        }
        break;
    }

    setElements([...elements, newElement]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isGuest) return;

    const pos = getMousePos(e);
    const lastElement = elements[elements.length - 1];

    if (!lastElement) return;

    const updatedElements = [...elements];
    const currentElement = { ...lastElement };

    switch (currentTool) {
      case 'pen':
      case 'eraser':
        currentElement.points = [...(currentElement.points || []), pos];
        break;
      case 'rectangle':
      case 'circle':
        currentElement.endPoint = pos;
        break;
    }

    updatedElements[updatedElements.length - 1] = currentElement;
    setElements(updatedElements);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToUndoStack();
    }
  };

  const saveToUndoStack = () => {
    setUndoStack([...undoStack, elements]);
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length > 0) {
      const newUndoStack = [...undoStack];
      const previousState = newUndoStack.pop();
      setUndoStack(newUndoStack);
      setRedoStack([...redoStack, elements]);
      setElements(previousState || []);
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const newRedoStack = [...redoStack];
      const nextState = newRedoStack.pop();
      setRedoStack(newRedoStack);
      setUndoStack([...undoStack, elements]);
      setElements(nextState || []);
    }
  };

  const clearCanvas = () => {
    if (confirm('Are you sure you want to clear the whiteboard?')) {
      saveToUndoStack();
      setElements([]);
    }
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `whiteboard_${roomId}_${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleZoomIn = () => {
    setScale(Math.min(scale * 1.2, 3));
  };

  const handleZoomOut = () => {
    setScale(Math.max(scale / 1.2, 0.5));
  };

  const handleZoomReset = () => {
    setScale(1);
  };

  if (isMinimizedState) {
    return (
      <div className="fixed bottom-20 right-4 z-50">
        <button
          onClick={() => setIsMinimizedState(false)}
          className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
          title="Expand whiteboard"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Whiteboard</h2>
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <span>{elements.length} elements</span>
            <span>•</span>
            <span>{Math.round(scale * 100)}% zoom</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadCanvas}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            title="Download as image"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={clearCanvas}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            title="Clear canvas"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsMinimizedState(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            title="Minimize"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button
            onClick={onToggleWhiteboard}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            title="Close whiteboard"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        {/* Drawing Tools */}
        <div className="flex items-center gap-1">
          {drawingTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => setCurrentTool(tool.id)}
                className={`p-2 rounded-lg transition-colors ${
                  currentTool === tool.id
                    ? 'bg-purple-600 text-white'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                } ${isGuest && tool.id !== 'select' && tool.id !== 'move' ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={tool.name}
                disabled={isGuest && tool.id !== 'select' && tool.id !== 'move'}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>

        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>

        {/* Colors */}
        <div className="flex items-center gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setCurrentColor(color)}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                currentColor === color
                  ? 'border-purple-600 scale-110'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>

        {/* Stroke Width */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Size:</span>
          {strokeWidths.map((width) => (
            <button
              key={width}
              onClick={() => setCurrentStrokeWidth(width)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                currentStrokeWidth === width
                  ? 'bg-purple-600 text-white'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              title={`${width}px`}
            >
              <div
                className="rounded-full bg-current"
                style={{ width: `${width}px`, height: `${width}px` }}
              />
            </button>
          ))}
        </div>

        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={undoStack.length === 0}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={redoStack.length === 0}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomReset}
            className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
            title="Reset zoom"
          >
            {Math.round(scale * 100)}%
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-gray-950 relative">
        {isGuest && (
          <div className="absolute top-4 left-4 z-10 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg p-3 max-w-xs">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Drawing is only available for registered users.
              <a href="/sign-up" className="text-yellow-600 dark:text-yellow-400 underline ml-1">Sign up free</a> to unlock all features.
            </p>
          </div>
        )}

        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="absolute inset-0 cursor-crosshair"
          style={{ cursor: drawingTools.find(t => t.id === currentTool)?.cursor }}
        />
      </div>
    </div>
  );
}