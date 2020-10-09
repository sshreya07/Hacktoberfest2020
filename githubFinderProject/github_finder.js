const uImg = document.querySelector('#userImg');
const uName = document.querySelector('#name');
const uLogin = document.querySelector('#login');
const uFollowing = document.querySelector('#following');
const uFollowers = document.querySelector('#followers');
const uRepo = document.querySelector('#userRepository');

document.getElementById('input').addEventListener('submit', searchUser);

function searchUser(e){
   

    const user = document.querySelector('#enterInput').value;

    fetch(`https://api.github.com/users/${user}`)
        .then(Response => {
            console.log(Response.status);
            if(!Response.ok){
                Error('not found');
            }
            return Response.json();
        })
        .then(user => {
            console.log(user);

            if(`${user.login}` === 'null' || `${user.login}` === 'undefined'){
                const errDiv = document.getElementById('errorBox');
                errDiv.className = 'alert alert-danger text-center';
                
                errDiv.appendChild(document.createTextNode('Invalid Username'));
                console.log(errDiv);

                // const errDiv = document.createElement('div');
                // errDiv.className = 'alert alert-danger text-center col-sm-4 mx-auto';
                // errDiv.id = 'errBox';
                // errDiv.appendChild(document.createTextNode('Invalid Username'));
                // errDiv.style.marginTop = '10px';
                // console.log(errDiv);

                // const navbarDiv = document.querySelector('#navbar');
                // const mainDiv = document.querySelector('#main');
                // navbarDiv.insertBefore(errDiv, mainDiv);

                setTimeout(removeAlert, 3000);
            }else{
            
            uImg.setAttribute("src", user.avatar_url);
            uName.innerHTML = `Name: ${user.name}`;
            uLogin.innerHTML = `Username: ${user.login}`;
            uFollowers.innerHTML = `Followers: ${user.followers}`;
            uFollowing.innerHTML = `Following: ${user.following}`;
            uRepo.innerHTML = `Repositories: ${user.public_repos}`;
            }
        })
        .catch(err => console.log('something went wrong'));       

    e.preventDefault();
}

function removeAlert(){
    document.querySelector('.alert').remove();
}
