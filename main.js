let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuZnppemFlc2RmZGlqeWdya2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgzNDczNzIsImV4cCI6MjA0MzkyMzM3Mn0.llAqlwkL2QvoEaHCq9b9yf0Thp3F31xlA2f-QGx0lGk"
let baseURL = "https://qnfzizaesdfdijygrkkh.supabase.co/rest/v1/posts"


const showLikesModal = () => {

    let modalLikes = new bootstrap.Modal(document.getElementById("likesModal"))
    modalLikes.show()

}

const showCommentsModal = () => {

    let commentModal = new bootstrap.Modal(document.getElementById("commentModal"))
    commentModal.show()

}

const showTweetModal = () => {

    let createTweet = new bootstrap.Modal(document.getElementById("createTweet"))
    createTweet.show()


}


const logIn = () => {
    event.preventDefault()
    let username = inputUserName.value
    window.localStorage.setItem("username", username)
    window.location = "wall.html"
}


const loadWall = () => {

    userNameWall.innerHTML = window.localStorage.getItem("username")
    getAllPosts()

}

const creatPost = async () => {

    let description = inputTweet.value
    let name = window.localStorage.getItem("username")

    let jsonBody = {
        description,
        name
    }

    let response = await fetch(baseURL, {
        method: 'POST',
        headers: {
            'apikey': token,
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonBody)
    })

    if (response.ok) {
        console.log("Tweet Created")
    }else{
        let body  = await response.json()
        console.log(body)
    }

}


const getAllPosts = async ()=>{

    let response = await fetch(baseURL, {
        method: 'GET', 
        headers : {
            'apikey' : token, 
            'Authorization': token
        }
    })

    let data = await response.json()
    console.log(data)
    let layOut = ``

    data.forEach( (x)=>{

        let likeCounter = 0

        if (x.likes){
            likeCounter = x.likes.length
        }

        layOut += `<div class="card mb-3">

                <div class="card-body">
                    <h5 class="card-title">${x.name}</h5>
                    <p class="card-text">${x.description}</p>
                </div>

                <div class="card-fotter row">

                    <div class="col text-center">
                        <button class="btn btn-danger mb-2" onclick="showLikesModal()">${likeCounter} likes</button>
                    </div>

                    <div class="col">
                        <button onclick="showCommentsModal()" class="btn btn-success mb-2">Comments</button>
                    </div>

                </div>
            </div>
`
    } )

    wall.innerHTML = layOut

}