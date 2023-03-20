


function getlogin() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    axios
      .post("https://tarmeezacademy.com/api/v1/login", {
        username: username,
        password: password,
      })
      .then((response) => {
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        hideModal("loginModal");

        showui();
        showAlert("Nice, you triggered this alert message!", "success");
      })
      .catch((error) => {
        showAlert(error.response.data.message, "danger");
      });
  }
  function getRejester() {
    let username1 = document.getElementById("username1").value;
    let password1 = document.getElementById("password1").value;
    let name = document.getElementById("name").value;
    let image = document.getElementById("image-pr").files[0];
    let formData = new FormData();
    formData.append("username", username1);
    formData.append("password", password1);
    formData.append("name", name);
    formData.append("image", image);

    axios
      .post("https://tarmeezacademy.com/api/v1/register", formData)
      .then((response) => {
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        hideModal("rejesterModal");
        showui();
      })
      .catch((error) => {
        console.log(error);
      });
  }


  function loogOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showui();
  }
  function hideModal(mmodal) {
    const modal = document.getElementById(mmodal);
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
  }
  function showui() {
    let token = localStorage.token;
    let logeed = document.getElementById("logeed");
    
    let logout = document.getElementById("logout");
    let addPost = document.getElementById("addPost");
    if (token == null) {
      if(addPost != null){
        addPost.style.display = "none";
      }
      
      logout.style.display = "none";
      logeed.style.display = "block";
      
    } else {
      if(addPost != null){
        addPost.style.display = "block";
      }
      
      logout.style.display = "block";
      logeed.style.display = "none";
      

      let user = profileNav();
      document.getElementById("user-profile").innerHTML = user.username;
      document.getElementById("image-profile").src = user.profile_image;
    }
  }
  function showAlert(costomMessage, costomType) {
    const alertPlaceholder = document.getElementById(
      "liveAlertPlaceholder"
    );

    const alert = (message, type) => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',

        "</div>",
      ].join("");

      alertPlaceholder.append(wrapper);
    };

    alert(costomMessage, costomType);
  }
  function profileNav() {
    let user = null;
    let storageuser = localStorage.getItem("user");
    if (storageuser != null) {
      user = JSON.parse(storageuser);
    }
    return user;
  }

  let current_page = 1;
  let last_page = 1;
  window.addEventListener("scroll", function () {
    let endOFpage =
      window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
    if (endOFpage && current_page < last_page) {
      current_page++;
      getposts(false, current_page);
    }
    console.log(endOFpage);
  });
  showui();
  getposts();

  function getposts(troo = true, page) {
    axios
      .get(`https://tarmeezacademy.com/api/v1/posts?limit=2&page=${page}`)
      .then((response) => {
        
        const posts = response.data.data;
        last_page = response.data.meta.last_page;
        if (troo) {
          document.getElementById("posts").innerHTML = "";
        }

        for (let post of posts) {
          const author = post.author;
          let user = profileNav()

          let isMyPost = user != null && author.id == user.id
          let ebtncont = ""
          if(isMyPost){
            ebtncont = `
            <button onclick="deletePost('${encodeURIComponent(JSON.stringify(post))}')" class="btn btn-danger btn-sm  rounded-2" style=" float: right; margin-left: 5px;">delete</button>
            <button onclick="editePost('${encodeURIComponent(JSON.stringify(post))}')" class="btn btn-secondary btn-sm  rounded-2" style=" float: right;">edite</button>
            
            `
          }
          let content = `

      <div  class="card mt-3">
        <div class="card-header">
        <span onclick="profileClick(${author.id})">
          <img
            class="rounded-circle border border-3"
            style="width: 70px"
            src="${author.profile_image}"
          />
          <b>${author.username}</b>
          </span>
          ${ebtncont}
        </div>
        <div onclick="showPost(${post.id})"  class="card-body">
          <img
          style="height: 30rem"
            class="w-100 "
            src="${post.image}"
          />
          <h6>${post.created_at}</h6>
          <h5 class="card-title">${post.title}</h5>
          <p class="card-text">
           ${post.body}
          </p>
          <hr />
          <div>
            <i class="bi bi-pen"></i>
            <span>(${post.comments_count})
               Comments
               <span id="post-tags-${post.id}">


               </span>
              </span>
          </div>
        </div>
      </div>

        `;
          document.getElementById("posts").innerHTML += content;
          let postTagId = `post-tags-${post.id}`;
          document.getElementById(postTagId).innerHTML = "";
          for (tag of post.tags) {
            let tagcon = `
          <button class="btn btn-sm rounded-5" style="background-color:gray;color:white">
            ${tag.name}
          </button>
          `;
            document.getElementById(postTagId).innerHTML += tagcon;
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function createPost() {
    let postid = document.getElementById('posid').value
    let isCreate = postid == null || postid == ""
    
    let title = document.getElementById("title").value;
    let body = document.getElementById("body").value;
    let image = document.getElementById("image").files[0];
    let token = localStorage.token;

    let formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("image", image);
    let url = ""
    if(isCreate){
      url = "https://tarmeezacademy.com/api/v1/posts"
    }else{
      formData.append("_method", "put")
      url = `https://tarmeezacademy.com/api/v1/posts/${postid}`
    }
    
    axios
      .post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
        hideModal("addPostModal");
        getposts();
      });
  }

  function showPost(postId) {
    window.location = `showpost.html?postId=${postId}`;
  }


  const urlparams = new URLSearchParams(window.location.search);
  const id = urlparams.get("postId");
  console.log(id);
  showui();
  getpost();

  function getpost() {
    axios
      .get(`https://tarmeezacademy.com/api/v1/posts/${id}`)
      .then((response) => {
        const posts = response.data.data;
        const comments = posts.comments;
        const author = posts.author;
        console.log(response.data.data);
        console.log(comments);

        let commentPost = "";
        for (comment of comments) {
          commentPost += `

          <div>
            <img
              class="rounded-circle border border-3"
              style="width: 40px"
              src="${comment.author.profile_image}"
            />
            <b>${comment.author.username}</b>
          </div>
          <div>
            ${comment.body}
          </div>

          `;
        }

        let contentpost = `

      <div  class="card mt-3">
        <div class="card-header">
          <img
            class="rounded-circle border border-3"
            style="width: 70px"
            src="${author.profile_image}"
          />
          <b>${author.username}</b>
        </div>
        <div  class="card-body">
          <img
          style="height: 30rem"
            class="w-100 "
            src="${posts.image}"
          />
          <h6>${post.created_at}</h6>
          <h5 class="card-title">${posts.title}</h5>
          <p class="card-text">
           ${posts.body}
          </p>
          <hr />
          <div>
            <i class="bi bi-pen"></i>
            <span>(${posts.comments_count})
               Comments
               <span id="post-tags-${posts.id}">


               </span>
              </span>
          </div>
        </div>
        <dir
        class="bg-dark-subtle m-0 border border-1"
        id="comments"
      >
        ${commentPost}

      </dir>
      <div class="input-group mb-3" id="add-comment-div">
      <input id="comment-input" type="text" placeholder="add your comment here.." class="form-control">
      <button  class=" btn btn-outline-primary"type="button" onclick="createCommentClicked()" >send</button>
      </div>
      </div>

        `;
        document.getElementById("post").innerHTML = contentpost;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function createCommentClicked() {
    let commentBody = document.getElementById("comment-input").value;
    let token = localStorage.getItem("token");
    let params = {
      body: commentBody,
    };
    axios
      .post(
        `https://tarmeezacademy.com/api/v1/posts/${id}/comments`,
        params,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        getpost();
      });
  }

  function editePost(postId){
    let post = JSON.parse(decodeURIComponent(postId))
    
    document.getElementById("posid").value = post.id
    
    document.getElementById("addPostModalTitle").innerHTML = "edite"
    document.getElementById("title").value = post.title
    document.getElementById("body").value = post.body
    let postModal = new bootstrap.Modal(document.getElementById("addPostModal",{}))
    postModal.toggle()

  }

  function btncreatepost(){
    document.getElementById("addPostModalTitle").innerHTML = "create"
    document.getElementById("title").value = ''
    document.getElementById("body").value = ''
    let postModal = new bootstrap.Modal(document.getElementById("addPostModal",{}))
    postModal.toggle()
  }

  function deletePost(postId){
    let post = JSON.parse(decodeURIComponent(postId))
    document.getElementById("input-postId").value = post.id

    let postModal = new bootstrap.Modal(document.getElementById("deleteModal",{}))
    postModal.toggle()
  }

  function deleteBtnPost(){
    let token = localStorage.token
    let postid = document.getElementById("input-postId").value

    axios
      .delete(
        `https://tarmeezacademy.com/api/v1/posts/${postid}`,
       
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        hideModal("deleteModal");
        getposts()
      });
  }



  function profilelink(){
    
    let user = profileNav()
    window.location = `profile.html?postID=${user.id}`
  }


  function profileClick(postID){
    window.location = `profile.html?postID=${postID}`
   
   
  }
  function crentid(){
    const urlparams = new URLSearchParams(window.location.search);
    const id = urlparams.get("postID");
    return id
  }


  
  function gituser(){
    
    let id = crentid()
    axios.get(`https://tarmeezacademy.com/api/v1/users/${id}`)
    .then((response)=>{
      
      let user = response.data.data
      document.getElementById('email').innerHTML = user.email
      document.getElementById('namee').innerHTML= user.name
      document.getElementById('usernamee').innerHTML = user.username
      document.getElementById('image-user').src = user.profile_image
      document.getElementById('post').innerHTML = user.posts_count
      document.getElementById('commit').innerHTML = user.comments_count
      
    })
  }

 
  


  function getuserpost() {
    let id = crentid()
    axios
      .get(`https://tarmeezacademy.com/api/v1/users/${id}/posts`)
      .then((response) => {
        console.log(response.data.data);
        const posts = response.data.data;
        
          document.getElementById("post-user").innerHTML = "";
        

        for (let post of posts) {
          const author = post.author;
          let user = profileNav()

          let isMyPost = user != null && author.id == user.id
          let ebtncont = ""
          if(isMyPost){
            ebtncont = `
            <button onclick="deletePost('${encodeURIComponent(JSON.stringify(post))}')" class="btn btn-danger btn-sm  rounded-2" style=" float: right; margin-left: 5px;">delete</button>
            <button onclick="editePost('${encodeURIComponent(JSON.stringify(post))}')" class="btn btn-secondary btn-sm  rounded-2" style=" float: right;">edite</button>
            
            `
          }
          let content = `

      <div  class="card mt-3">
        <div class="card-header">
        
          <img
            class="rounded-circle border border-3"
            style="width: 70px"
            src="${author.profile_image}"
          />
          <b>${author.username}</b>
        
          ${ebtncont}
        </div>
        <div onclick="showPost(${post.id})"  class="card-body">
          <img
          style="height: 30rem"
            class="w-100 "
            src="${post.image}"
          />
          <h6>${post.created_at}</h6>
          <h5 class="card-title">${post.title}</h5>
          <p class="card-text">
           ${post.body}
          </p>
          <hr />
          <div>
            <i class="bi bi-pen"></i>
            <span>(${post.comments_count})
               Comments
               <span id="post-tags-${post.id}">


               </span>
              </span>
          </div>
        </div>
      </div>

        `;
          document.getElementById("post-user").innerHTML += content;
          let postTagId = `post-tags-${post.id}`;
          document.getElementById(postTagId).innerHTML = "";
          for (tag of post.tags) {
            let tagcon = `
          <button class="btn btn-sm rounded-5" style="background-color:gray;color:white">
            ${tag.name}
          </button>
          `;
            document.getElementById(postTagId).innerHTML += tagcon;
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  gituser()
  getuserpost()