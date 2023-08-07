let sessionString;
let post_type;

header_on();

document.addEventListener('DOMContentLoaded', function() {
  sessionString = sessionStorage.getItem('sessionString');
});

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

const registerBtn = document.querySelector(".registerbtn");
if (registerBtn) {
  registerBtn.addEventListener("click", async (e) => {
  const title = document.querySelector("#title").value.trim();
  const author = document.querySelector("#author").value.trim();
  const password = document.querySelector("#password").value.trim();
  const editorContent = editor.root.innerHTML.trim();
  
  if (!title) {
    alert("제목을 입력해 주세요.");
    return;
  }

  if (!author) {
    alert("이름을 입력해 주세요.");
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
      category_id: 'notice',
      post_title: title,
      post_content: editorContent,
      post_writer : author,
      post_postType: post_type,
      post_password: password,
      post_isNotice: 0,
      additional: 0,
      session: sessionStorage.getItem("sessionString"),
      isPrivate: 0,
    }),
  }).then((res) => console.log(res));

  alert("작성되었습니다.");
  window.location.href = "/page/centerPage/centerPage.html?id=notice";
});
}
