// This file provides type definitions for Carbon icons

// Type definition for individual Carbon icon modules
declare module '@carbon/icons/es/*/*' {
  const icon: {
    elem: string;
    attrs: Record<string, string>;
    content: Array<{
      elem: string;
      attrs: Record<string, string>;
    }>;
  };
  export default icon;
}

// More specific module declarations for commonly used icons
declare module '@carbon/icons/es/add/16.js' {
  const icon: {
    elem: string;
    attrs: Record<string, string>;
    content: Array<{
      elem: string;
      attrs: Record<string, string>;
    }>;
  };
  export default icon;
}

declare module '@carbon/icons/es/add/20.js' {
  const icon: {
    elem: string;
    attrs: Record<string, string>;
    content: Array<{
      elem: string;
      attrs: Record<string, string>;
    }>;
  };
  export default icon;
}

declare module '@carbon/icons/es/add/24.js' {
  const icon: {
    elem: string;
    attrs: Record<string, string>;
    content: Array<{
      elem: string;
      attrs: Record<string, string>;
    }>;
  };
  export default icon;
}

declare module '@carbon/icons/es/add/32.js' {
  const icon: {
    elem: string;
    attrs: Record<string, string>;
    content: Array<{
      elem: string;
      attrs: Record<string, string>;
    }>;
  };
  export default icon;
}

// Type definition for the main Carbon icons package
declare module '@carbon/icons' {
  const icon: {
    elem: string;
    attrs: Record<string, string>;
    content: Array<{
      elem: string;
      attrs: Record<string, string>;
    }>;
  };
  
  // Define types for commonly used icons
  export const Add16: typeof icon;
  export const Add20: typeof icon;
  export const Add24: typeof icon;
  export const Add32: typeof icon;
  
  export const Calendar16: typeof icon;
  export const Calendar20: typeof icon;
  export const Calendar24: typeof icon;
  export const Calendar32: typeof icon;
  
  export const CheckmarkOutline16: typeof icon;
  export const CheckmarkOutline20: typeof icon;
  export const CheckmarkOutline24: typeof icon;
  
  export const Delete16: typeof icon;
  export const Delete20: typeof icon;
  export const Delete24: typeof icon;
  
  export const Edit16: typeof icon;
  export const Edit20: typeof icon;
  export const Edit24: typeof icon;
  
  export const ChevronSort16: typeof icon;
  export const ChevronDown16: typeof icon;
  export const ChevronUp16: typeof icon;
  export const UserAvatar20: typeof icon;
}