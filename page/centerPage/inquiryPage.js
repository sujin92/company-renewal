let post_type;
header_on();

document.querySelector(".innerHeader").addEventListener("mouseout", (e) => {
  setTimeout(() => {
    header_on();
  }, 0);
});

document.querySelectorAll(".write-type").forEach((e) => {
  e.addEventListener("click", (e) => {
    document.querySelectorAll(".write-type").forEach((e) => {
      e.style.background = "#ffffff";
      e.style.border = "1px solid #c1c1c1";
      e.style.color = "#000000";
    });
    e.target.style.background = "#cd1319";
    e.target.style.border = "1px solid #cd1319";
    e.target.style.color = "#ffffff";
    post_type = e.target.innerText;
  });
});

const Font = Quill.import("formats/font");
Font.whitelist = ["noto", "black", "gamja", "nanum"];
Quill.register(Font, true);

const editor = new Quill("#editor", {
  modules: {
    toolbar: {
      container: [
        [{ font: Font.whitelist }],
        [{ align: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["emoji"],

        ["clean"],
      ],
      handlers: {
        emoji: function () {},
      },
    },
    "emoji-toolbar": true,
    "emoji-shortname": true,
  },
  placehorder: "Input",
  theme: "snow",
});

document.querySelector(".registerbtn").addEventListener("click", async (e) => {
  e.preventDefault(); // 클릭이벤트 기본동작 중단

  const title = document.querySelector("#title").value.trim();
  const author = document.querySelector("#author").value.trim();
  const field = document.querySelector("#field").value.trim();
  const manager = document.querySelector("#manager").value.trim();
  const userCall = document.querySelector("#userCall").value.trim();
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value.trim();
  const editorContent = editor.root.innerHTML.trim();

  if (!title) {
    alert("제목을 입력해 주세요.");
    return;
  }

  if (!author) {
    alert("업체명을 입력해 주세요.");
    return;
  }

  if (!field) {
    alert("업종을 입력해 주세요.");
    return;
  }

  if (!manager) {
    alert("담당자명을 입력해 주세요.");
    return;
  }

  if (!userCall) {
    alert("연락처를 입력해 주세요.");
    return;
  }

  if (!email) {
    alert("이메일을 입력해 주세요.");
    return;
  }

  if (!password) {
    alert("비밀번호를 입력해 주세요.");
    return;
  }

  if (!post_type) {
    alert("카테고리를 선택해 주세요.");
    return;
  }

  fetch("http://211.43.13.171:8000/board/post", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      category_id: 'inquiry',
      post_title: title,
      post_content: editorContent,
      post_writer : author,
      post_postType: post_type,
      post_password: password,
      post_isNotice: 0,
      additional: 0,
      // session: sessionStorage.getItem("sessionString"),
      isPrivate: 1,
      additional_company: author,
      additional_field: field,
      additional_manager: manager,
      additional_email: email,
      additional_phone: userCall,
    }),
  }).then((res) => console.log(res.json()));

  alert("작성되었습니다.");
  window.location.href = "/page/centerPage/centerPage.html?id=inquiry";
});
