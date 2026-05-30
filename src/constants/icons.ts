export type IconsTypes = 'ArrowRight';

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
};

export default IconsList;