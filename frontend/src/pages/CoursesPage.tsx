import { useEffect, useState } from 'react'
import { CircleHelp, MessageCircle, Phone } from 'lucide-react'
import estacioLogo from '../assets/estacio-logo-cropped.png'
import estacioLogo2 from '../assets/estacio-logo2.png'
import { CourseCard } from '../components/CourseCard'
import { ErrorMessage } from '../components/ErrorMessage'
import { Loading } from '../components/Loading'
import { Separator } from '../components/ui/separator'
import { useEnrollment } from '../contexts/EnrollmentContext'
import { getCourses } from '../services/coursesService'
import type { CourseOffer } from '../types/course'

const footerGroups = [
  {
    title: 'A ESTACIO',
    links: [
      'Sobre a Estacio',
      'Unidades',
      'Sustentabilidade',
      'Regulamentos',
      'Instituicoes de Ensino',
      'Trabalhe na Estacio',
      'Convenios com Empresas',
      'Seja Parceiro',
      'Seja Fornecedor',
      'Imprensa',
    ],
  },
  {
    title: 'ESTUDE NA ESTACIO',
    links: [
      'Por que nossa graduacao?',
      'Por que nossas pos?',
      'Bolsas e financiamentos',
      'Carreiras',
      'Modelos de Ensino',
      'Formas de ingresso',
      'DIS',
      'Internacionalizacao',
      'Clube do aluno',
      'Informacoes e-MEC',
    ],
  },
  {
    title: 'CURSOS',
    links: ['Graduacao', 'Pos graduacao', 'Cursos Livres'],
  },
  {
    title: 'INSCREVA-SE',
    links: [
      'Vestibular',
      'Enem',
      'Transferencia',
      '2a Graduacao',
      'Pos-Graduacao',
      'Mestrado e Doutorado',
      'Cursos livres',
    ],
  },
  {
    title: 'AREA DO ALUNO',
    links: ['Acessar area do aluno', 'Aplicativo na App Store', 'Aplicativo na Google Play'],
  },
  {
    title: 'PARA COMECAR',
    links: ['Dicas de Estudo', 'Ensino Digital', 'Mercado de Trabalho', 'Sou calouro', 'Por que Estacio?'],
  },
  {
    title: 'REDES SOCIAIS',
    links: ['Instagram', 'Facebook', 'Linkedin', 'Youtube'],
  },
  {
    title: 'FALE COM A GENTE',
    links: ['Atendimento', 'Ouvidoria'],
  },
]

type EstacioMarkProps = {
  footer?: boolean
}

function EstacioMark({ footer = false }: EstacioMarkProps) {
  return (
    <div className={`brand${footer ? ' brand--footer' : ''}`}>
      <img className="brand__image" src={footer ? estacioLogo2 : estacioLogo} alt="Estacio" />
    </div>
  )
}

export function CoursesPage() {
  const [courses, setCourses] = useState<CourseOffer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { setSelectedCourse } = useEnrollment()

  useEffect(() => {
    async function loadCourses() {
      try {
        setIsLoading(true)
        setError(null)
        const response = await getCourses()
        setCourses(response)
      } catch {
        setError('Nao foi possivel carregar os cursos agora.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadCourses()
  }, [])

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="container">
          <EstacioMark />
        </div>
      </header>

      <main className="page-content">
        <section className="hero-banner">
          <div className="container hero-banner__inner">
            <h1>Vamos comecar, escolha as opcoes do seu curso</h1>
            <p>Use os filtros para saber o preco do seu curso e fazer sua inscricao.</p>
          </div>
        </section>

        <section className="options-section">
          <div className="container">
            <p className="results-copy">{courses.length} opcoes encontradas</p>
            {isLoading ? <Loading /> : null}
            {error ? <ErrorMessage message={error} /> : null}
            {!isLoading && !error ? (
              <div className="options-grid">
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onAdvance={(selected) => setSelectedCourse(selected)}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-footer__top">
          <div className="container site-footer__top-inner">
            <EstacioMark footer />
            <div className="site-footer__actions">
              <a href="tel:08007715055" className="footer-pill">
                <Phone size={15} />
                <span>0800 771 5055</span>
              </a>
              <a href="/" className="footer-pill footer-pill--whatsapp">
                <MessageCircle size={15} />
                <span>Precisa de ajuda?</span>
              </a>
            </div>
          </div>
        </div>

        <div className="container site-footer__content">
          <div className="footer-grid">
            {footerGroups.map((group) => (
              <section className="footer-column" key={group.title}>
                <h2>{group.title}</h2>
                <ul>
                  {group.links.map((link) => (
                    <li key={link}>
                      <a href="/">{link}</a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <Separator className="footer-separator" />

          <div className="footer-meta">
            <div className="footer-meta__links">
              <a href="/">Politica de privacidade</a>
              <a href="/">Codigo de Etica</a>
              <a href="/">Preferencias de cookies</a>
              <a href="/">Mapa do site</a>
            </div>

            <aside className="footer-emec">
              <p>Consulte aqui o cadastro da instituicao no Sistema e-MEC</p>
              <div className="footer-emec__qr" aria-hidden="true">
                <div className="footer-emec__badge">e-MEC</div>
                <div className="footer-emec__code" />
                <span>ACESSE JA</span>
              </div>
            </aside>
          </div>

          <Separator className="footer-separator footer-separator--bottom" />

          <div className="footer-bottom">
            <span>Estacio Brasil - Todos os direitos reservados</span>
            <a href="/" className="footer-help">
              <CircleHelp size={15} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
