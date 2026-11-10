"use client";

import { useMemo } from "react";
import QRCode from "qrcode";

const QUIET_ZONE = 4;
const INK = "#11120D";
const LIME = "#ffffff";
const FINDER_ORIGINS = (size: number) => [
  [0, 0],
  [size - 7, 0],
  [0, size - 7],
];

type BrandedQRCodeProps = {
  value: string;
  size: number;
};

export default function BrandedQRCode({ value, size }: BrandedQRCodeProps) {
  const matrix = useMemo(
    () => QRCode.create(value, { errorCorrectionLevel: "H" }).modules,
    [value],
  );
  const dimension = matrix.size;
  const finders = FINDER_ORIGINS(dimension);
  const centerBadgeSize = 6;
  const centerBadgeStart = (dimension - centerBadgeSize) / 2;
  const logoSize = 3.8;
  const logoStart = (dimension - logoSize) / 2;

  const isFinderModule = (row: number, column: number) =>
    finders.some(
      ([x, y]) => column >= x && column < x + 7 && row >= y && row < y + 7,
    );

  const isLogoModule = (row: number, column: number) =>
    row >= centerBadgeStart &&
    row < centerBadgeStart + centerBadgeSize &&
    column >= centerBadgeStart &&
    column < centerBadgeStart + centerBadgeSize;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={`${-QUIET_ZONE} ${-QUIET_ZONE} ${dimension + QUIET_ZONE * 2} ${dimension + QUIET_ZONE * 2}`}
      role="img"
      aria-label="QR code for the Velto mobile app"
      shapeRendering="crispEdges"
      className="block rounded-xl"
    >
      <rect
        x={-QUIET_ZONE}
        y={-QUIET_ZONE}
        width={dimension + QUIET_ZONE * 2}
        height={dimension + QUIET_ZONE * 2}
        fill={LIME}
      />

      {Array.from({ length: dimension }, (_, row) =>
        Array.from({ length: dimension }, (_, column) => {
          if (
            !matrix.get(row, column) ||
            isFinderModule(row, column) ||
            isLogoModule(row, column)
          ) {
            return null;
          }

          return (
            <circle
              key={`${row}-${column}`}
              cx={column + 0.5}
              cy={row + 0.5}
              r={0.41}
              fill={INK}
              shapeRendering="geometricPrecision"
            />
          );
        }),
      )}

      {finders.map(([x, y], index) => (
        <g key={index}>
          <rect x={x} y={y} width="7" height="7" rx="1.1" fill={INK} />
          <rect
            x={x + 1}
            y={y + 1}
            width="5"
            height="5"
            rx="0.65"
            fill={LIME}
          />
          <rect
            x={x + 2}
            y={y + 2}
            width="3"
            height="3"
            rx="0.45"
            fill={INK}
          />
        </g>
      ))}

      <rect
        x={centerBadgeStart}
        y={centerBadgeStart}
        width={centerBadgeSize}
        height={centerBadgeSize}
        fill="black"
        rx="1.2"

      />
      <image
        href="/velto-icon.svg"
        x={logoStart}
        y={logoStart}
        width={logoSize}
        height={logoSize}
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
}
