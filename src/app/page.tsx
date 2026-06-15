import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BarChart3, Leaf, ShieldCheck } from 'lucide-react'

import AuthFooter from '@/components/AuthFooter'
import Card0Logo from '@/components/Card0Logo'
import EdenredLogo from '@/components/EdenredLogo'
import fotoFundoEdenred from '../../FotoFundoEdenred.jpg'
import mesaFundoEdenred from '../../MesaFundoEdenred.png'

const pillars = [
  {
    icon: BarChart3,
    title: 'Custo real',
    href: '#custo-real',
    text: 'Veja onde a operação física custa mais do que parece.',
  },
  {
    icon: Leaf,
    title: 'Carbono evitável',
    href: '#carbono-evitavel',
    text: 'Entenda quanto CO₂ pode ser reduzido com o digital.',
  },
  {
    icon: ShieldCheck,
    title: 'Risco operacional',
    href: '#risco-operacional',
    text: 'Simule falhas, reemissões e retrabalho antes da decisão.',
  },
]

const detailSections = [
  {
    id: 'custo-real',
    icon: BarChart3,
    title: 'Custo real',
    eyebrow: 'Impacto financeiro',
    intro:
      'O preço de um cartão físico é só uma parte da conta. A ferramenta mostra o custo total da operação para que a empresa veja, em dinheiro, onde a migração digital gera economia.',
    items: [
      'Custos diretos: produção do cartão, chip, personalização e envio.',
      'Custos indiretos: logística, suporte, gestão, onboarding e tempo operacional.',
      'Custos de falha: reemissão, pagamento negado, retrabalho e chamados internos.',
    ],
    calculation:
      'O cálculo compara TCO físico e TCO digital. A economia é a diferença entre esses dois cenários, exibida em valor absoluto e percentual.',
  },
  {
    id: 'carbono-evitavel',
    icon: Leaf,
    title: 'Carbono evitável',
    eyebrow: 'Operação e execução',
    intro:
      'Para um usuário leigo, a ideia é simples: cartão físico precisa ser produzido, transportado, usado e descartado. Cada etapa tem impacto. O cartão digital reduz boa parte dessa cadeia.',
    items: [
      'Produção: materiais plásticos, chip, impressão e embalagem.',
      'Transporte: deslocamento dos cartões até a empresa ou usuários.',
      'Descarte: reciclagem, recuperação de material e compensação de carbono.',
    ],
    calculation:
      'A página de operação compara físico vs. digital em kg ou tCO₂e e mostra a redução por fase do ciclo de vida.',
  },
  {
    id: 'risco-operacional',
    icon: ShieldCheck,
    title: 'Risco operacional',
    eyebrow: 'Simulações e cenários',
    intro:
      'Mesmo quando o custo parece controlado, falhas na operação física criam interrupções. A ferramenta estima esse efeito para apoiar uma migração mais planejada.',
    items: [
      'Perdas e reemissões: cartões que precisam ser substituídos.',
      'Cartão recusado: impacto em pagamento, atendimento e retrabalho.',
      'Grupos críticos: áreas com maior chance de falha e maior ganho ao migrar.',
    ],
    calculation:
      'O simulador usa quantidade de cartões ativos e taxa de falha para estimar emissões, custo logístico, plástico envolvido e economia possível.',
  },
]

