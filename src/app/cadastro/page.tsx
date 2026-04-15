import Page from '@/components/Page'
import RegisterForm from '@/components/RegisterForm'

export default function RegisterPage() {
  return (
    <Page>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <RegisterForm />
      </div>
    </Page>
  )
}