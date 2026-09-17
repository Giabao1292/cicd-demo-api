import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const milestones = [['github', true], ['ci', true], ['pages', true], ['quality', true], ['release', true]];
const currentPipelineKeys = ['pullRequest', 'quality', 'i18n', 'reactBuild', 'dockerBuild', 'trivy', 'smokeTest', 'mergeMain', 'pagesDeploy', 'ghcrPublish'];
const pipelineIcons = ['⇄', '✓', '文', '▣', '▦', '⌕', '◉', '↳', '◈', '⬡'];
const deploymentTestKeys = ['pr', 'merge', 'image', 'gitops', 'argo', 'slack'];

export default function App() {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState(() => localStorage.getItem('journal-theme') || 'light');
  const [activePipelineStep, setActivePipelineStep] = useState('pullRequest');
  const done = milestones.filter(([, complete]) => complete).length;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('journal-theme', theme);
  }, [theme]);

  function changeLanguage(language) {
    i18n.changeLanguage(language);
    localStorage.setItem('journal-language', language);
  }

  return (
    <div className="shell">
      <header>
        <a className="brand" href="#top">CICD<span>•</span></a>
        <div className="controls">
          <div className="languages" aria-label={t('languageSelector')}>
            <button className={i18n.language === 'vi' ? 'active' : ''} onClick={() => changeLanguage('vi')}>VI</button>
            <button className={i18n.language === 'en' ? 'active' : ''} onClick={() => changeLanguage('en')}>EN</button>
          </div>
          <button className="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={t('themeToggle')} title={t('themeToggle')}>
            <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <p className="eyebrow">{t('label')}</p>
          <h1>{t('titleA')} <em>{t('titleB')}</em></h1>
          <p className="intro">{t('intro')}</p>
          <div className="live"><i /> {t('live')}</div>
        </section>

        <section className="pipeline" aria-labelledby="pipeline-title">
          <div className="section-heading">
            <div><p className="eyebrow">LIVE PIPELINE</p><h2 id="pipeline-title">{t('interactivePipeline.title')}</h2></div>
            <span>{t('interactivePipeline.caption')}</span>
          </div>
          <p className="pipeline-instruction">{t('interactivePipeline.instruction')}</p>
          <div className="pipeline-phase-labels" aria-hidden="true"><span>{t('interactivePipeline.ciPhase')}</span><span>{t('interactivePipeline.cdPhase')}</span></div>
          <div className="interactive-pipeline-map">
            {currentPipelineKeys.map((key, index) => (
              <button
                className={`pipeline-node ${activePipelineStep === key ? 'active' : ''} ${index >= 7 ? 'after-merge' : ''}`}
                key={key}
                onClick={() => setActivePipelineStep(key)}
                aria-pressed={activePipelineStep === key}
              >
                <span className="pipeline-node-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="pipeline-node-icon" aria-hidden="true">{pipelineIcons[index]}</span>
                <span>{t(`interactivePipeline.steps.${key}.title`)}</span>
              </button>
            ))}
          </div>
          <article className="pipeline-detail" aria-live="polite">
            <div className="pipeline-detail-heading">
              <span className="pipeline-detail-icon" aria-hidden="true">{pipelineIcons[currentPipelineKeys.indexOf(activePipelineStep)]}</span>
              <div><p className="eyebrow">{t('interactivePipeline.selectedStep')}</p><h3>{t(`interactivePipeline.steps.${activePipelineStep}.title`)}</h3></div>
            </div>
            <p>{t(`interactivePipeline.steps.${activePipelineStep}.purpose`)}</p>
            <div className="pipeline-detail-meta">
              <p><b>{t('interactivePipeline.triggerLabel')}</b>{t(`interactivePipeline.steps.${activePipelineStep}.trigger`)}</p>
              <p><b>{t('interactivePipeline.failureLabel')}</b>{t(`interactivePipeline.steps.${activePipelineStep}.failure`)}</p>
            </div>
          </article>
          <p className="pipeline-note"><b>{t('pipelineRuleLabel')}</b> {t('pipelineRule')}</p>
        </section>

        <section className="deployment-guide" aria-labelledby="deployment-guide-title">
          <div className="section-heading">
            <div><p className="eyebrow">HANDS-ON RUNBOOK</p><h2 id="deployment-guide-title">{t('deploymentGuide.title')}</h2></div>
            <span>{t('deploymentGuide.caption')}</span>
          </div>
          <p className="deployment-guide-intro">{t('deploymentGuide.intro')}</p>
          <div className="test-flow">
            {deploymentTestKeys.map((key, index) => (
              <article className="test-step" key={key}>
                <span className="test-step-number">{String(index + 1).padStart(2, '0')}</span>
                <h3>{t(`deploymentGuide.steps.${key}.title`)}</h3>
                <p>{t(`deploymentGuide.steps.${key}.action`)}</p>
                <small>{t(`deploymentGuide.steps.${key}.proof`)}</small>
              </article>
            ))}
          </div>
          <article className="truth-panel">
            <div><p className="eyebrow">{t('deploymentGuide.currentStateLabel')}</p><h3>{t('deploymentGuide.currentStateTitle')}</h3></div>
            <p>{t('deploymentGuide.currentState')}</p>
          </article>
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
