"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Zoom, {
  type ControlledProps,
  type UncontrolledProps,
} from "react-medium-image-zoom";
import { cn } from "@/lib/utils";

const CLOSE_ANIMATION_DURATION = 240;

type ZoomChangeHandler = NonNullable<UncontrolledProps["onZoomChange"]>;

export type ImageZoomProps = UncontrolledProps & {
  isZoomed?: ControlledProps["isZoomed"];
  onZoomChange?: ControlledProps["onZoomChange"];
  className?: string;
  backdropClassName?: string;
};

export const ImageZoom = ({
  className,
  backdropClassName,
  onZoomChange,
  isZoomed,
  ...restProps
}: ImageZoomProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const previousIsZoomedRef = useRef<ImageZoomProps["isZoomed"]>(isZoomed);

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = undefined;
    }
  }, []);

  const beginClosing = useCallback(() => {
    clearCloseTimeout();
    setIsClosing(true);
    closeTimeoutRef.current = setTimeout(() => {
      setIsClosing(false);
      closeTimeoutRef.current = undefined;
    }, CLOSE_ANIMATION_DURATION);
  }, [clearCloseTimeout]);

  const cancelClosing = useCallback(() => {
    clearCloseTimeout();
    setIsClosing(false);
  }, [clearCloseTimeout]);

  useEffect(() => {
    return () => {
      clearCloseTimeout();
    };
  }, [clearCloseTimeout]);

  useEffect(() => {
    const previous = previousIsZoomedRef.current;
    if (typeof isZoomed === "boolean" && typeof previous === "boolean") {
      if (previous && !isZoomed) {
        beginClosing();
      } else if (!previous && isZoomed) {
        cancelClosing();
      }
    } else if (typeof previous !== "boolean" && isZoomed) {
      cancelClosing();
    }

    previousIsZoomedRef.current = isZoomed;
  }, [isZoomed, beginClosing, cancelClosing]);

  const handleZoomChange = useCallback<ZoomChangeHandler>((value, data) => {
    if (value) {
      cancelClosing();
    } else {
      beginClosing();
    }

    onZoomChange?.(value, data);
  }, [onZoomChange, beginClosing, cancelClosing]);

  return (
    <div
      data-closing={isClosing ? "true" : undefined}
      className={cn(
        "relative",
        "[&_[data-rmiz-ghost]]:pointer-events-none [&_[data-rmiz-ghost]]:absolute",
        "[&_[data-rmiz-btn-zoom]]:m-0 [&_[data-rmiz-btn-zoom]]:size-10 [&_[data-rmiz-btn-zoom]]:touch-manipulation [&_[data-rmiz-btn-zoom]]:appearance-none [&_[data-rmiz-btn-zoom]]:rounded-[50%] [&_[data-rmiz-btn-zoom]]:border-none [&_[data-rmiz-btn-zoom]]:bg-foreground/70 [&_[data-rmiz-btn-zoom]]:p-2 [&_[data-rmiz-btn-zoom]]:text-background [&_[data-rmiz-btn-zoom]]:outline-offset-2",
        "[&_[data-rmiz-btn-unzoom]]:m-0 [&_[data-rmiz-btn-unzoom]]:size-10 [&_[data-rmiz-btn-unzoom]]:touch-manipulation [&_[data-rmiz-btn-unzoom]]:appearance-none [&_[data-rmiz-btn-unzoom]]:rounded-[50%] [&_[data-rmiz-btn-unzoom]]:border-none [&_[data-rmiz-btn-unzoom]]:bg-foreground/70 [&_[data-rmiz-btn-unzoom]]:p-2 [&_[data-rmiz-btn-unzoom]]:text-background [&_[data-rmiz-btn-unzoom]]:outline-offset-2",
        "[&_[data-rmiz-btn-zoom]:not(:focus):not(:active)]:pointer-events-none [&_[data-rmiz-btn-zoom]:not(:focus):not(:active)]:absolute [&_[data-rmiz-btn-zoom]:not(:focus):not(:active)]:size-px [&_[data-rmiz-btn-zoom]:not(:focus):not(:active)]:overflow-hidden [&_[data-rmiz-btn-zoom]:not(:focus):not(:active)]:whitespace-nowrap [&_[data-rmiz-btn-zoom]:not(:focus):not(:active)]:[clip-path:inset(50%)] [&_[data-rmiz-btn-zoom]:not(:focus):not(:active)]:[clip:rect(0_0_0_0)]",
        "[&_[data-rmiz-btn-zoom]]:absolute [&_[data-rmiz-btn-zoom]]:top-2.5 [&_[data-rmiz-btn-zoom]]:right-2.5 [&_[data-rmiz-btn-zoom]]:bottom-auto [&_[data-rmiz-btn-zoom]]:left-auto [&_[data-rmiz-btn-zoom]]:cursor-zoom-in",
        "[&_[data-rmiz-btn-unzoom]]:absolute [&_[data-rmiz-btn-unzoom]]:top-5 [&_[data-rmiz-btn-unzoom]]:right-5 [&_[data-rmiz-btn-unzoom]]:bottom-auto [&_[data-rmiz-btn-unzoom]]:left-auto [&_[data-rmiz-btn-unzoom]]:z-[1] [&_[data-rmiz-btn-unzoom]]:cursor-zoom-out",
        '[&_[data-rmiz-content="found"]_img]:cursor-pointer',
        '[&_[data-rmiz-content="found"]_svg]:cursor-pointer',
        '[&_[data-rmiz-content="found"]_[role="img"]]:cursor-pointer',
        '[&_[data-rmiz-content="found"]_[data-zoom]]:cursor-pointer',
        "data-[closing=true]:[&_[data-rmiz-content]]:!visible",
        "data-[closing=true]:[&_[data-rmiz-ghost]]:hidden",
        className
      )}
    >
      <Zoom
        {...restProps}
        {...(typeof isZoomed === "boolean" ? { isZoomed } : {})}
        onZoomChange={handleZoomChange}
        classDialog={cn(
          "[&::backdrop]:hidden",
          "[&[open]]:fixed [&[open]]:m-0 [&[open]]:h-dvh [&[open]]:max-h-none [&[open]]:w-dvw [&[open]]:max-w-none [&[open]]:overflow-hidden [&[open]]:border-0 [&[open]]:bg-transparent [&[open]]:p-0",
          "[&_[data-rmiz-modal-overlay]]:absolute [&_[data-rmiz-modal-overlay]]:inset-0 [&_[data-rmiz-modal-overlay]]:transition-all",
          '[&_[data-rmiz-modal-overlay="hidden"]]:bg-transparent',
          '[&_[data-rmiz-modal-overlay="visible"]]:bg-background/80 [&_[data-rmiz-modal-overlay="visible"]]:backdrop-blur-md',
          "[&_[data-rmiz-modal-content]]:relative [&_[data-rmiz-modal-content]]:size-full",
          "[&_[data-rmiz-modal-img]]:absolute [&_[data-rmiz-modal-img]]:origin-top-left [&_[data-rmiz-modal-img]]:cursor-zoom-out",
          "[&_[data-rmiz-modal-content]_[data-rmiz-modal-img]]:transition-[transform,opacity] [&_[data-rmiz-modal-content]_[data-rmiz-modal-img]]:duration-300 [&_[data-rmiz-modal-content]_[data-rmiz-modal-img]]:ease-out",
          '[&_[data-rmiz-modal-overlay="visible"]~[data-rmiz-modal-content]_[data-rmiz-modal-img]]:opacity-100',
          '[&_[data-rmiz-modal-overlay="hidden"]~[data-rmiz-modal-content]_[data-rmiz-modal-img]]:opacity-0 [&_[data-rmiz-modal-overlay="hidden"]~[data-rmiz-modal-content]_[data-rmiz-modal-img]]:duration-200 [&_[data-rmiz-modal-overlay="hidden"]~[data-rmiz-modal-content]_[data-rmiz-modal-img]]:ease-in',
          "motion-reduce:[&_[data-rmiz-modal-content]_[data-rmiz-modal-img]]:transition-none motion-reduce:[&_[data-rmiz-modal-overlay]]:transition-none",
          backdropClassName
        )}
      />
    </div>
  );
};
