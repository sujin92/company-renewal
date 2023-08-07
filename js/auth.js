document.addEventListener("DOMContentLoaded", function(event) {
  sessionString();
});

async function sessionString() {
  let sessionString = sessionStorage.getItem("sessionString");
  if (sessionString !== null) {
    try {
      let auth = await authProcess(sessionString);
      if (auth === 'OK') {
        let writeElements = document.querySelectorAll(".write");
        if (writeElements !== null) {
          writeElements.forEach(function(element) {
            element.style.display = "inline-block";
          });
        }
        let noticeWriteElements = document.querySelectorAll(".noticeWrite");
        if (noticeWriteElements !== null) {
          noticeWriteElements.forEach(function(element) {
            element.style.display = "inline-block";
          });
        }
      }
    }
    catch(error) {
      console.log(error);
    }
  }
}

function authProcess(sessionString) {
  let authResult = fetch("http://211.43.13.171:8000/setup/verify", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      session : sessionString
    })
  });
  return authResult.then((res) => {
    if (res.status === 200) {
      return res.text();
    }
  });
}