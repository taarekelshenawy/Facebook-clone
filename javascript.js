let add_post = document.getElementById("add_post");
let modal_post = document.getElementById("modalpost");
let delete_post = document.getElementById("delete_post");

if(add_post!=null){
add_post.style.display="none"
}

///////////////////////////////////// pagination
let currentpage = 5;
let lastpage = 1;
window.addEventListener("scroll", function(){
  const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
console.log(currentpage,lastpage)
if(endOfPage && currentpage < lastpage){
 
  currentpage = currentpage +1;
getpost(false,currentpage)
}
});

/////////////////////////////////////////function getposts 
function getpost(reload = true , page = 1){
  let container = document.getElementById("container");
  axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=15&page=${page}`)
    .then((response)=>{
         lastpage = response.data.meta.last_page;
        const post = response.data.data;
        if(reload){
          container.innerHTML="";
        }
       
   for(item of post){
          let user= JSON.parse(localStorage.getItem("user"))
          let button = ""
          if(user.id === item.author.id){
            button =`
            <button type="button" class="btn btn-danger " style="float:right" onclick="handledeletepost('${encodeURIComponent(JSON.stringify(item))}')">delete</button>
            <button type="button" class="btn btn-secondary" style=" margin-right:10px; float:right" onclick="editpost('${encodeURIComponent(JSON.stringify(item))}')">Edit</button>`;

          }
  
    container.innerHTML+=` <div class="d-flex justify-content-center">
            <div class="col-8 " >
                <div class="card  my-4">
                    <div class="card-header bg-dark-subtle">
                        <img src=${item.author.profile_image}
                        class="rounded-circle " style="width:50px;
                         height:50px;
                         cursor:pointer;
                         	margin-right: 7px;"
                           onclick="showuserdetails(${item.author.id})">
                        <span class="ml-3">${item.author.username}</span>
                        ${button}
                       
                    </div>
                    <div class="card-body" style="cursor:pointer" onclick="showcart(${item.id})">
                        <img src=${item.image} style="width:100%;margin-bottom:10px;">
                        <p>${item.created_at}</p>
                        <h4>${item.title}</h4>
                        <p>${item.body}</p>
        
                        <hr>
                      <div >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                          </svg>
                        <span>${item.comments_count} comments</span>
                      </div>
                       
                    </div>
                  </div>

                </div>
                </div>`
   }
 
    })
}

//////////////////////////////////////////function login
function login(){
  let modal_id = document.getElementById("exampleModal");
  let username = document.getElementById("recipient-name");
let password = document.getElementById("recipient-password");
  let mod_img = document.getElementById("mod_img").files[0];

  let token = localStorage.getItem("token");
  let config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      "Authorization":`Bearer ${token}`,
    }
  }
  
  let formdata = new FormData();
  formdata.append( "username",username.value);
  formdata.append(  "password",password.value);
  formdata.append("image",mod_img);
  
    axios.post("https://tarmeezacademy.com/api/v1/login",formdata,config)
    .then((response)=>{
      let token = response.data.token;
      let user = response.data.user;

       localStorage.setItem("token",token);
       localStorage.setItem("user" , JSON.stringify(user));

        const modal = bootstrap.Modal.getInstance(modal_id);
        modal.hide();
        setupui();
        alertlogin("login succesfully","success");
        getpost();
        
    }).catch((response)=>{
      let reject = response.response.data.message;
      alertlogin(reject,"danger");
     
    })

}


////////////////////////// function alert login 

function alertlogin(custommessage,color){

  const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
const appendAlert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
}


  appendAlert(`${custommessage}`, `${color}`)

}

///////////////////////////// function logout

function logout(){

localStorage.removeItem("token");
 localStorage.removeItem("user");
setupui()
alertlogin("logout succesfully","success")
user_details.style.display="none";
let container = document.querySelector("#container");
container.innerHTML="";

}


////////////////////////////// function register

function register(){

  let username_reg = document.getElementById("register-username");
  let password_reg = document.getElementById("register-password");
  let name_reg = document.getElementById("register-name");
  let reg_image = document.getElementById("register-image").files[0];
  let modal_reg = document.getElementById("Modalregister");


  let config = {
    headers: {
      'Content-Type': 'multipart/form-data',
     
    }
  }
  let formdata = new FormData();
  formdata.append("username" , username_reg.value);
  formdata.append("password",password_reg.value);
  formdata.append( "name",name_reg.value);
  formdata.append("image",reg_image);

axios.post("https://tarmeezacademy.com/api/v1/register",formdata,config

).then((response)=>{

  const modal = bootstrap.Modal.getInstance(modal_reg);
  modal.hide();
  let token = response.data.token;
  let user = response.data.user;

   localStorage.setItem("token",token);
   localStorage.setItem("user" , JSON.stringify(user));
  alertlogin("login succefully","success");
  setupui()
}).catch((response)=>{
  let reject = response.response.data.message;
  alertlogin(reject,"danger")
 
})
}

/////////////////////////// function setup ui

function setupui(){

  let log = document.getElementById("log-btn");
let reg = document.getElementById("reg-btn");
let log_out = document.getElementById("logout-btn");
let user_img = document.getElementById("user_image");
let name_of_user = document.getElementById("name_of_user");

let user_details = document.getElementById("user_details");

  let token = localStorage.getItem("token");
  let user = JSON.parse(localStorage.getItem("user"));

  if(token === null){
    if(add_post!=null){
      add_post.style.display="none";
    }
  
    log.style.setProperty("display", "block", "important");
    reg.style.setProperty("display", "block", "important");
    log_out.style.setProperty("display", "none", "important");
  
  
  }else{
    log.style.display="none";
    reg.style.display="none";
    log_out.style.setProperty("display", "block", "important");
    if(add_post!=null){
      add_post.style.display="block";

    }
    user_details.style.display="block";
      user_img.src = user.profile_image;
   name_of_user.innerHTML=user.name;
   
  }
}

setupui();
getpost();


///////////////////////////////////////////// Add Post

function addpost(){

  let post_title = document.getElementById("post_title");
let post_body = document.getElementById("post_body");
let post_image = document.getElementById("post_image").files[0];

  let post = document.getElementById("post-id-input").value;
  let iscreate = post == null || post=="";
  
  const form = new FormData();
  form.append("title",post_title.value);
  form.append("image",post_image);
  form.append("body", post_body.value);
  let token = localStorage.getItem("token");
  let config = {
    headers: {
       'Content-Type': 'multipart/form-data',
      "Authorization": `Bearer ${token}`,
    }
  }
  let url=""
  if(iscreate){
     url ="https://tarmeezacademy.com/api/v1/posts";
    

  }else{
     url =`https://tarmeezacademy.com/api/v1/posts/${post}`;
    form.append("_method","put");
   

  }

  axios.post(url,form,config)
  .then((response)=>{
 
  const modal = bootstrap.Modal.getInstance(modal_post);
  modal.hide();
  getpost()
 

  }
 )
 
}

