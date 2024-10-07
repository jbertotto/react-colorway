import React, { useRef, useCallback, useEffect } from "react";
import { useEventCallback } from "../../hooks/useEventCallback";
import { Point } from "../../types/point";
import { Circle, Ring, Triangle, Rectangle } from "../../geometryClasses";

export interface Interaction {
  // Adjusted to be more general
  point: Point;
  percentages: {
    horizontal?: number; // For Rectangle and Triangle
    vertical?: number; // For Rectangle and Triangle
    angle?: number; // For Circle and Ring
    radiusPercentage?: number; // For Circle and Ring
    distancePercentage?: number; // For Triangle
  };
}

// Utility functions
const isTouch = (event: MouseEvent | TouchEvent): event is TouchEvent =>
  "touches" in event;

const getTouchPoint = (touches: TouchList, touchId: null | number): Touch => {
  for (let i = 0; i < touches.length; i++) {
    if (touches[i].identifier === touchId) return touches[i];
  }
  return touches[0];
};

const getParentWindow = (node?: HTMLDivElement | null): Window => {
  return (node && node.ownerDocument.defaultView) || self;
};

interface Props {
  shape: Circle | Ring | Triangle | Rectangle;
  onMove: (interaction: Interaction) => void;
  onKey: (offset: Interaction) => void;
  children?: React.ReactNode;
}

const InteractiveBase = ({ shape, onMove, onKey, ...rest }: Props) => {
  const container = useRef<HTMLDivElement>(null);
  const onMoveCallback = useEventCallback<Interaction>(onMove);
  const onKeyCallback = useEventCallback<Interaction>(onKey);
  const touchId = useRef<null | number>(null);
  const hasTouch = useRef(false);

  const handleMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      event.preventDefault();

      const isDown = isTouch(event)
        ? event.touches.length > 0
        : event.buttons > 0;

      if (isDown && container.current) {
        const point = getPointerPosition(
          container.current,
          event,
          touchId.current
        );
        const interaction = getInteraction(point, shape);
        onMoveCallback(interaction);
      } else {
        toggleDocumentEvents(false);
      }
    },
    [onMoveCallback, shape]
  );

  const handleMoveEnd = useCallback(() => {
    toggleDocumentEvents(false);
  }, []);

  const toggleDocumentEvents = useCallback(
    (state?: boolean) => {
      const touch = hasTouch.current;
      const el = container.current;
      const parentWindow = getParentWindow(el);

      const toggleEvent = state
        ? parentWindow.addEventListener
        : parentWindow.removeEventListener;

      toggleEvent(touch ? "touchmove" : "mousemove", handleMove);
      toggleEvent(touch ? "touchend" : "mouseup", handleMoveEnd);
    },
    [handleMove, handleMoveEnd]
  );

  const handleMoveStart = useCallback(
    ({ nativeEvent }: React.MouseEvent | React.TouchEvent) => {
      const el = container.current;
      if (!el) return;

      nativeEvent.preventDefault();

      if (isInvalid(nativeEvent, hasTouch.current)) return;

      if (isTouch(nativeEvent)) {
        hasTouch.current = true;
        const changedTouches = nativeEvent.changedTouches || [];
        if (changedTouches.length)
          touchId.current = changedTouches[0].identifier;
      }

      el.focus();
      const point = getPointerPosition(el, nativeEvent, touchId.current);
      const interaction = getInteraction(point, shape);
      onMoveCallback(interaction);
      toggleDocumentEvents(true);
    },
    [onMoveCallback, toggleDocumentEvents, shape]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const key = event.key;

      // Only process arrow keys
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
        return;
      }

      // Prevent default scrolling behavior
      event.preventDefault();

      // Calculate offset based on the arrow key pressed
      const offset = {
        x: key === "ArrowRight" ? 5 : key === "ArrowLeft" ? -5 : 0,
        y: key === "ArrowDown" ? 5 : key === "ArrowUp" ? -5 : 0,
      };

      let currentPoint: Point;

      if (
        shape instanceof Circle ||
        shape instanceof Ring ||
        shape instanceof Rectangle
      ) {
        currentPoint = shape.center;
      } else if (shape instanceof Triangle) {
        // Use the centroid as the current point for Triangle
        currentPoint = shape.getCentroid();
      } else {
        // Default to origin if shape type is unknown
        currentPoint = { x: 0, y: 0 };
      }

      const newPoint = {
        x: currentPoint.x + offset.x,
        y: currentPoint.y + offset.y,
      };

      const clampedPoint = shape.getClampedPoint(newPoint);
      const interaction = getInteraction(clampedPoint, shape);

      onKeyCallback(interaction);
    },
    [onKeyCallback, shape]
  );

  useEffect(() => {
    return () => {
      toggleDocumentEvents(false);
    };
  }, [toggleDocumentEvents]);

  return (
    <div
      {...rest}
      onTouchStart={handleMoveStart}
      onMouseDown={handleMoveStart}
      className="absolute [outline:none] touch-none rounded-[inherit] inset-0"
      ref={container}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="slider"
    />
  );
};

export const InteractiveHandler = React.memo(InteractiveBase);

// Helper functions
const isInvalid = (
  event: MouseEvent | TouchEvent,
  hasTouch: boolean
): boolean => hasTouch && !isTouch(event);

const getPointerPosition = (
  node: HTMLDivElement,
  event: MouseEvent | TouchEvent,
  touchId: null | number
): Point => {
  const rect = node.getBoundingClientRect();
  const pointer = isTouch(event)
    ? getTouchPoint(event.touches, touchId)
    : (event as MouseEvent);

  return {
    x: pointer.pageX - (rect.left + getParentWindow(node).scrollX),
    y: pointer.pageY - (rect.top + getParentWindow(node).scrollY),
  };
};

const getInteraction = (
  point: Point,
  shape: Circle | Ring | Triangle | Rectangle
): Interaction => {
  const clampedPoint = shape.getClampedPoint(point);
  const percentages: Interaction["percentages"] = {};

  if (shape instanceof Circle && !(shape instanceof Ring)) {
    console.log("shape is a circle");
    percentages.radiusPercentage = shape.getRadiusPercentage(clampedPoint);
    percentages.angle = shape.getAngleFromPoint(clampedPoint);
  } else if (shape instanceof Ring) {
    console.log("shape is a ring");

    percentages.angle = shape.getAngleFromPoint(clampedPoint);
  } else if (shape instanceof Rectangle) {
    console.log("shape is a rect");

    percentages.vertical = shape.getVerticalPercentage(clampedPoint);
    percentages.horizontal = shape.getHorizontalPercentage(clampedPoint);
  } else if (shape instanceof Triangle) {
    console.log("shape is a triangle");

    // percentages.distancePercentage = shape.getDistancePercentage(clampedPoint)
    // You can add more percentage calculations if needed
  }

  return { point: clampedPoint, percentages };
};
