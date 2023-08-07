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

document.querySelector("#thumbnail-upload").addEventListener("change", (e) => {
  document.querySelector("#thumbnail-name").innerText = e.target.files[0].name;
});

const imageHandler = () => {
  const formData = new FormData();

  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.setAttribute("name", "image");
  input.style.display = "none";

  document.body.appendChild(input);

  input.onchange = async () => {
    const file = input.files[0];
    formData.append("image", file);
    formData.append("session", sessionString);

    const imgSrc = await fetch("http://211.43.13.171:8000/board/image", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (res.status == 204) {
          alert("권한이 없습니다");
          return
        }
        if (res.statusText != "OK") {
          alert("이미지 업로드에 실패하였습니다.");
          return
        }
        return res.json();
      })
      .then((res) => {
        // console.log(res);

        const url = res.path;
        const quill = editor
        const range = quill.getSelection()?.index;
        if (typeof range !== "number") return;

        quill.setSelection(range, 1);
        quill.clipboard.dangerouslyPasteHTML(range, `<img src=${'http://211.43.13.171:8000' + url} alt="image" />`);

        document.body.removeChild(input);
      });
  };
  input.click();
};

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
        image: imageHandler,
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
      alert("작성자명을 입력해 주세요.");
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

    const formData = new FormData();
    formData.append("session", sessionString);

    if (document.querySelector("#thumbnail-upload").files.length > 0) {
      formData.append("image", document.querySelector("#thumbnail-upload").files[0]);
    }

    let upload;
    switch (post_type) {
      case "수행실적":
        upload = "result";
        break;
      case "자료실":
        upload = "material";
        break;
    }
    // console.log(upload)

    const imgSrc =
      upload === "material"
        ? ""
        : await fetch("http://211.43.13.171:8000/board/image", {
            method: "POST",
            body: formData,
          }).then((res) => res.json());

    editor.insertEmbed(editor.getLength(), "image", imgSrc.path);

    fetch("http://211.43.13.171:8000/board/post", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        category_id: upload,
        post_title: title,
        post_content: editorContent,
        post_thumbImage: imgSrc?.path,
        post_writer: author,
        post_postType: post_type,
        post_password: password,
        post_isNotice: 0,
        additional: 0,
        session: sessionStorage.getItem("sessionString"),
        isPrivate: 0,
      }),
    }).then((res) => {
      console.log(res);
      // post_type에 따라 페이지 이동
      if (post_type === "수행실적") {
        window.location.href =
          "/page/technologyPage/technologyPage.html?id=result";
      } else if (post_type === "자료실") {
        window.location.href =
          "/page/technologyPage/technologyPage.html?id=material";
      } else {
        window.history.back();
      }
    })
    .catch((err) => console.error(err));
  
  alert("작성되었습니다.");
  });
}
