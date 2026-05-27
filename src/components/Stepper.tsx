type StepperProps = {
  activeIndex: number
}

const steps = [0, 1, 2, 3]

export default function Stepper({ activeIndex }: StepperProps) {
  return (
    <div className="mx-auto flex w-full max-w-[520px] items-center px-2 py-8">
      {steps.map((step, index) => {
        const completed = index <= activeIndex

        return (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <div
              className={`h-9 w-9 rounded-full ${
                completed ? 'bg-[#4ee263]' : 'bg-[#666666]'
              }`}
            />
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 ${
                  index < activeIndex ? 'bg-[#4ee263]' : 'bg-[#666666]'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