export default function IntroPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] text-[#111]">
      <header className="fixed inset-x-0 top-0 z-30 border-b border-white/50 bg-white/82 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
          <EdenredLogo compact className="shrink-0" />

          <nav className="flex items-center gap-3">
            <Link
              href="/visualizacao-publica"
              className="hidden h-11 items-center justify-center rounded-full border border-[#ffb4ae] bg-white px-5 text-sm font-black text-[#ff2b1d] shadow-sm transition-all hover:bg-[#fff1ef] sm:inline-flex"
            >
              Criar conta
            </Link>
            <Link
              href="/visualizacao-publica"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#ff2b1d] px-5 text-sm font-black text-white shadow-lg shadow-[#ff2b1d]/20 transition-all hover:-translate-y-0.5 hover:bg-[#e51f13]"
            >
              Entrar
              <ArrowRight size={16} />
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative isolate min-h-screen overflow-hidden pt-20">
        <Image
          src={fotoFundoEdenred}
          alt="Mesa corporativa Edenred"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(245,245,245,0.98)_0%,rgba(245,245,245,0.94)_32%,rgba(245,245,245,0.62)_56%,rgba(245,245,245,0.14)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(0deg,#f5f5f5_0%,rgba(245,245,245,0)_100%)]" />

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl grid-cols-1 items-center px-5 py-12 md:px-8">
          <div className="max-w-[1120px] lg:translate-x-24 xl:translate-x-28">
            <Card0Logo className="h-16 w-auto md:h-20" priority />

            <p className="mt-9 max-w-[1080px] text-3xl font-black leading-[1.08] text-[#111] md:text-[2.65rem] lg:text-[2.85rem] xl:text-[3.35rem]">
              Decida a migração digital com custo, carbono e risco na mesma visão.
            </p>

            <p className="mt-6 max-w-lg text-base font-semibold leading-relaxed text-[#4a4a4a] md:text-lg">
              Uma plataforma Edenred para transformar operações de cartões físicos em decisões mensuráveis, sustentáveis e financeiramente claras.
            </p>

            <div className="mt-9 flex">
              <Link
                href="/visualizacao-publica"
                className="inline-flex h-16 min-w-[280px] items-center justify-center gap-3 rounded-2xl bg-[#ff2b1d] px-10 text-lg font-black text-white shadow-xl shadow-[#ff2b1d]/25 transition-all hover:-translate-y-1 hover:bg-[#e51f13] hover:shadow-2xl hover:shadow-[#ff2b1d]/30"
              >
                Acessar plataforma
                <ArrowRight size={21} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-12 pb-16">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-[#ffe1de] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.14)] md:grid-cols-3">
            {pillars.map((pillar, index) => (
              <a
                key={pillar.title}
                href={pillar.href}
                className={`group p-8 transition-all hover:bg-[#fff7f7] ${index > 0 ? 'border-t border-[#ffe1de] md:border-l md:border-t-0' : ''}`}
              >
                <div className="mb-5 inline-flex rounded-2xl bg-[#ffe5e5] p-3 text-[#ff2b1d]">
                  <pillar.icon size={26} />
                </div>
                <h2 className="text-xl font-black tracking-tight">{pillar.title}</h2>
                <p className="mt-4 text-[15px] font-semibold leading-7 text-[#555]">{pillar.text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[#ff2b1d]">
                  Entenda melhor
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="relative -mt-8 overflow-hidden pb-20 pt-32">
        <Image
          src={mesaFundoEdenred}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-x-0 top-0 h-[440px]">
          <Image
            src={fotoFundoEdenred}
            alt=""
            fill
            className="object-cover object-center opacity-80 [mask-image:linear-gradient(to_bottom,black_0%,rgba(0,0,0,0.78)_34%,transparent_100%)]"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-x-0 top-0 h-56 bg-[linear-gradient(180deg,#f5f5f5_0%,rgba(245,245,245,0.94)_34%,rgba(245,245,245,0.56)_68%,rgba(245,245,245,0)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(245,245,245,0.96)_0%,rgba(245,245,245,0.9)_45%,rgba(245,245,245,0.72)_100%)]" />
        <div className="absolute inset-0 bg-[#ff2b1d]/[0.03]" />

        <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-5 md:px-8">
          {detailSections.map((section) => (
            <article
              key={section.id}
              id={section.id}
              className="scroll-mt-28 rounded-3xl border border-white/70 bg-white/88 p-7 shadow-[0_18px_42px_rgba(0,0,0,0.14)] backdrop-blur-md md:p-9"
            >
              <div className="grid grid-cols-1 gap-7 lg:grid-cols-[260px_1fr]">
                <div>
                  <div className="mb-5 inline-flex rounded-2xl bg-[#ffe5e5] p-3 text-[#ff2b1d]">
                    <section.icon size={30} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-wide text-[#ff2b1d]">{section.eyebrow}</p>
                  <h2 className="mt-2 text-3xl font-black tracking-tight">{section.title}</h2>
                </div>

                <div>
                  <p className="max-w-3xl text-lg font-semibold leading-8 text-[#333]">{section.intro}</p>

                  <div className="mt-7 grid grid-cols-1 gap-3 md:grid-cols-3">
                    {section.items.map((item) => (
                      <div key={item} className="rounded-2xl border border-[#ffe1de] bg-[#fff7f7] p-4 text-sm font-semibold leading-6 text-[#555]">
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl bg-[#111] p-5 text-white">
                    <p className="text-xs font-black uppercase tracking-wide text-[#ffb4ae]">Como calcula</p>
                    <p className="mt-2 text-sm font-semibold leading-7 text-white/85">{section.calculation}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <AuthFooter />
    </main>
  )
}
