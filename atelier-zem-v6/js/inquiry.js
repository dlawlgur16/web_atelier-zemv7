// ============================================
// Inquiry 폼 제출 (Google Apps Script 연동)
// Hidden iframe + form submit 방식 — CORS 제약 없음
// ============================================
(function () {
    var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyAe1D43uKODvcnpeprthDNXQcg5wR8shhEMgysVzY3d6b-ZsB_2GaeGYnUis3jkpmj/exec';

    var form = document.getElementById('inquiryForm');
    var submitBtn = document.getElementById('submitBtn');
    var formMessage = document.getElementById('formMessage');
    if (!form) return;

    // 숨겨진 iframe 생성 (폼 제출 타겟)
    var iframe = document.createElement('iframe');
    iframe.name = 'inquiry-submit-target';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // 전화번호 자동 하이픈
    var phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function () {
            var val = this.value.replace(/[^0-9]/g, '');
            if (val.length <= 3) {
                this.value = val;
            } else if (val.length <= 7) {
                this.value = val.slice(0, 3) + '-' + val.slice(3);
            } else {
                this.value = val.slice(0, 3) + '-' + val.slice(3, 7) + '-' + val.slice(7, 11);
            }
        });
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // 유효성 검사
        var company = form.company.value.trim();
        var name = form.querySelector('[name="name"]').value.trim();
        var email = form.email.value.trim();
        var phone = form.phone.value.trim();
        var message = form.message.value.trim();

        if (!company || !name || !phone || !message) {
            showMessage('필수 항목을 모두 입력해 주세요.', 'error');
            return;
        }

        if (phone.replace(/[^0-9]/g, '').length < 9) {
            showMessage('올바른 연락처를 입력해 주세요.', 'error');
            return;
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showMessage('올바른 이메일 형식을 입력해 주세요.', 'error');
            return;
        }

        if (!GOOGLE_SCRIPT_URL) {
            showMessage('문의 접수 시스템이 준비 중입니다. 전화로 문의해 주세요.', 'error');
            return;
        }

        // 제출 시작
        setLoading(true);

        // Hidden form 생성 → iframe으로 제출
        var hiddenForm = document.createElement('form');
        hiddenForm.method = 'POST';
        hiddenForm.action = GOOGLE_SCRIPT_URL;
        hiddenForm.target = 'inquiry-submit-target';
        hiddenForm.style.display = 'none';

        var fields = { company: company, name: name, email: email, phone: phone, message: message };
        Object.keys(fields).forEach(function (key) {
            var input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = fields[key];
            hiddenForm.appendChild(input);
        });

        document.body.appendChild(hiddenForm);
        hiddenForm.submit();
        document.body.removeChild(hiddenForm);

        // iframe 로드 완료 시 성공 처리
        iframe.onload = function () {
            setLoading(false);
            showMessage('문의가 접수되었습니다. 빠른 시일 내 연락드리겠습니다.', 'success');
            form.reset();
            iframe.onload = null;
        };

        // 타임아웃 안전장치 (10초)
        setTimeout(function () {
            if (submitBtn.disabled) {
                setLoading(false);
                showMessage('문의가 접수되었습니다. 빠른 시일 내 연락드리겠습니다.', 'success');
                form.reset();
            }
        }, 10000);
    });

    function setLoading(loading) {
        var btnText = submitBtn.querySelector('.btn-text');
        var btnLoading = submitBtn.querySelector('.btn-loading');
        if (loading) {
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
        } else {
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    }

    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = 'form-message ' + type;
        formMessage.style.display = 'block';

        if (type === 'success') {
            setTimeout(function () {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }
})();
