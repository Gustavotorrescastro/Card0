import type {NextPage} from 'next'
import React,{ReactNode,useEffect} from 'react'
interface LayoutProps{
  children: ReactNode
}

export const Layout=({children}:LayoutProps):React.JSX.Element=>{
  useEffect(()=>{
    const handleLoad=()=>{
      if('serviceWorker' in navigator){
        window.addEventListener('load',()=>{
          navigator.serviceWorker.register('/service-worker.js').then((registration)=>{
            console.log('SW registered: ',registration)
          }).catch((registrationError)=>{
            console.log('SW registration failed: ',registrationError)
          })
        })
      }
    }
    handleLoad()
  },[])
  return(
    <html lang="pt-BR">
      <body className="font-sans bg-brand-background text-brand-text">
        {children}
      </body>
    </html>
  )
}

export const getLayout=(page:React.ReactNode):React.JSX.Element=>{
  return(
    <Layout>
      {page}
    </Layout>
  )
}
