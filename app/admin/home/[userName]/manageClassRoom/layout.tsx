export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>
        <div className="h-[calc(100vh-80px)] w-screen flex items-start justify-center bg-secondary box-border">
          <div className="w-full h-screen bg-white lg:border-2 lg:border-primary lg:rounded-lg shadow-lg flex flex-col items-center justify-start border-none lg:h-[calc(100vh-120px)] lg:w-4/5 lg:mt-5 overflow-y-scroll overflow-x-hidden lg:scrollbar lg:scrollbar-thumb-slate-500 lg:scrollbar-track-slate-300 lg:scrollbar-thumb-rounded-lg lg:scrollbar-track-rounded-full lg:scrollbar-w-3">
            {children}
          </div>
        </div>
      </main>
    </>
  );
}
