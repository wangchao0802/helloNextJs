"use client";

// 虽然这是Next.js路由，但我们可以让它看起来像纯HTML页面
export default function HTMLRouteTest() {
  return (
    <div className="retro-page">
      <div className="retro-container">
        <h1 className="neon-title dancing-text">🌈 复古HTML测试页面</h1>

        <div className="retro-card">
          <h2>🎪 这是通过Next.js路由的页面</h2>
          <p>虽然这是一个Next.js页面，但我们可以让它看起来像纯HTML！</p>
          <div
            style={{
              background: "rgba(0,0,0,0.1)",
              padding: "1rem",
              borderRadius: "8px",
              fontFamily: "monospace",
            }}
          >
            路径: <strong>/html-route-test</strong>
            <br />
            文件: <strong>app/html-route-test/page.js</strong>
            <br />
            类型: <strong>Next.js Client Component</strong>
          </div>
        </div>

        <div className="retro-card">
          <h3>🎮 互动测试</h3>
          <div className="button-grid">
            <button
              className="pixel-button"
              onClick={() => alert("Hello from Next.js路由! 🚀")}
            >
              点击测试
            </button>
            <button
              className="pixel-button"
              onClick={() => {
                document.body.style.background = `linear-gradient(45deg, 
                hsl(${Math.random() * 360}, 70%, 80%) 0%, 
                hsl(${Math.random() * 360}, 70%, 90%) 100%)`;
              }}
            >
              随机背景
            </button>
            <button
              className="pixel-button"
              onClick={() => {
                const title = document.querySelector(".neon-title");
                title.style.animation = "none";
                setTimeout(
                  () =>
                    (title.style.animation =
                      "glow 0.5s ease-in-out infinite alternate"),
                  10
                );
              }}
            >
              重启动画
            </button>
          </div>
        </div>

        <div className="retro-card">
          <h3>🔗 导航链接</h3>
          <a
            href="/"
            className="pixel-button"
            style={{ textDecoration: "none" }}
          >
            返回首页
          </a>
          <a
            href="/test.html"
            className="pixel-button"
            style={{
              textDecoration: "none",
              background: "#4ecdc4",
              boxShadow: "4px 4px 0px #00b894",
            }}
          >
            纯HTML页面
          </a>
          <a
            href="/api-test.html"
            className="pixel-button"
            style={{
              textDecoration: "none",
              background: "#a29bfe",
              boxShadow: "4px 4px 0px #6c5ce7",
            }}
          >
            API测试工具
          </a>
        </div>
      </div>

      <style jsx>{`
        .retro-page {
          font-family: "Comic Sans MS", cursive, sans-serif;
          margin: 0;
          padding: 0;
          background: linear-gradient(
            45deg,
            #ff9a9e 0%,
            #fecfef 50%,
            #fecfef 100%
          );
          color: #333;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .retro-container {
          max-width: 800px;
          padding: 2rem;
          text-align: center;
        }

        .neon-title {
          font-size: 3rem;
          margin-bottom: 1rem;
          text-shadow: 0 0 20px #ff6b6b, 0 0 30px #ff6b6b, 0 0 40px #ff6b6b;
          animation: glow 2s ease-in-out infinite alternate;
        }

        @keyframes glow {
          from {
            text-shadow: 0 0 20px #ff6b6b, 0 0 30px #ff6b6b, 0 0 40px #ff6b6b;
          }
          to {
            text-shadow: 0 0 30px #ff6b6b, 0 0 40px #ff6b6b, 0 0 50px #ff6b6b;
          }
        }

        .dancing-text {
          animation: glow 2s ease-in-out infinite alternate,
            dance 3s ease-in-out infinite;
        }

        @keyframes dance {
          0%,
          100% {
            transform: translateY(0px);
          }
          25% {
            transform: translateY(-10px);
          }
          50% {
            transform: translateY(0px);
          }
          75% {
            transform: translateY(-5px);
          }
        }

        .retro-card {
          background: rgba(255, 255, 255, 0.9);
          border: 3px solid #ff6b6b;
          border-radius: 15px;
          padding: 2rem;
          margin: 1rem 0;
          box-shadow: 8px 8px 0px #ff9a9e;
          transform: rotate(-1deg);
          transition: transform 0.3s ease;
        }

        .retro-card:hover {
          transform: rotate(0deg) scale(1.02);
        }

        .retro-card:nth-child(even) {
          transform: rotate(1deg);
          border-color: #4ecdc4;
          box-shadow: 8px 8px 0px #95e1d3;
        }

        .retro-card:nth-child(even):hover {
          transform: rotate(0deg) scale(1.02);
        }

        .button-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .pixel-button {
          background: #ff6b6b;
          border: none;
          color: white;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: bold;
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 4px 4px 0px #e55656;
          transition: all 0.1s ease;
          font-family: "Comic Sans MS", cursive, sans-serif;
          text-decoration: none;
          display: inline-block;
          margin: 0.5rem;
        }

        .pixel-button:hover {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0px #e55656;
        }

        .pixel-button:active {
          transform: translate(4px, 4px);
          box-shadow: none;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
          .retro-container {
            padding: 1rem;
          }

          .neon-title {
            font-size: 2rem;
          }

          .retro-card {
            padding: 1rem;
            margin: 0.5rem 0;
          }

          .button-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
