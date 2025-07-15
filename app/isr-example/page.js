// ISR 示例页面 - 展示增量静态再生成
import styles from "./page.module.css";

async function getData() {
  // 获取外部 API 数据
  try {
    const res = await fetch("https://api.github.com/users/octocat", {
      next: { revalidate: 30 }, // 每30秒重新验证一次
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return await res.json();
  } catch (error) {
    // 如果 API 失败，返回模拟数据
    return {
      login: "demo-user",
      name: "Demo User",
      public_repos: Math.floor(Math.random() * 100),
      followers: Math.floor(Math.random() * 1000),
      created_at: new Date().toISOString(),
      bio: "这是一个演示用户 (API 调用失败时的备用数据)",
      avatar_url: null,
    };
  }
}

// 获取本地生成的时间数据
async function getLocalData() {
  // 模拟一些需要定期更新的本地数据
  const now = new Date();
  const randomQuote = [
    "代码是诗歌，程序员是诗人。",
    "优秀的代码是自文档化的。",
    "过早的优化是万恶之源。",
    "代码的可读性比聪明更重要。",
    "简单是可靠的前提。",
  ][Math.floor(Math.random() * 5)];

  return {
    generatedAt: now.toLocaleString("zh-CN", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    timestamp: now.getTime(),
    quote: randomQuote,
    randomNumber: Math.floor(Math.random() * 10000),
    pageViews: Math.floor(Math.random() * 50000) + 10000,
  };
}

export default async function ISRExample() {
  // 获取外部数据和本地数据
  const [githubData, localData] = await Promise.all([
    getData(),
    getLocalData(),
  ]);

  return (
    <div className={styles.isrContainer}>
      <div className={styles.contentWrapper}>
        <header className={styles.pageHeader}>
          <h1 className={styles.title}>🔄 ISR 示例页面</h1>
          <p className={styles.subtitle}>
            增量静态再生成 (Incremental Static Regeneration)
          </p>
        </header>

        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <h2>📅 页面生成信息</h2>
            <div className={styles.dataItem}>
              <span className={styles.label}>生成时间:</span>
              <span className={styles.value}>{localData.generatedAt}</span>
            </div>
            <div className={styles.dataItem}>
              <span className={styles.label}>时间戳:</span>
              <span className={styles.value}>{localData.timestamp}</span>
            </div>
            <div className={styles.dataItem}>
              <span className={styles.label}>随机数字:</span>
              <span className={`${styles.value} ${styles.highlight}`}>
                {localData.randomNumber}
              </span>
            </div>
            <div className={styles.dataItem}>
              <span className={styles.label}>页面浏览:</span>
              <span className={styles.value}>
                {localData.pageViews.toLocaleString()}
              </span>
            </div>
          </div>

          <div className={styles.infoCard}>
            <h2>🐙 GitHub 数据 (每30秒更新)</h2>
            <div className={styles.profileContainer}>
              {githubData.avatar_url && (
                <img
                  src={githubData.avatar_url}
                  alt={githubData.name}
                  className={styles.avatar}
                />
              )}
              <div className={styles.profileDetails}>
                <div className={styles.dataItem}>
                  <span className={styles.label}>用户名:</span>
                  <span className={styles.value}>{githubData.login}</span>
                </div>
                <div className={styles.dataItem}>
                  <span className={styles.label}>姓名:</span>
                  <span className={styles.value}>{githubData.name}</span>
                </div>
                <div className={styles.dataItem}>
                  <span className={styles.label}>仓库数:</span>
                  <span className={`${styles.value} ${styles.highlight}`}>
                    {githubData.public_repos}
                  </span>
                </div>
                <div className={styles.dataItem}>
                  <span className={styles.label}>关注者:</span>
                  <span className={`${styles.value} ${styles.highlight}`}>
                    {githubData.followers}
                  </span>
                </div>
                {githubData.bio && (
                  <div className={styles.dataItem}>
                    <span className={styles.label}>简介:</span>
                    <span className={styles.value}>{githubData.bio}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.infoCard}>
            <h2>💡 今日金句</h2>
            <blockquote className={styles.quote}>
              "{localData.quote}"
            </blockquote>
          </div>

          <div className={styles.infoCard}>
            <h2>🎯 ISR 工作原理</h2>
            <ul className={styles.featureList}>
              <li>✅ 页面在构建时预生成 (Static)</li>
              <li>🔄 每30秒检查是否需要更新</li>
              <li>🚀 用户始终看到快速的静态页面</li>
              <li>🔧 后台自动更新数据</li>
              <li>📈 完美平衡性能与新鲜度</li>
            </ul>
          </div>
        </div>

        <div className={styles.actionSection}>
          <h3>🧪 测试 ISR</h3>
          <p>多次刷新页面观察数据变化：</p>
          <ul>
            <li>随机数字会在30秒后改变</li>
            <li>GitHub数据会定期更新</li>
            <li>页面保持快速加载</li>
          </ul>

          <div className={styles.buttonGroup}>
            <a href="/isr-example" className={styles.refreshBtn}>
              🔄 刷新页面
            </a>
            <a href="/" className={styles.homeBtn}>
              🏠 返回首页
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// 设置页面级别的重新验证
export const revalidate = 30; // 30秒后重新验证
