import { useTranslation } from 'react-i18next';

const milestones = [
  ['github', true],
  ['ci', true],
  ['pages', true],
  ['quality', false],
  ['release', false],
];

export default function App() {
  const { t, i18n } = useTranslation();
  const done = milestones.filter(([, complete]) => complete).length;

  function changeLanguage(language) {
    i18n.changeLanguage(language);
    localStorage.setItem('journal-language', language);
  }

  return (
    <div className="shell">
      <header>
        <a className="brand" href="#top">CICD<span>•</span></a>
        <div className="languages" aria-label="Language selector">
          <button className={i18n.language === 'vi' ? 'active' : ''} onClick={() => changeLanguage('vi')}>VI</button>
          <button className={i18n.language === 'en' ? 'active' : ''} onClick={() => changeLanguage('en')}>EN</button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <p className="eyebrow">{t('label')}</p>
          <h1>{t('titleA')} <em>{t('titleB')}</em></h1>
          <p className="intro">{t('intro')}</p>
          <div className="live"><i /> {t('live')}</div>
        </section>

        <section className="roadmap" aria-labelledby="roadmap-title">
          <div className="section-heading">
            <div><p className="eyebrow">01 — 05</p><h2 id="roadmap-title">{t('roadmap')}</h2></div>
            <span>{t('completedCount', { done, total: milestones.length })}</span>
          </div>
          <div className="cards">
            {milestones.map(([key, complete], index) => (
              <article className={`card ${complete ? 'complete' : ''}`} key={key}>
                <div className="card-top"><span>0{index + 1}</span><b>{complete ? t('completed') : t('planned')}</b></div>
                <h3>{t(`steps.${key}.title`)}</h3>
                <p>{t(`steps.${key}.detail`)}</p>
              </article>
            ))}
          </div>
        </section>

        <aside>
          <p className="eyebrow">NOTE TO SELF</p>
          <h2>{t('principleTitle')}</h2>
          <p>{t('principle')}</p>
        </aside>
      </main>
      <footer>{t('footer')} <span>{new Date().getFullYear()}</span></footer>
    </div>
  );
}
