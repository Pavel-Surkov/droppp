import { useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';

type PinInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  containerClassName?: string;
};

export function PinInput({
  value,
  onChange,
  length = 4,
  containerClassName,
}: PinInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length }, (_, index) => value[index] ?? '');

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const focusAt = (index: number) => {
    if (index < 0 || index >= length) return;
    inputsRef.current[index]?.focus();
    inputsRef.current[index]?.select();
  };

  const setDigit = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    const next = digits.map((char, i) => (i === index ? digit : char)).join('');
    onChange(next);
    if (digit) focusAt(index + 1);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (/^\d$/.test(event.key)) {
      event.preventDefault();
      setDigit(index, event.key);
      return;
    }

    if (event.key === 'Backspace' && !digits[index]) {
      focusAt(index - 1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusAt(index - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusAt(index + 1);
    }
  };

  return (
    <div
      className={`mt-4 flex items-center justify-center gap-2 ${containerClassName ?? ''}`}
    >
      {digits.map((digit, index) => (
        <input
          className="h-11 w-11 rounded-lg border border-(--line) bg-white text-center text-lg font-extrabold text-(--ink) outline-none ring-0 transition focus:border-(--accent) focus:shadow-[0_0_0_2px_var(--color-vibrant-coral-100)]"
          inputMode="numeric"
          key={index}
          maxLength={1}
          onChange={(event) => setDigit(index, event.target.value)}
          onFocus={(event) => event.currentTarget.select()}
          onKeyDown={(event) => onKeyDown(event, index)}
          ref={(element) => {
            inputsRef.current[index] = element;
          }}
          value={digit}
        />
      ))}
    </div>
  );
}
