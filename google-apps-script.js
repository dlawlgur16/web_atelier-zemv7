// ============================================
// Atelier ZEM - 문의 접수 Google Apps Script
// ============================================
// 설정 방법:
// 1. Google Sheets에서 새 스프레드시트 생성
// 2. 확장 프로그램 > Apps Script 클릭
// 3. 이 코드 전체를 붙여넣기 (기존 코드 삭제 후)
// 4. ★ 중요: 새로 배포해야 합니다! (코드 변경 시 항상 새 배포)
//    배포 > 새 배포 > 웹 앱
//    - 실행 주체: 나
//    - 액세스 권한: 모든 사용자
// 5. 배포 후 URL은 이미 inquiry.js에 설정됨
// ============================================

// ★ 이메일 알림을 받을 주소
var NOTIFICATION_EMAIL = 'zemstonelab@gmail.com';
var SHEET_NAME = '문의접수';

// HTML form submit 방식 → e.parameter로 데이터 수신
function doPost(e) {
  try {
    var data = {
      company: e.parameter.company || '',
      name: e.parameter.name || '',
      email: e.parameter.email || '',
      phone: e.parameter.phone || '',
      message: e.parameter.message || ''
    };

    // 1) 스프레드시트에 기록
    saveToSheet(data);

    // 2) 이메일 알림 발송
    sendNotification(data);

    // 성공 응답 (iframe에서 표시됨 — 보이지 않음)
    return HtmlService.createHtmlOutput('<html><body>OK</body></html>');

  } catch (error) {
    return HtmlService.createHtmlOutput('<html><body>Error: ' + error.toString() + '</body></html>');
  }
}

function saveToSheet(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  // 시트가 없으면 생성 + 헤더 추가
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['접수일시', '회사명', '담당자명', '이메일', '연락처', '문의내용', '콜백여부']);
    sheet.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#E8E4DF');
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(6, 400);
  }

  sheet.appendRow([
    new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
    data.company,
    data.name,
    data.email,
    data.phone,
    data.message,
    '미완료'
  ]);
}

function sendNotification(data) {
  var subject = '[아뜰리에젬] 새 문의 접수 - ' + (data.company || '미입력');

  var body = '새로운 문의가 접수되었습니다.\n\n'
    + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
    + '회사명: ' + (data.company || '-') + '\n'
    + '담당자: ' + (data.name || '-') + '\n'
    + '이메일: ' + (data.email || '-') + '\n'
    + '연락처: ' + (data.phone || '-') + '\n'
    + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n'
    + '문의 내용:\n' + (data.message || '-') + '\n\n'
    + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
    + '접수일시: ' + new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }) + '\n'
    + '스프레드시트에서 확인: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl();

  MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
}

// 테스트용 (Apps Script 에디터에서 직접 실행 가능)
function testPost() {
  var e = {
    parameter: {
      company: '테스트회사',
      name: '홍길동',
      email: 'test@test.com',
      phone: '010-1234-5678',
      message: '테스트 문의입니다.'
    }
  };
  doPost(e);
}
