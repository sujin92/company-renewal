let sessionString = null;

document.addEventListener('click', (event) => {
  if (event.target.id === 'loginButton') {
    loginProcess();
  }
});

document.addEventListener('keyup', (event) => {
  if (event.keyCode === 13) {
    loginProcess();
  }
});

async function loginProcess() {
  if (inputValidation()) {
    let id = document.getElementById("loginID").value;
    let pw = document.getElementById("loginPW").value;    
    try{
        sessionString = await login(id, pw);
        if (sessionString) {
          sessionStorage.setItem("sessionString", sessionString);
          alert("로그인 되었습니다.");
          window.location.href='/index.html';
        }
        else {
          alert('로그인 정보가 일치하지 않습니다.');
        }
    }
    catch(error){
      console.log(error);
    }
  }
}

function inputValidation() {
  if (document.getElementById("loginID").value === "") {
    alert('아이디를 입력해주세요.');
    document.getElementById("loginID").focus();
    return false;
  }
  if (document.getElementById("loginPW").value === "") {
    alert('비밀번호를 입력해주세요.');
    document.getElementById("loginPW").focus();
    return false;
  }
  return true; 
}

function login(id, pw) {
  const login = fetch("http://211.43.13.171:8000/setup/login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      id : id,
      pw : pw
    }),
  });
  return login.then((res) => {
    if (res.status === 200) {
      return res.text();
    }
    else {
      return null;
    }
  });
}
