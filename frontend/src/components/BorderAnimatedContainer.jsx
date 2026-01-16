function BorderAnimatedContainer({ children }) {
  return (
    <div className="w-full h-full [background:linear-gradient(45deg,#141414,#0A0A0A_50%,#141414)_padding-box,conic-gradient(from_var(--border-angle),#7C9EFF33_80%,#7C9EFF_86%,#8BA4FF_90%,#7C9EFF_94%,#7C9EFF33)_border-box] rounded-2xl border-2 border-transparent animate-border flex overflow-hidden">
      {children}
    </div>
  );
}

export default BorderAnimatedContainer;
