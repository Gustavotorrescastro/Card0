type StepperProps = {
  activeIndex: number
  onStepClick?: (index: number) => void
}

const steps = [0, 1, 2, 3]

export default function Stepper({ activeIndex, onStepClick }: StepperProps) {
  return (
    <div className="mx-auto flex w-full max-w-[500px] items-center px-2 py-5">
      {steps.map((step, index) => {
        const completed = index <= activeIndex
        const clickable = Boolean(onStepClick && index < activeIndex)

        return (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <button
              type="button"
              disabled={!clickable}
              onClick={() => onStepClick?.(index)}
              aria-label={`Etapa ${index + 1}`}
              className={`h-9 w-9 rounded-full transition-transform ${
                completed ? 'bg-[#4ee263]' : 'bg-[#666666]'
              } ${clickable ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
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
