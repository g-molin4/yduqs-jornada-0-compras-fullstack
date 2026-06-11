import { navigateTo } from '../app/routes'
import estacioLogo from '../assets/estacio-logo-cropped.png'

type AppHeaderProps = {
  title?: string
  subtitle?: string
}

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  return (
    <>
      <header className="topbar">
        <div className="container">
          <button
            type="button"
            className="brand brand-button"
            onClick={() => navigateTo('/')}
            aria-label="Ir para a pagina principal"
          >
            <img className="brand__image" src={estacioLogo} alt="Estacio" />
          </button>
        </div>
      </header>

      {title ? (
        <section className="hero-banner">
          <div className="container hero-banner__inner">
            <h1>{title}</h1>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
        </section>
      ) : null}
    </>
  )
}
