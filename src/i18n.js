import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  vi: { translation: {
    label: 'NHẬT KÝ HỌC CI/CD',
    titleA: 'Học bằng cách', titleB: 'xây thật.',
    intro: 'Mỗi lần hoàn thành một bước, dự án này nhận thêm một thay đổi, một commit và một bản deploy mới.',
    live: 'Đang deploy từ GitHub Pages',
    languageSelector: 'Chọn ngôn ngữ',
    themeToggle: 'Chuyển giao diện sáng hoặc tối',
    pipelineTitle: 'Pipeline hiện tại hoạt động thế nào?',
    pipelineCaption: 'PR được kiểm tra trước, chỉ main được deploy',
    pipelineRuleLabel: 'Quy tắc:',
    pipelineRule: 'Không có CI xanh thì không merge được. Chỉ khi PR được merge vào main, CD mới deploy GitHub Pages.',
    roadmap: 'Roadmap thực hành',
    completed: 'Hoàn thành', planned: 'Sắp tới',
    completedCount: '{{done}} / {{total}} mốc đã hoàn thành',
    principleTitle: 'Quy tắc của lab này',
    principle: 'Không học CI/CD chỉ bằng sơ đồ. Mỗi khái niệm cần có một commit, workflow run hoặc deploy thật để kiểm chứng.',
    footer: 'Được xây và deploy cùng GitHub Actions.',
    steps: {
      github: { title: 'GitHub & repository', detail: 'Push source lên main và theo dõi lịch sử commit.' },
      ci: { title: 'Continuous Integration', detail: 'GitHub Actions kiểm tra và build React mỗi khi code thay đổi.' },
      pages: { title: 'Continuous Deployment', detail: 'Build pass thì GitHub Pages tự deploy bản mới.' },
      quality: { title: 'Quality gate', detail: 'Thêm lint, test và branch protection trước khi merge.' },
      release: { title: 'Release workflow', detail: 'Thêm version, changelog và môi trường deploy rõ ràng.' }
    },
    pipeline: {
      branch: { title: 'Feature branch', detail: 'Code mới bắt đầu ngoài main.' },
      pullRequest: { title: 'Pull request', detail: 'Gửi thay đổi để review và kiểm tra.' },
      ciCheck: { title: 'CI checks', detail: 'GitHub Actions cài dependencies và build React.' },
      merge: { title: 'Merge main', detail: 'Chỉ mở khóa khi Build React app xanh.' },
      deploy: { title: 'CD deploy', detail: 'Workflow push main tạo bản production.' },
      pages: { title: 'GitHub Pages', detail: 'Website tĩnh được cập nhật cho người xem.' }
    }
  } },
  en: { translation: {
    label: 'CI/CD LEARNING JOURNAL',
    titleA: 'Learn by', titleB: 'building.',
    intro: 'Every completed step gives this project a new change, a new commit, and a newly deployed version.',
    live: 'Deploying from GitHub Pages',
    languageSelector: 'Choose language',
    themeToggle: 'Toggle light or dark theme',
    pipelineTitle: 'How does the current pipeline work?',
    pipelineCaption: 'PR is checked first; only main is deployed',
    pipelineRuleLabel: 'Rule:',
    pipelineRule: 'No green CI, no merge. Only a PR merged into main can trigger the GitHub Pages CD deployment.',
    roadmap: 'Hands-on roadmap',
    completed: 'Completed', planned: 'Up next',
    completedCount: '{{done}} / {{total}} milestones completed',
    principleTitle: 'The rule of this lab',
    principle: 'Do not learn CI/CD only from diagrams. Every concept must have a commit, workflow run, or real deployment as proof.',
    footer: 'Built and deployed with GitHub Actions.',
    steps: {
      github: { title: 'GitHub & repository', detail: 'Push source to main and follow the commit history.' },
      ci: { title: 'Continuous Integration', detail: 'GitHub Actions checks and builds React whenever code changes.' },
      pages: { title: 'Continuous Deployment', detail: 'When the build passes, GitHub Pages deploys a new version.' },
      quality: { title: 'Quality gate', detail: 'Add linting, testing, and branch protection before merges.' },
      release: { title: 'Release workflow', detail: 'Add versions, changelogs, and explicit deployment environments.' }
    },
    pipeline: {
      branch: { title: 'Feature branch', detail: 'New code starts outside main.' },
      pullRequest: { title: 'Pull request', detail: 'Submit the change for review and checks.' },
      ciCheck: { title: 'CI checks', detail: 'GitHub Actions installs dependencies and builds React.' },
      merge: { title: 'Merge main', detail: 'Unlocked only after Build React app is green.' },
      deploy: { title: 'CD deploy', detail: 'The main push workflow creates a production build.' },
      pages: { title: 'GitHub Pages', detail: 'The static website updates for visitors.' }
    }
  } },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('journal-language') || 'vi',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
