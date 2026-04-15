import Page from '@/components/Page'
import LoginForm from '@/components/LoginForm'

export default function LoginPage(){
  return(
    <Page>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <LoginForm/>
      </div>
    </Page>
  )
}