import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Calculadora Simples" },
      { name: "description", content: "Uma calculadora simples e elegante." },
    ],
  }),
});

type Op = "+" | "-" | "×" | "÷";

function Index() {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<Op | null>(null);
  const [waiting, setWaiting] = useState(false);

  const inputDigit = (d: string) => {
    if (waiting) {
      setDisplay(d);
      setWaiting(false);
    } else {
      setDisplay(display === "0" ? d : display + d);
    }
  };

  const inputDot = () => {
    if (waiting) {
      setDisplay("0.");
      setWaiting(false);
      return;
    }
    if (!display.includes(".")) setDisplay(display + ".");
  };

  const clear = () => {
    setDisplay("0");
    setPrev(null);
    setOp(null);
    setWaiting(false);
  };

  const toggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const percent = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  const compute = (a: number, b: number, o: Op) => {
    switch (o) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b === 0 ? 0 : a / b;
    }
  };

  const chooseOp = (next: Op) => {
    const value = parseFloat(display);
    if (prev !== null && op && !waiting) {
      const result = compute(prev, value, op);
      setPrev(result);
      setDisplay(String(result));
    } else {
      setPrev(value);
    }
    setOp(next);
    setWaiting(true);
  };

  const equals = () => {
    const value = parseFloat(display);
    if (prev !== null && op) {
      const result = compute(prev, value, op);
      setDisplay(String(result));
      setPrev(null);
      setOp(null);
      setWaiting(true);
    }
  };

  const Btn = ({
    label,
    onClick,
    variant = "num",
    wide = false,
  }: {
    label: string;
    onClick: () => void;
    variant?: "num" | "op" | "fn";
    wide?: boolean;
  }) => {
    const base =
      "h-16 rounded-2xl text-2xl font-medium transition-all active:scale-95 shadow-sm";
    const styles =
      variant === "op"
        ? "bg-primary text-primary-foreground hover:opacity-90"
        : variant === "fn"
        ? "bg-secondary text-secondary-foreground hover:opacity-80"
        : "bg-card text-card-foreground hover:bg-accent";
    return (
      <button
        onClick={onClick}
        className={`${base} ${styles} ${wide ? "col-span-2" : ""}`}
      >
        {label}
      </button>
    );
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-4 text-center text-sm font-medium tracking-wide text-muted-foreground uppercase">
          Calculadora
        </h1>
        <div className="rounded-3xl bg-card p-5 shadow-xl border border-border">
          <div className="mb-4 flex min-h-24 items-end justify-end rounded-2xl bg-muted p-5">
            <div className="w-full truncate text-right text-5xl font-light tabular-nums text-foreground">
              {display}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <Btn label="AC" variant="fn" onClick={clear} />
            <Btn label="+/−" variant="fn" onClick={toggleSign} />
            <Btn label="%" variant="fn" onClick={percent} />
            <Btn label="÷" variant="op" onClick={() => chooseOp("÷")} />

            <Btn label="7" onClick={() => inputDigit("7")} />
            <Btn label="8" onClick={() => inputDigit("8")} />
            <Btn label="9" onClick={() => inputDigit("9")} />
            <Btn label="×" variant="op" onClick={() => chooseOp("×")} />

            <Btn label="4" onClick={() => inputDigit("4")} />
            <Btn label="5" onClick={() => inputDigit("5")} />
            <Btn label="6" onClick={() => inputDigit("6")} />
            <Btn label="−" variant="op" onClick={() => chooseOp("-")} />

            <Btn label="1" onClick={() => inputDigit("1")} />
            <Btn label="2" onClick={() => inputDigit("2")} />
            <Btn label="3" onClick={() => inputDigit("3")} />
            <Btn label="+" variant="op" onClick={() => chooseOp("+")} />

            <Btn label="0" wide onClick={() => inputDigit("0")} />
            <Btn label="." onClick={inputDot} />
            <Btn label="=" variant="op" onClick={equals} />
          </div>
        </div>
      </div>
    </main>
  );
}