/////////////////// function showcart()

function showcart(postid){
  
window.location = `postdetails.html?postId=${postid}`
}

//////////////////////// function editpost

function editpost(postobject){

  let post = JSON.parse(decodeURIComponent(postobject));

  let postmodal = new bootstrap.Modal(document.getElementById("modalpost"));
  postmodal.toggle();
  document.getElementById("createtitle").innerHTML="Edit post";
    document.getElementById("createbutton").innerHTML="Edit";
    document.getElementById("post_title").value=post.title;
    document.getElementById("post_body").value=post.body;
    document.getElementById("post-id-input").value=post.id;

}

////////////////////////function createpost 

function createpost(){
 
  let modal = new bootstrap.Modal(document.getElementById("modalpost"));
  modal.toggle();
  document.getElementById("createtitle").innerHTML="create post";
  document.getElementById("createbutton").innerHTML="create";
  
  document.getElementById("post-id-input").value="";
}

/////////////////////////////////// function handledeletepost 
function handledeletepost(postobject){
  let post = JSON.parse(decodeURIComponent(postobject));
  let modal = new bootstrap.Modal(document.getElementById("delete_post"));
  modal.toggle();
  document.getElementById("delete_id").value = post.id;
 
}

/////////////////////////////////// function delete post 
function deletepost(){

  let delete_id = document.getElementById("delete_id").value;
  let deletes = document.getElementById("delete_post");
  let token = localStorage.getItem("token");
  let config = {
    headers: {
       'Content-Type': 'multipart/form-data',
      "Authorization": `Bearer ${token}`,
    }
  }
  axios.delete(`https://tarmeezacademy.com/api/v1/posts/${delete_id}`,config)
  .then((response)=>{

    const modal = bootstrap.Modal.getInstance(deletes);
    modal.hide();
    getpost()
  })

}

///////////////////////////////////// function showuserdetails

function showuserdetails(userid){

 window.location=`profile.html?userId=${userid}`;
}

///////////////////////////
function profileuser(){
let user = JSON.parse(localStorage.getItem("user"));
window.location=`profile.html?userId=${user.id}`
}
