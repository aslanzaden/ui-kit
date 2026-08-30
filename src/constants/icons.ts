export type IconsTypes =
  | 'ArrowRight'
  | 'Eye'
  | 'EyeOff'
  | 'ChevronUp'
  | 'ChevronDown'
  | 'Close'
  | 'CircleX'
  | 'CircleAlert'
  | 'CircleCheck'
  | 'CircleHelp'
  | 'CircleMinus'
  | 'CirclePlus'
  | 'ChevronLeft'
  | 'ChevronRight'
  | 'ChevronsLeft'
  | 'ChevronsRight'
  | 'Ellipsis'
  | 'Columns3';

export interface IconListItemType {
  simple: string;
  fill: string;
}

export type IconsListType = {
  [Key in IconsTypes]: IconListItemType;
};

const IconsList: IconsListType = {
  ArrowRight: {
    simple:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fill: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  Eye: {
    simple:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fill: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  EyeOff: {
    simple:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.88 9.88a3 3 0 104.24 4.24" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.73 5.08A10.43 10.43 0 0112 5c7 0 10 7 10 7a13.16 13.16 0 01-1.67 2.68" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.61 6.61A13.526 13.526 0 002 12s3 7 10 7a9.74 9.74 0 005.39-1.61" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 2l20 20" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fill: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.88 9.88a3 3 0 104.24 4.24" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.73 5.08A10.43 10.43 0 0112 5c7 0 10 7 10 7a13.16 13.16 0 01-1.67 2.68" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.61 6.61A13.526 13.526 0 002 12s3 7 10 7a9.74 9.74 0 005.39-1.61" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 2l20 20" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  ChevronUp: {
    simple:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 15l6-6 6 6" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fill: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 15l6-6 6 6" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  ChevronDown: {
    simple:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fill: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  Close: {
    simple:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 6l12 12" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fill: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 6l12 12" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  CircleX: {
    simple:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 9l-6 6" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 9l6 6" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fill: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 9l-6 6" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 9l6 6" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  CircleAlert: {
    simple:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 8v4" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 16h.01" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fill: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 8v4" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 16h.01" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  CircleCheck: {
    simple:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fill: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  CircleHelp: {
    simple:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.09 9a3 3 0 015.82 1c0 2-3 3-3 3" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 17h.01" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fill: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.09 9a3 3 0 015.82 1c0 2-3 3-3 3" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 17h.01" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  CircleMinus: {
    simple:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 12h8" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fill: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 12h8" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  CirclePlus: {
    simple:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 8v8" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 12h8" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fill: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 8v8" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 12h8" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  ChevronLeft: {
    simple:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18l-6-6 6-6" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fill: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18l-6-6 6-6" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  ChevronRight: {
    simple:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18l6-6-6-6" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fill: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18l6-6-6-6" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  ChevronsLeft: {
    simple:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 17l-5-5 5-5" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 17l-5-5 5-5" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fill: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 17l-5-5 5-5" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 17l-5-5 5-5" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  ChevronsRight: {
    simple:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 17l5-5-5-5" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 17l5-5-5-5" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fill: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 17l5-5-5-5" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 17l5-5-5-5" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  Ellipsis: {
    simple:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h.01" stroke="#18181B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 12h.01" stroke="#18181B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 12h.01" stroke="#18181B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fill: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h.01" stroke="#18181B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 12h.01" stroke="#18181B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 12h.01" stroke="#18181B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  Columns3: {
    simple:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 3v18" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 3v18" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fill: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 3v18" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 3v18" stroke="#18181B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
};

export default IconsList;