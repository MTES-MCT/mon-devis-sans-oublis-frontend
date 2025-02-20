import * as Components from './index';

describe('Components exports', () => {
  it('exports all components correctly', () => {
    const expectedExports = [
      'Alert',
      'AlertType',
      'Badge',
      'BadgeVariant',
      'BadgeSize',
      'BlockNumber',
      'BlockNumberSize',
      'Card',
      'CardImage',
      'CardLinkProfile',
      'CheckboxGroup',
      'Confetti',
      'DropdownCheckboxList',
      'Footer',
      'Header',
      'IconBackground',
      'IconBackgroundVariant',
      'Link',
      'LinkSize',
      'LinkVariant',
      'LoadingDots',
      'Matomo',
      'Modal',
      'ModalPosition',
      'CommentErrorModal',
      'DeleteErrorModal',
      'ErrorDetailsModal',
      'GlobalErrorFeedbacksModal',
      'Notice',
      'QuoteErrorLine',
      'QuoteErrorTable',
      'QuoteStatusLink',
      'QuoteStatusType',
      'RoundCheckboxGroup',
      'SVGLoader',
      'Tile',
      'Toast',
      'Tooltip',
      'Upload',
    ];

    expectedExports.forEach((exportName) => {
      expect(Components).toHaveProperty(exportName);
    });

    const actualExports = Object.keys(Components);
    expect(actualExports.sort()).toEqual(expectedExports.sort());
  });

  it('exports components as non-null values', () => {
    const componentNames = [
      'Alert',
      'AlertType',
      'Badge',
      'BlockNumber',
      'Card',
      'CardImage',
      'CardLinkProfile',
      'CheckboxGroup',
      'Confetti',
      'DropdownCheckboxList',
      'Footer',
      'Header',
      'IconBackground',
      'Link',
      'LoadingDots',
      'Matomo',
      'Modal',
      'ModalPosition',
      'CommentErrorModal',
      'DeleteErrorModal',
      'ErrorDetailsModal',
      'GlobalErrorFeedbacksModal',
      'Notice',
      'QuoteErrorLine',
      'QuoteErrorTable',
      'QuoteStatusLink',
      'RoundCheckboxGroup',
      'SVGLoader',
      'Tile',
      'Toast',
      'Tooltip',
      'Upload',
    ];

    componentNames.forEach((componentName) => {
      expect(
        Components[componentName as keyof typeof Components]
      ).toBeDefined();
      expect(
        Components[componentName as keyof typeof Components]
      ).not.toBeNull();
    });
  });

  it('exports enums with correct values', () => {
    expect(Components.BadgeVariant).toBeDefined();
    expect(Components.BadgeSize).toBeDefined();
    expect(Components.BlockNumberSize).toBeDefined();
    expect(Components.IconBackgroundVariant).toBeDefined();
    expect(Components.LinkSize).toBeDefined();
    expect(Components.LinkVariant).toBeDefined();
    expect(Components.ModalPosition).toBeDefined();
    expect(Components.QuoteStatusType).toBeDefined();
  });
});
