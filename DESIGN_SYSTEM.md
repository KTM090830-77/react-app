# 🎨 UI/UX Design System 업그레이드 가이드

귀사의 React 애플리케이션의 UI/UX가 완전히 현대화되었습니다. 이 가이드는 새로운 디자인 시스템을 설명합니다.

## 📋 목차
1. [색상 시스템](#색상-시스템)
2. [타이포그래피](#타이포그래피)
3. [간격 및 크기](#간격-및-크기)
4. [컴포넌트](#컴포넌트)
5. [유틸리티 클래스](#유틸리티-클래스)
6. [애니메이션](#애니메이션)

---

## 색상 시스템

새로운 색상 시스템은 CSS 변수로 정의되어 있습니다 (`src/styles/variables.css`).

### 기본 색상 팔레트
- **Primary (파란색)**: 메인 액션과 하이라이트
  - `--primary-500`: #3b82f6
  - `--primary-600`: #2563eb
  - `--primary-700`: #1d4ed8

- **Success (초록색)**: 성공, 완료, 승인
  - `--success-500`: #22c55e
  - `--success-600`: #16a34a

- **Warning (노란색)**: 경고, 주의
  - `--warning-500`: #eab308
  - `--warning-600`: #ca8a04

- **Error (빨간색)**: 오류, 위험
  - `--error-500`: #ef4444
  - `--error-600`: #dc2626

- **Neutral (회색)**: 배경, 테두리, 텍스트
  - `--neutral-100` ~ `--neutral-900`

### 의미론적 색상
```css
--bg-primary: #ffffff;      /* 메인 배경 */
--bg-secondary: #f9fafb;    /* 페이지 배경 */
--bg-tertiary: #f3f4f6;     /* 섹션 배경 */

--text-primary: #111827;    /* 주 텍스트 */
--text-secondary: #6b7280;  /* 보조 텍스트 */
--text-tertiary: #9ca3af;   /* 약한 텍스트 */
--text-inverse: #ffffff;    /* 반전 텍스트 */
```

---

## 타이포그래피

### 폰트 스택
```css
font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
```

### 크기 시스템
- `--font-size-xs`: 0.75rem (12px)
- `--font-size-sm`: 0.875rem (14px)
- `--font-size-base`: 1rem (16px)
- `--font-size-lg`: 1.125rem (18px)
- `--font-size-xl`: 1.25rem (20px)
- `--font-size-2xl`: 1.5rem (24px)
- `--font-size-3xl`: 1.875rem (30px)
- `--font-size-4xl`: 2.25rem (36px)

### 폰트 굵기
- `--font-weight-light`: 300
- `--font-weight-regular`: 400
- `--font-weight-medium`: 500
- `--font-weight-semibold`: 600
- `--font-weight-bold`: 700

### 줄 높이
- `--line-height-tight`: 1.25
- `--line-height-normal`: 1.5
- `--line-height-relaxed`: 1.75

---

## 간격 및 크기

### 스페이싱 시스템 (8px 기반)
```css
--space-0: 0
--space-1: 0.25rem (4px)
--space-2: 0.5rem (8px)
--space-3: 0.75rem (12px)
--space-4: 1rem (16px)
--space-6: 1.5rem (24px)
--space-8: 2rem (32px)
--space-10: 2.5rem (40px)
--space-12: 3rem (48px)
--space-16: 4rem (64px)
--space-20: 5rem (80px)
--space-24: 6rem (96px)
```

### 테두리 반경
```css
--radius-none: 0
--radius-sm: 0.375rem (6px)
--radius-md: 0.5rem (8px)
--radius-lg: 0.75rem (12px)
--radius-xl: 1rem (16px)
--radius-2xl: 1.5rem (24px)
--radius-full: 9999px
```

---

## 컴포넌트

### 버튼

#### 기본 사용
```html
<!-- Primary Button -->
<button class="btn btn-primary">
  클릭하기
</button>

<!-- Secondary Button -->
<button class="btn btn-secondary">
  취소
</button>

<!-- Outline Button -->
<button class="btn btn-outline">
  선택사항
</button>

<!-- Danger Button -->
<button class="btn btn-danger">
  삭제
</button>
```

#### 크기 옵션
```html
<button class="btn btn-sm btn-primary">작은 버튼</button>
<button class="btn btn-md btn-primary">중간 버튼</button> <!-- 기본 -->
<button class="btn btn-lg btn-primary">큰 버튼</button>
<button class="btn btn-xl btn-primary">매우 큰 버튼</button>
```

### 카드

```html
<div class="card">
  <h3>카드 제목</h3>
  <p>카드 내용</p>
</div>
```

### 폼 입력 요소

```html
<form class="form">
  <div class="form-group">
    <label for="email">이메일</label>
    <input type="email" id="email" class="form-input" />
  </div>
  
  <div class="form-row cols-2">
    <div class="form-group">
      <label>이름</label>
      <input class="form-input" />
    </div>
    <div class="form-group">
      <label>성</label>
      <input class="form-input" />
    </div>
  </div>

  <div class="form-actions">
    <button class="btn btn-secondary">취소</button>
    <button class="btn btn-primary">저장</button>
  </div>
</form>
```

### 뱃지

```html
<!-- 상태 뱃지 -->
<span class="badge badge-success">완료</span>
<span class="badge badge-warning">진행중</span>
<span class="badge badge-error">오류</span>
<span class="badge badge-info">알림</span>
```

---

## 유틸리티 클래스

### Flex 레이아웃
```html
<div class="flex">항목 1</div>
<div class="flex-col">세로 배열</div>
<div class="flex-center">중앙 정렬</div>
<div class="flex-between">양쪽 정렬</div>
<div class="gap-4">간격 4 (1rem)</div>
```

### Grid 레이아웃
```html
<!-- 자동 응답형 그리드 -->
<div class="grid grid-cols-auto gap-6">
  <div class="card">...</div>
  <div class="card">...</div>
</div>

<!-- 고정 열 -->
<div class="grid grid-cols-3 gap-4">
  <div>항목 1</div>
  <div>항목 2</div>
  <div>항목 3</div>
</div>
```

### 패딩/마진
```html
<div class="p-6">패딩 1.5rem</div>
<div class="px-6">좌우 패딩</div>
<div class="py-4">상하 패딩</div>
<div class="m-4">마진 1rem</div>
<div class="mb-6">하단 마진</div>
<div class="mx-auto">가운데 정렬</div>
```

### 텍스트
```html
<div class="text-center">중앙 정렬</div>
<div class="text-left">좌측 정렬</div>
<div class="truncate">길이 자르기...</div>
```

---

## 애니메이션

### 사용 가능한 애니메이션

```html
<!-- Fade In/Out -->
<div class="fade-in">페이드인</div>
<div class="fade-out">페이드아웃</div>

<!-- Slide In -->
<div class="slide-in-up">위에서 올라옴</div>
<div class="slide-in-down">위에서 내려옴</div>
<div class="slide-in-left">왼쪽에서 들어옴</div>
<div class="slide-in-right">오른쪽에서 들어옴</div>

<!-- Scale -->
<div class="scale-in">확대됨</div>
<div class="scale-out">축소됨</div>

<!-- Special Effects -->
<div class="bounce">통통 튐</div>
<div class="pulse">맥박</div>
<div class="spin">회전</div>
<div class="wobble">흔들림</div>
<div class="glow">글로우</div>

<!-- Hover Effects -->
<button class="hover-lift">호버시 들림</button>
<div class="hover-scale">호버시 확대</div>
<div class="hover-opacity">호버시 투명</div>
```

### 트랜지션
```html
<div class="transition-all">모든 변화 부드럽게</div>
<div class="transition-fast">빠른 트랜지션 (150ms)</div>
<div class="transition-slow">느린 트랜지션 (300ms)</div>
<div class="transition-colors">색상만 변화</div>
<div class="transition-transform">위치만 변화</div>
```

---

## 그림자 시스템

```css
--shadow-xs: 가장 약한 그림자
--shadow-sm: 약한 그림자
--shadow-md: 중간 그림자
--shadow-lg: 강한 그림자
--shadow-xl: 매우 강한 그림자
```

### 사용 예
```css
.element {
  box-shadow: var(--shadow-md);
}

.element:hover {
  box-shadow: var(--shadow-lg);
}
```

---

## 리스폰시브 디자인

### 브레이크포인트
- `768px`: 태블릿
- `480px`: 모바일

모든 유틸리티 클래스는 작은 화면에서 자동으로 조정됩니다.

```html
<div class="grid grid-cols-4">
  <!-- 1200px+에서 4열, 768px~에서 2열, 480px-에서 1열 -->
</div>
```

---

## 주요 개선사항

✅ **모던 색상 팔레트**: 전문적인 색상 조합
✅ **일관된 스페이싱**: 8px 기반 시스템
✅ **향상된 그림자**: 깊이감 있는 디자인
✅ **부드러운 애니메이션**: 사용자 경험 향상
✅ **완전 응답형**: 모든 기기에서 완벽
✅ **접근성**: WCAG 기준 준수
✅ **다크모드 준비**: 향후 다크모드 추가 용이

---

## 커스터마이징

### CSS 변수 변경
```css
:root {
  --primary-600: #your-color;
  /* CSS 전체에 즉시 적용됨 */
}
```

모든 스타일은 CSS 변수를 사용하므로 쉽게 커스터마이징할 수 있습니다.

---

**업그레이드된 UI로 더 전문적인 웹사이트를 제공하세요!** 🚀
