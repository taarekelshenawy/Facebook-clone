
let add_post = document.getElementById("add_post");
let modal_post = document.getElementById("modalpost");
let delete_post = document.getElementById("delete_post");
let container = document.getElementById("container")

//////////////////function getpost 

function getpost(id){
    axios.get(`https://tarmeezacademy.com/api/v1/posts/${id}`)
    .then((response)=>{
        const post = response.data.data;
        const author = post.author;
       const comments = post.comments;
   
    container.innerHTML+=` <div class="d-flex justify-content-center">
            <div class="col-8">
            <h4 style="margin-top: 20px; color:#fff;">${author.username} post </h4>
                <div class="card  my-4">
                      
                    <div class="card-header">
                        <img src=${author.profile_image}
                     class="rounded-circle" style="width:40px">
                        <span class="ml-3 ">${author.username}</span>
                    </div>
                    <div class="card-body">
                        <img src=${post.image} style="width: 100%" alt="post-image">
                        <p>${post.created_at}</p>
                        <h4>${post.title}</h4>
                        <h6>${post.body}</h6>
        
                        <hr>
                      <div  style="margin-bottom:10px">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                          </svg>
                        <span >${post.comments_count} comments</span>
                      </div>
                      <div id="comments">
                       
                      </div>
                      
                      <div class="input-group mb-3 mt-4" id="sendcomment">
                          <input type="text" id="comment_value" class="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="button-addon2">
                          <button class="btn btn-outline-secondary" type="button" id="button-addon2" onclick="sendcomment(${post.id})">Send</button>
                    </div>
       
                   
                     
                    </div>
                  </div>

                </div>
                </div>`
   for(item of comments){
     document.getElementById("comments").innerHTML+=`
     <div mb-3 >
       <img src=${item.author.profile_image}
 
            class="rounded-circle" style="width:40px" alt="author-image">
                  
                      <span style="font-weight:bold">${item.author.username}</span>
                      <p style="margin-top:10px">${item.body}</p>
                         </div>
     `
  
   
      
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


/////////////////// function logout

function logout(){

  localStorage.removeItem("token");
   localStorage.removeItem("user");
  setupui()
  alertlogin("logout succesfully","danger")
  user_details.style.display="none";
    
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
  formdata.append(  "username" , username_reg.value);
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
  alertlogin("login succefully ");
  setupui()
}).catch((response)=>{
  let reject = response.response.data.message;
  alertlogin(reject,"danger")
 
})
}
/////////////////////////// function setup ui

function setupui(){

  let log =document.getElementById("log-btn");
let reg = document.getElementById("reg-btn");
let log_out = document.getElementById("logout-btn");
let user_img = document.getElementById("user_image");
let name_of_user = document.getElementById("name_of_user");
let send_comment = document.getElementById("sendcomment");

let user_details = document.getElementById("user_details");

  let token = localStorage.getItem("token");

  let user = JSON.parse(localStorage.getItem("user"));
  

  if(token === null){
    if(add_post!=null){
      add_post.style.display="none"
  
    }
  
    log.style.setProperty("display", "block", "important");
    reg.style.setProperty("display", "block", "important");
    log_out.style.setProperty("display", "none", "important");
    send_comment.style.display="none";
   
   
  
  
  }else{
    log.style.display="none";
    reg.style.display="none";
    log_out.style.setProperty("display", "block", "important");
    if(add_post!=null){
      add_post.style.display="block";

    }
    
    user_details.style.display="block";
    let user_image = user.profile_image;
    user_img.src = user_image;
    console.log(user.name)
   name_of_user.innerHTML=user.name;

   send_comment.style.display="block";
 
   
  }
}
setupui()


//////////////send comment

function sendcomment(id){
    let token = localStorage.getItem("token");
    let config = {
        headers: {
          "Accept":"application/json",
          "Authorization":`Bearer ${token}` ,
        }
      }
      
    let comment = document.getElementById("comment_value").value;
    console.log(comment)
  axios.post(`https://tarmeezacademy.com/api/v1/posts/${id}/comments`,{
    "body":comment,
  },config).then((response)=>{
 
   
    getpost()
   }).catch((response)=>{
    let reject = response.response.data.message;
    alertlogin(reject,"danger")

  })

}

//////////////////////
function profileuser(){
  let user = JSON.parse(localStorage.getItem("user"));
  let user_Id = user.id;
  alert(user_Id)
  window.location=`profile.html?${user_Id}`
}




