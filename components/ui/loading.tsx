const LoadingForm = () => {
  return (
    <section className="p-8 pt-6">
      <div className="flex flex-row gap-3 items-center">
        <div className="w-[25px] h-[25px] rounded-full animate-spin from-[#9a63d8] from-20% to-gray-200 to-60% bg-gradient-to-r flex items-center justify-center">
          <div className="w-[20px] h-[20px] rounded-full bg-white"/>
        </div>
        <h2 className="text-2xl text-muted-foreground">Loading...</h2>
      </div>
    </section>
  )
};

export default LoadingForm;
