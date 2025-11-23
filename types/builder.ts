// src/types/builder.ts

export type ElementType = 'header' | 'footer' | 'card' | 'text-content' | 'slider';

export interface ResponsiveStyle {
  width?: string | number;
  height?: string | number;
  x?: number;
  y?: number;
}

export interface ElementPosition {
  x: number;
  y: number | string;
  width: string | number;
  height: string | number;
  zIndex: number;
  fixed?: boolean;
}

export interface ElementContent {
  text?: string;
  title?: string;
  description?: string;
  image?: string | null;
  html?: string;
  plainText?: string;
  copyright?: string;
  links?: any[];
  style?: string;
}

export interface BuilderElement {
  id: string;
  type: ElementType;
  content: ElementContent;
  position: ElementPosition;
  responsive?: {
    mobile?: ResponsiveStyle;
    tablet?: ResponsiveStyle;
  };
}

export interface BuilderData {
  project: {
    name: string;
    version: string;
    created: string;
    lastModified: string;
  };
  canvas: {
    width: number;
    height: number;
    grid: {
      enabled: boolean;
      size: number;
      snap: boolean;
    };
  };
  elements: BuilderElement[];
  metadata: {
    totalElements: number;
    exportFormat: string;
    exportVersion: string;
  };
}