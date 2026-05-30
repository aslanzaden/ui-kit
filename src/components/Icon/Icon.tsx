import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type CSSProperties,
} from 'react';
import colors, { type TypeColorKeys, type ColorMode } from '../../constants/colors';
import IconsList, { type IconsTypes } from '../../constants/icons';

export interface IconProps {
  /** Icon name from the registry */
  iconName: IconsTypes;
  /** Render the filled variant by default */
  fill?: boolean;
  /** Width & height of the icon */
  size?: string | number;
  /** Token key from your color palette */
  color?: TypeColorKeys;
  /** Current color mode — falls back to localStorage 'theme' if omitted */
  colorMode?: ColorMode;
  /** Enable hover cursor + fill toggle */
  hover?: boolean;
  className?: string;
  style?: CSSProperties;
}

const getColorMode = (override?: ColorMode): ColorMode => {
  if (override) return override;
  const stored = localStorage.getItem('theme');
  return stored === 'dark' ? 'dark' : 'light';
};

const parseSvgString = (svgString: string): SVGSVGElement | null => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  return doc.querySelector('svg') ?? null;
};

export const Icon = ({
  iconName,
  fill = false,
  size = '1.5rem',
  color = 'primary',
  colorMode: colorModeProp,
  hover = false,
  className = '',
  style,
}: IconProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const isFilled = hover ? (hovered ? !fill : fill) : fill;
  const iconEntry = IconsList[iconName];
  const activeSvgString = isFilled ? iconEntry.fill : iconEntry.simple;
  const resolvedColor = colors[getColorMode(colorModeProp)][color];
  const sizeValue = typeof size === 'number' ? `${size}px` : size;

  const renderIcon = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const svgEl = parseSvgString(activeSvgString);

    while (container.firstChild) container.removeChild(container.firstChild);

    if (!svgEl) return;

    svgEl.style.width = sizeValue;
    svgEl.style.height = sizeValue;
    svgEl.style.display = 'block';
    svgEl.style.transition = 'opacity 0.15s ease';

    svgEl.querySelectorAll('path').forEach((path) => {
      path.setAttribute('stroke', resolvedColor);
    });

    container.appendChild(svgEl);
  }, [activeSvgString, sizeValue, resolvedColor]);

  useEffect(() => {
    renderIcon();
  }, [renderIcon]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      className={`icon-container${hover ? ' icon-container--hoverable' : ''}${className ? ` ${className}` : ''}`}
      style={{
        width: sizeValue,
        height: sizeValue,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        cursor: hover ? 'pointer' : 'inherit',
        ...style,
      }}
    />
  );
};

export default Icon;