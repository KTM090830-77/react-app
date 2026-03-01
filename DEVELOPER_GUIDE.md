# 📝 UI 업그레이드 - 개발자 가이드

새로운 디자인 시스템을 사용하여 컴포넌트를 개발하는 방법을 안내합니다.

## 은 목차

1. [시작하기](#시작하기)
2. [버튼 만들기](#버튼-만들기)
3. [카드 만들기](#카드-만들기)
4. [폼 만들기](#폼-만들기)
5. [레이아웃 구성](#레이아웃-구성)
6. [최상의 관행](#최상의-관행)
7. [색상 선택 가이드](#색상-선택-가이드)

---

## 시작하기

### CSS 변수 접근
모든 CSS 파일에서 변수를 사용할 수 있습니다:

```css
.my-element {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}
```

---

## 버튼 만들기

### 기본 버튼
```tsx
// React 컴포넌트
export function MyButton() {
  return (
    <button className="btn btn-primary">
      클릭하기
    </button>
  );
}
```

### 다양한 스타일의 버튼
```tsx
export function ButtonShowcase() {
  return (
    <div className="flex gap-4">
      {/* Primary - 주요 액션 */}
      <button className="btn btn-primary">저장</button>
      
      {/* Secondary - 보조 액션 */}
      <button className="btn btn-secondary">취소</button>
      
      {/* Outline - 선택사항 */}
      <button className="btn btn-outline">자세히</button>
      
      {/* Danger - 위험한 액션 */}
      <button className="btn btn-danger">삭제</button>
      
      {/* Success - 성공 액션 */}
      <button className="btn btn-success">완료</button>
      
      {/* Ghost - 최소한의 스타일 */}
      <button className="btn btn-ghost">건너뛰기</button>
    </div>
  );
}
```

### 크기 옵션
```tsx
<button className="btn btn-sm btn-primary">작음</button>
<button className="btn btn-md btn-primary">중간 (기본)</button>
<button className="btn btn-lg btn-primary">큼</button>
<button className="btn btn-xl btn-primary">매우 큼</button>
```

### 비활성화 상태
```tsx
<button className="btn btn-primary" disabled>
  불가능한 버튼
</button>
```

---

## 카드 만들기

### 기본 카드
```tsx
export function MyCard() {
  return (
    <div className="card">
      <h3>카드 제목</h3>
      <p>카드 설명 텍스트</p>
      <button className="btn btn-primary btn-sm">액션</button>
    </div>
  );
}
```

### 카드 그리드
```tsx
export function CardGrid() {
  return (
    <div className="grid grid-cols-auto gap-6">
      <div className="card">
        <h4>항목 1</h4>
        <p>설명</p>
      </div>
      <div className="card">
        <h4>항목 2</h4>
        <p>설명</p>
      </div>
      <div className="card">
        <h4>항목 3</h4>
        <p>설명</p>
      </div>
    </div>
  );
}
```

### 상태별 카드
```tsx
<div className="card submitted">
  <p>✅ 제출되었습니다</p>
</div>

<div className="card warning">
  <p>⚠️ 주의 필요</p>
</div>

<div className="card overdue">
  <p>❌ 기한 초과</p>
</div>
```

---

## 폼 만들기

### 기본 폼
```tsx
export function MyForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  return (
    <form className="form">
      <div className="form-group">
        <label htmlFor="name">이름</label>
        <input
          id="name"
          type="text"
          className="form-input"
          placeholder="이름을 입력하세요"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        <div className="form-help">필수 입력 항목입니다</div>
      </div>

      <div className="form-group">
        <label htmlFor="email">이메일</label>
        <input
          id="email"
          type="email"
          className="form-input"
          placeholder="your@email.com"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
      </div>

      <div className="form-group">
        <label htmlFor="message">메시지</label>
        <textarea
          id="message"
          className="form-textarea"
          placeholder="메시지를 입력하세요"
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
        ></textarea>
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" type="button">취소</button>
        <button className="btn btn-primary" type="submit">전송</button>
      </div>
    </form>
  );
}
```

### 다열 폼
```tsx
<form className="form">
  <div className="form-row cols-2">
    <div className="form-group">
      <label>이름</label>
      <input className="form-input" />
    </div>
    <div className="form-group">
      <label>성</label>
      <input className="form-input" />
    </div>
  </div>

  <div className="form-row cols-3">
    <div className="form-group">
      <label>항목 1</label>
      <input className="form-input" />
    </div>
    <div className="form-group">
      <label>항목 2</label>
      <input className="form-input" />
    </div>
    <div className="form-group">
      <label>항목 3</label>
      <input className="form-input" />
    </div>
  </div>

  <div className="form-actions">
    <button className="btn btn-secondary">취소</button>
    <button className="btn btn-primary">저장</button>
  </div>
</form>
```

### 체크박스와 라디오
```tsx
<div className="checkbox-label">
  <input type="checkbox" className="form-checkbox" id="check1" />
  <label htmlFor="check1">동의합니다</label>
</div>

<div className="radio-label">
  <input type="radio" className="form-radio" id="radio1" name="option" />
  <label htmlFor="radio1">옵션 1</label>
</div>

<div className="radio-label">
  <input type="radio" className="form-radio" id="radio2" name="option" />
  <label htmlFor="radio2">옵션 2</label>
</div>
```

---

## 레이아웃 구성

### Flex 레이아웃
```tsx
// 가로 배열 중앙 정렬
<div className="flex items-center justify-center gap-4">
  <div>항목 1</div>
  <div>항목 2</div>
  <div>항목 3</div>
</div>

// 양쪽 정렬
<div className="flex justify-between items-center">
  <h2>제목</h2>
  <button className="btn btn-primary btn-sm">액션</button>
</div>

// 세로 배열
<div className="flex flex-col gap-6">
  <div>섹션 1</div>
  <div>섹션 2</div>
  <div>섹션 3</div>
</div>
```

### Grid 레이아웃
```tsx
// 자동 응답형 그리드
<div className="grid grid-cols-auto gap-6">
  <div className="card">카드 1</div>
  <div className="card">카드 2</div>
  <div className="card">카드 3</div>
</div>

// 고정 2열
<div className="grid grid-cols-2 gap-4">
  <div>항목 1</div>
  <div>항목 2</div>
</div>

// 고정 3열
<div className="grid grid-cols-3 gap-6">
  <div>항목 1</div>
  <div>항목 2</div>
  <div>항목 3</div>
</div>
```

### 스페이싱 유틸리티
```tsx
<div className="p-6 m-4 mb-8">
  {/* 
    padding: 1.5rem (모든 방향)
    margin: 1rem (모든 방향)
    margin-bottom: 2rem
  */}
</div>

<div className="flex gap-4 px-6 py-4">
  {/* 
    gap: 1rem
    padding-left, padding-right: 1.5rem
    padding-top, padding-bottom: 1rem
  */}
</div>
```

---

## 최상의 관행

### 1. CSS 변수 항상 사용
```css
/* ✅ 좋음 */
.my-element {
  color: var(--text-primary);
  background: var(--bg-primary);
}

/* ❌ 피하기 */
.my-element {
  color: #111827;
  background: #ffffff;
}
```

### 2. 일관된 간격 사용
```tsx
/* ✅ 좋음 */
<div style={{ marginBottom: 'var(--space-4)' }}>
  내용
</div>

/* ❌ 피하기 */
<div style={{ marginBottom: '20px' }}>
  내용
</div>
```

### 3. 상태 클래스 활용
```tsx
// ✅ 좋음 - 상태별 CSS 사용
<div className={`card ${isSubmitted ? 'submitted' : ''}`}>
  내용
</div>

// ❌ 나쁜 예 - 인라인 스타일
<div style={{ background: isSubmitted ? '#f8fff8' : '#ffffff' }}>
  내용
</div>
```

### 4. 애니메이션 활용
```tsx
/* ✅ 좋음 */
<div className="card transition-all hover:shadow-lg">
  호버시 그림자 효과
</div>

<div className="slide-in-up">
  페이드인 애니메이션
</div>

/* ❌ 피하기 */
<div style={{ transition: 'all 0.3s' }}>
  비일관적인 스타일
</div>
```

### 5. 반응형 디자인
```tsx
/* ✅ 좋음 */
<div className="grid grid-cols-3 gap-6">
  {/* 
    큰 화면: 3열
    중간 화면: 자동 조정
    작은 화면: 1열
  */}
</div>

/* ❌ 피하기 */
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
  {/* 반응형 아님 */}
</div>
```

---

## 색상 선택 가이드

### 주요 액션에 Primary 사용
```tsx
<button className="btn btn-primary">저장</button>
```

### 성공/완료에 Success 사용
```tsx
<span className="badge badge-success">완료</span>
```

### 경고/주의에 Warning 사용
```tsx
<div className="card warning">주의 메시지</div>
```

### 오류/위험에 Error 사용
```tsx
<span className="badge badge-error">오류</span>
```

### 정보에 Info 사용
```tsx
<span className="badge badge-info">알림</span>
```

---

## 실제 예제

### 과제 카드 (학생 버전)
```tsx
export function AssignmentCard({ assignment }) {
  return (
    <div className={`card ${assignment.isSubmitted ? 'submitted' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 style={{ margin: 0, marginBottom: 'var(--space-2)' }}>
            {assignment.title}
          </h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            {assignment.subject}
          </p>
        </div>
        <span className={`badge badge-${assignment.statusColor}`}>
          {assignment.status}
        </span>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
        {assignment.description}
      </p>
      
      <div className="flex justify-between items-center mb-4 pb-4" 
           style={{ borderBottom: '1px solid var(--border-color)' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          마감: {assignment.dueDate}
        </span>
        <span style={{ color: 'var(--warning-600)', fontWeight: 'bold' }}>
          D-{assignment.dDay}
        </span>
      </div>
      
      <button className="btn btn-primary btn-sm">
        {assignment.isSubmitted ? '다시 제출' : '제출하기'}
      </button>
    </div>
  );
}
```

### 설정 섹션
```tsx
export function NotificationSettings() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="card">
      <h2 style={{ borderBottomWidth: '2px', borderBottomColor: 'var(--primary-500)' }}>
        알림 설정
      </h2>
      
      <div className="flex justify-between items-center my-4 py-4"
           style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div>
          <p style={{ margin: 0, fontWeight: 'var(--font-weight-medium)' }}>
            이메일 알림
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: 'var(--font-size-sm)', 
                      color: 'var(--text-secondary)' }}>
            중요한 업데이트를 이메일로 받기
          </p>
        </div>
        <input 
          type="checkbox" 
          className="form-checkbox" 
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary">취소</button>
        <button className="btn btn-primary">저장</button>
      </div>
    </div>
  );
}
```

---

## 🎯 요점

- 항상 **CSS 변수**를 사용하세요
- **인라인 스타일**은 피하세요
- **유틸리티 클래스**를 최대한 활용하세요
- **일관된 간격**과 **색상**을 유지하세요
- **애니메이션**으로 사용자 경험을 향상시키세요
- **반응형**을 생각하며 만드세요

---

**행복한 코딩을 바랍니다! 🚀**
