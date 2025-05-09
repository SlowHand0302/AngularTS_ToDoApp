import { Injectable } from '@angular/core';

/**
 * Mock implementation of IconService for testing
 * This prevents the "Cannot read properties of undefined (reading 'toString')" error
 */
@Injectable()
export class IconServiceMock {
  // Store registered icons for testing purposes if needed
  private registeredIcons: any[] = [];

  /**
   * Mock implementation of registerAll method
   * @param icons - Array of icons to register
   */
  registerAll(icons: any[]): void {
    // Just store the icons without actually processing them
    this.registeredIcons = [...this.registeredIcons, ...icons];
  }

  /**
   * Mock implementation of register method
   * @param icon - Icon to register
   */
  register(icon: any): void {
    // Just store the icon without actually processing it
    this.registeredIcons.push(icon);
  }

  /**
   * Mock implementation of registerAs method
   * @param name - Name to register the icon as
   * @param icon - Icon to register
   */
  registerAs(name: string, icon: any): void {
    // Just store the icon without actually processing it
    this.registeredIcons.push({ name, icon });
  }

  /**
   * Mock implementation of get method
   * @param name - Name of icon to get
   * @returns A mock icon object
   */
  get(name: string): any {
    // Return a mock icon that won't cause errors when used
    return {
      prefix: 'mock',
      iconName: name,
      icon: [16, 16, [], '', ''],
      toString: () => name
    };
  }
}