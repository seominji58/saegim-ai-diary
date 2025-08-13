import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // 브랜드 컬러: Sage Green 10단계 그라데이션
        sage: {
          10: "#F7F9F8",
          20: "#EDF2EE",
          30: "#DFE8E1",
          40: "#C9D6CB",
          50: "#B2C5B8", // Primary Brand Color
          60: "#9BB5A2",
          70: "#84A68C",
          80: "#6D9676",
          90: "#568660",
          100: "#3F764A",
        },

        // 의미론적 토큰 - Interactive
        interactive: {
          primary: "#B2C5B8", // sage-50
          "primary-hover": "#9BB5A2", // sage-60
          "primary-active": "#84A68C", // sage-70
          "primary-disabled": "#C9D6CB", // sage-40
          secondary: "#EDF2EE", // sage-20
          tertiary: "#F7F9F8", // sage-10
        },

        // Background 토큰
        background: {
          primary: "#FDFDFD", // off-white
          secondary: "#F7F9F8", // sage-10
          tertiary: "#EDF2EE", // sage-20
          hover: "#DFE8E1", // sage-30
          selected: "#C9D6CB", // sage-40
          brand: "#B2C5B8", // sage-50
          // 다크모드
          "dark-primary": "#1A1E1C", // 다크모드 기본 배경
          "dark-secondary": "#232822", // 다크모드 보조 배경
          "dark-tertiary": "#2C322B", // 다크모드 3단계 배경
          "dark-hover": "#343A33", // 다크모드 호버 배경
          "dark-selected": "#3C443B", // 다크모드 선택 배경
          "dark-brand": "#8FB59C", // 다크모드 브랜드 컬러
        },

        // Text 토큰
        text: {
          primary: "#6D7275", // medium-gray
          secondary: "#9CA3AF", // light-gray
          placeholder: "#D1D5DB", // placeholder
          "on-color": "#FFFFFF", // white
          "on-brand": "#3F764A", // sage-100
          inverse: "#111827", // dark
          // 다크모드
          "dark-primary": "#E5E7E6", // 다크모드 기본 텍스트
          "dark-secondary": "#B8BAB9", // 다크모드 보조 텍스트
          "dark-placeholder": "#8A8C8B", // 다크모드 플레이스홀더
          "dark-on-color": "#1A1E1C", // 다크모드 배경 위 텍스트
          "dark-on-brand": "#E5E7E6", // 다크모드 브랜드 컬러 위 텍스트
          "dark-inverse": "#FFFFFF", // 다크모드 반전 텍스트
        },

        // Border 토큰
        border: {
          subtle: "#EDF2EE", // sage-20
          strong: "#C9D6CB", // sage-40
          interactive: "#B2C5B8", // sage-50
          focus: "#84A68C", // sage-70
          inverse: "#3F764A", // sage-100
          // 다크모드
          "dark-subtle": "#2C322B", // 다크모드 연한 테두리
          "dark-strong": "#3C443B", // 다크모드 진한 테두리
          "dark-interactive": "#8FB59C", // 다크모드 상호작용 테두리
          "dark-focus": "#A3C4B0", // 다크모드 포커스 테두리
          "dark-inverse": "#E5E7E6", // 다크모드 반전 테두리
        },

        // 감정별 색상 시스템
        emotion: {
          happy: "#E6C55A", // Soft Gold
          "happy-secondary": "#F5F0DB",
          "happy-bg": "#FAF7E8",

          sad: "#6B8AC7", // Calm Blue
          "sad-secondary": "#E8EEF7",
          "sad-bg": "#F2F6FB",

          angry: "#D67D5C", // Warm Orange
          "angry-secondary": "#F3E5E0",
          "angry-bg": "#F8F0EC",

          peaceful: "#7DB87D", // Natural Green
          "peaceful-secondary": "#E8F0E8",
          "peaceful-bg": "#F0F7F0",

          worried: "#E6B366", // Gentle Orange
          "worried-secondary": "#F5EBDC",
          "worried-bg": "#FAF4E8",
        },

        // 시스템 컬러
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",

        // 보조 컬러 팔레트
        "off-white": "#FDFDFD",
        "medium-gray": "#6D7275",
        "pale-lavender": "#D2D4E1",
        "ivory-cream": "#F9F5EF",
        "soft-rose": "#E8C4C0",

        // 그레이 스케일
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
      },

      fontFamily: {
        // 기본 폰트 스택
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
        serif: ["Noto Serif KR", "Georgia", "serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],

        // AI 생성 글귀용 폰트
        poetic: ["Nanum Myeongjo", "Noto Serif KR", "serif"],
        handwriting: ["Nanum Pen Script", "cursive"],
      },

      fontSize: {
        // 타이포그래피 스케일
        h1: ["32px", { lineHeight: "40px" }],
        h2: ["24px", { lineHeight: "32px" }],
        h3: ["20px", { lineHeight: "28px" }],
        h4: ["18px", { lineHeight: "24px" }],
        "body-large": ["16px", { lineHeight: "24px" }],
        body: ["14px", { lineHeight: "20px" }],
        "body-small": ["12px", { lineHeight: "16px" }],
        caption: ["10px", { lineHeight: "14px" }],
      },

      spacing: {
        "18": "4.5rem",
        "88": "22rem",
      },

      borderRadius: {
        "4xl": "2rem",
      },

      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "fade-out": "fadeOut 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "bounce-gentle": "bounceGentle 2s infinite",
        "emotion-pulse": "emotionPulse 0.6s ease-out",
        "page-transition": "pageTransition 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(-5%)" },
          "50%": { transform: "translateY(0)" },
        },
        emotionPulse: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
        pageTransition: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },

      screens: {
        xs: "475px",
      },

      boxShadow: {
        emotion: "0 4px 12px rgba(0, 0, 0, 0.1)",
        "emotion-hover": "0 6px 16px rgba(0, 0, 0, 0.15)",
        card: "0 1px 3px rgba(0, 0, 0, 0.1)",
        "card-hover": "0 4px 12px rgba(0, 0, 0, 0.15)",
        "diary-card": "0 2px 8px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
