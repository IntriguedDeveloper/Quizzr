export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>
        <div className="h-[calc(100vh-80px)] flex items-start justify-center bg-secondary">
          <div className="max-w-6xl w-full h-full bg-white border-2 border-primary rounded-lg shadow-lg flex flex-col items-center justify-start pt-5 lg:h-4/5 lg:w-4/5 lg:mt-5">
            {children}
          </div>
        </div>
      </main>
    </>
  );
}
