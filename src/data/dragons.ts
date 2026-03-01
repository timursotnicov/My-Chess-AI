export interface DragonTemplate {
  id: string;
  colorPrimary: string;
  colorLight: string;
  colorDark: string;
  colorBelly: string;
  colorEye: string;
}

export const DRAGONS: DragonTemplate[] = [
  {
    id: 'purple',
    colorPrimary: '#7B2D8E',
    colorLight: '#9B4DCA',
    colorDark: '#5C1D6E',
    colorBelly: '#D4A0E8',
    colorEye: '#FFD700',
  },
];

export const getDragonTemplate = (id: string): DragonTemplate =>
  DRAGONS.find((d) => d.id === id) ?? DRAGONS[0];
