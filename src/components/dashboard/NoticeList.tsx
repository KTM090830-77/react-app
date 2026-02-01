import Card from "../common/Card";

export default function NoticeList() {
  return (
    <Card>
      <h3>공지사항</h3>
      <ul style={{ marginTop: 16, paddingLeft: 16 }}>
        <li>2026학년도 1학기 수행평가 일정 안내</li>
        <li>수행평가 제출 방법 변경</li>
        <li>평가 기준 업데이트</li>
      </ul>
    </Card>
  );
}
