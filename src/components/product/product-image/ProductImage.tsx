'use client';

import Image from 'next/image';

interface Props {
  src?: string;
  alt: string;
  className?: React.StyleHTMLAttributes<HTMLImageElement>['className'];
  width: number;
  height: number;
  style?: React.StyleHTMLAttributes<HTMLImageElement>['style'];
  onMouseEnter?: React.MouseEventHandler<HTMLImageElement> | undefined;
  onMouseLeave?: React.MouseEventHandler<HTMLImageElement> | undefined;
}

export const ProductImage = ({
  src,
  alt,
  width,
  height,
  className,
  style,
  onMouseEnter = () => {},
  onMouseLeave = () => {},
}: Props) => {
  const localSrc = src
    ? src.startsWith('http')
      ? src
      : `/products/${src}`
    : '/imgs/placeholder.jpg';

  return (
    <Image
      src={localSrc}
      width={width}
      height={height}
      alt={alt}
      className={className}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
};
