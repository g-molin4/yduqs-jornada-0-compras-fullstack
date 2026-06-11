import { CircleHelp, MessageCircle, Phone } from 'lucide-react'
import estacioLogo2 from '../assets/estacio-logo2.png'
import { Separator } from './ui/separator'

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

type AppFooterProps = {
  variant?: 'compact' | 'full'
}

export function AppFooter({ variant = 'full' }: AppFooterProps) {
  if (variant === 'compact') {
    return (
      <footer className="site-footer site-footer--compact">
        <div className="container site-footer__compact-inner">
          <div className="site-footer__compact-actions">
            <a href="tel:08007715055" className="footer-pill">
              <Phone size={15} />
              <span>0800 771 5055</span>
            </a>
            <a href="/" className="footer-pill footer-pill--whatsapp">
              <MessageCircle size={15} />
              <span>Precisa de ajuda?</span>
            </a>
          </div>

          <div className="site-footer__compact-meta">
            <a href="/">Politica de privacidade</a>
            <span>|</span>
            <span>Estacio Brasil - Todos os direitos reservados</span>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <div className="container site-footer__top-inner">
          <div className="brand brand--footer">
            <img className="brand__image" src={estacioLogo2} alt="Estacio" />
          </div>
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
        <div className="footer-mobile-groups" aria-label="Links do rodape">
          {footerGroups.map((group) => (
            <details className="footer-mobile-group" key={group.title}>
              <summary className="footer-mobile-group__summary">
                <span>{group.title}</span>
                <span className="footer-mobile-group__icon" aria-hidden="true">
                  ˅
                </span>
              </summary>

              <ul className="footer-mobile-group__links">
                {group.links.map((link) => (
                  <li key={link}>
                    <a href="/">{link}</a>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>

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
  )
}
