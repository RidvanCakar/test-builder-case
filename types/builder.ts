// types/builder.ts

export type ElementType =
  | 'header'
  | 'footer'
  | 'card'
  | 'text-content'
  | 'slider';

export interface Position {
  x: number | string;
  y: number | string;
  width: number | string;
  height: number | string;
  zIndex: number;
}

export interface BaseElement {
  id: string;
  type: ElementType;
  position: Position;
}

export interface HeaderElement extends BaseElement {
  type: 'header';
  content: {
    text: string;
    style: string;
  };
}

export interface CardElement extends BaseElement {
  type: 'card';
  content: {
    title: string;
    description: string;
    image: string | null;
  };
}

export interface TextContentElement extends BaseElement {
  type: 'text-content';
  content: {
    html: string;
    plainText: string;
  };
}

export interface FooterElement extends BaseElement {
  type: 'footer';
  content: {
    copyright: string;
    links: string[];
  };
}

export interface SliderElement extends BaseElement {
  type: 'slider';
  content: {
    images: string[];
  };
}

export type BuilderElement =
  | HeaderElement
  | CardElement
  | TextContentElement
  | FooterElement
  | SliderElement;
