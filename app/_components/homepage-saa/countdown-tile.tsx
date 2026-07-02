interface CountdownTileProps {
  value: string;
  label: string;
}

/**
 * Splits a zero-padded numeric string into individual glass-tile digits, e.g.
 * "05" -> ["0", "5"]. Values with more than 2 digits (>= 100, see BR-002)
 * still render one tile per digit.
 */
export default function CountdownTile({ value, label }: CountdownTileProps) {
  const digits = value.split("");

  return (
    <div className="flex flex-col items-start gap-2 sm:gap-3.5">
      <div className="flex items-center gap-2 sm:gap-3.5">
        {digits.map((digit, index) => (
          <div
            key={index}
            className="flex h-[60px] w-[38px] items-center justify-center rounded-lg border border-[#ffea9e]/50 bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-md sm:h-[82px] sm:w-[51px]"
          >
            <span className="font-digital text-2xl leading-none text-white tabular-nums sm:text-[42px]">
              {digit}
            </span>
          </div>
        ))}
      </div>
      <span className="font-montserrat text-base font-bold leading-8 text-white sm:text-2xl">
        {label}
      </span>
    </div>
  );
}
