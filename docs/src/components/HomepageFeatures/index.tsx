import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  emoji: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: '🚀 开箱即用',
    emoji: '🚀',
    description: (
      <>
        无需复杂配置，安装即可使用。支持 ES5 和部分 ES2015+ 语法，
        让你的 JavaScript 代码在安全的沙箱环境中运行。
      </>
    ),
  },
  {
    title: '🔒 安全沙箱',
    emoji: '🔒',
    description: (
      <>
        提供完全隔离的执行环境，防止恶意代码访问宿主环境。
        支持自定义全局对象和上下文，确保代码执行的安全性。
      </>
    ),
  },
  {
    title: '📚 标准兼容',
    emoji: '📚',
    description: (
      <>
        严格遵循 ECMAScript 规范实现，支持完整的 ES5 语法特性，
        以及 let/const、箭头函数、解构赋值等现代 JavaScript 特性。
      </>
    ),
  },
];

function Feature({title, emoji, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <div className={styles.featureEmoji}>{emoji}</div>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}