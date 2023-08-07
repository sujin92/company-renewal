const post_id = window.location.href.split("id=")[1];
let thumbnail;
let thumbnailFlag = false;
let cat;
let id;

window.addEventListener("load", async () => {
  const queries = window.location.search.split("?")[1].split("&");
  id = queries.filter((e) => e.indexOf("id") !== -1)[0].split("=")[1];
  cat = queries.filter((e) => e.indexOf("cat") !== -1)[0].split("=")[1];

  header_on();

  document.querySelector(".innerHeader").addEventListener("mouseout", (e) => {
    setTimeout(() => {
      header_on();
    }, 0);
  });

  const content = await fetch(`http://211.43.13.171:8000/board/detail/${cat}/${id}`, {
    method: 'POST'
  }).then((res) => res.json())

  // console.log(content);

  document.querySelector("#title").value = content.post_title;
  document.querySelector("#author").value = content.post_writer;

  // console.log(document.querySelectorAll(".write-type"));

  [...document.querySelectorAll(".write-type")].find(e => e.innerText===content.post_postType).click();

  editor.root.innerHTML = content.post_content;

  document.querySelector("#thumbnail-name").innerText = content.post_thumbImage.split("/image/posts/")[1];
  if (content.post_thumbImage) thumbnailFlag = true;

  thumbnail = content.post_thumbImage;
});

document.querySelector(".editbtn").addEventListener("click", async (e) => {
  e.preventDefault(); 
  
  const title = document.querySelector("#title").value.trim();
  const author = document.querySelector("#author").value.trim();
  const password = document.querySelector("#password").value.trim();
  
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

  if (document.querySelector("#thumbnail-upload").files.length) {
    const formData = new FormData();
    formData.append("image", document.querySelector("#thumbnail-upload").files[0]);
    formData.append("session", sessionString);
    const imgSrc = await fetch(`http://211.43.13.171:8000/board/image`, {
      method: 'POST',
      body: formData
    }).then(res => res.json());
    thumbnail = imgSrc.path;
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

  fetch(`http://211.43.13.171:8000/board/edit/${post_id}`, {
    method: "POST",
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      category_id: upload,
      post_title: document.querySelector("#title").value,
      post_content: editor.root.innerHTML,
      post_thumbImage: thumbnail,
      post_postType: post_type,
      post_password: document.querySelector("#password").value,
      post_isNotice: 0,
      session: sessionStorage.getItem("sessionString"),
    }),
  }).then((res) => console.log(res));
  alert("수정되었습니다.");
  window.location.href = `/page/loadPage.html?cat=${cat}&id=${id}`;
});

