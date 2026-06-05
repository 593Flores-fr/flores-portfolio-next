"use client";

interface RealismButtonProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit";
  fullWidth?: boolean;
  disabled?: boolean;
}

export function RealismButton({ text, onClick, type = "button", fullWidth, disabled }: RealismButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="group relative p-[2px] rounded-[16px] border-none cursor-pointer transition-all"
      style={{
        fontSize: "1rem",
        background: "radial-gradient(circle 80px at 80% -10%, #3a6fff, #0d1124)",
        width: fullWidth ? "100%" : "auto",
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      {/* Glow behind */}
      <div
        className="absolute top-0 right-0 w-[65%] h-[60%] rounded-[120px] transition-all duration-300 ease-out -z-10"
        style={{ boxShadow: "0 0 20px rgba(60,120,255,0.35)" }}
      />

      {/* Bottom-left blue blob */}
      <div
        className="absolute bottom-0 left-0 rounded-[17px] transition-all duration-300 ease-out group-hover:w-[90px]"
        style={{
          width: "50px",
          height: "50%",
          background: "radial-gradient(circle 60px at 0% 100%, #3a7fff, rgba(0,100,255,0.3), transparent)",
          boxShadow: "-2px 9px 40px rgba(30,100,255,0.35)",
        }}
      />

      {/* Inner content */}
      <div
        className="relative rounded-[14px] text-white transition-all duration-300 group-hover:scale-[1.03] z-10"
        style={{
          padding: "13px 28px",
          background: "radial-gradient(circle 80px at 80% -50%, #3a5a99, #080e1e)",
          fontFamily: "var(--font-poppins)",
          fontSize: "13px",
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          width: fullWidth ? "100%" : "auto",
          textAlign: "center",
        }}
      >
        {text}
        {/* Inner glow */}
        <div
          className="absolute inset-0 rounded-[14px] -z-[1]"
          style={{ background: "radial-gradient(circle 60px at 0% 100%, rgba(0,100,255,0.12), rgba(0,0,180,0.07), transparent)" }}
        />
      </div>
    </button>
  );
}
