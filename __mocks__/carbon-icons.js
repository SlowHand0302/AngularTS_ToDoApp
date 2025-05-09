// Mock Carbon icons for testing
const mockIcon = { 
  prefix: 'mock',
  iconName: 'mock-icon',
  icon: [16, 16, [], '', ''],
  toString: () => 'mock-icon' // This is crucial for the IconService
};

// Default export for ES module imports
module.exports = mockIcon;
// Also export as default for ES module imports
module.exports.default = mockIcon;