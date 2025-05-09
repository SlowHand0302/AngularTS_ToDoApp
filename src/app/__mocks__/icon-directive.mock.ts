import { Directive, ElementRef, Input } from '@angular/core';

/**
 * Mock implementation of IconDirective for testing
 * This prevents the \"Cannot read properties of undefined (reading 'width')\" error
 */
@Directive({
  selector: '[ibmIcon]',
  standalone: true
})
export class IconDirectiveMock {
  @Input() ibmIcon: string = '';
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | '16' | '20' | '24' | '32' = 'md';
  defaultSize = 16;
  
  // Properties that the real directive has
  width: number = 16;
  height: number = 16;
  title: string = '';

  constructor(private elementRef: ElementRef) {}

  mapSize(size: string): number {
    switch (size) {
      case 'xs': return 16;
      case 'sm': return 20;
      case 'md': return 24;
      case 'lg': return 32;
      default: return parseInt(size, 10) || this.defaultSize;
    }
  }


  ngAfterViewInit() {
    // Mock implementation that doesn't cause errors
    this.renderIcon();
  }

  renderIcon() {
    try {
      // Create a mock SVG element to avoid the "width" error
      const mockSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const sizeValue = this.mapSize(this.size);
      this.width = this.height = sizeValue;
      mockSvg.setAttribute('width', sizeValue.toString());
      mockSvg.setAttribute('height', sizeValue.toString());
      mockSvg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
      mockSvg.setAttribute('fill', 'currentColor');
      
      // Replace the content of the element with our mock SVG
      if (this.elementRef && this.elementRef.nativeElement) {
        this.elementRef.nativeElement.innerHTML = '';
        this.elementRef.nativeElement.appendChild(mockSvg);
      }
      
      return mockSvg;
    } catch (error) {
      // Silently catch any errors during rendering
      console.warn('IconDirectiveMock: Error rendering icon', error);
      return null;
    }
  }
}