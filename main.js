let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuZnppemFlc2RmZGlqeWdya2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgzNDczNzIsImV4cCI6MjA0MzkyMzM3Mn0.llAqlwkL2QvoEaHCq9b9yf0Thp3F31xlA2f-QGx0lGk"
let baseURL = "https://qnfzizaesdfdijygrkkh.supabase.co/rest/v1/posts"

let modalLikes
let commentModal
let createTweet

const showLikesModal = async (id) => {

    modalLikes = new bootstrap.Modal(document.getElementById("likesModal"))
    modalLikes.show()

    let url = `${baseURL}?id=eq.${id}`

    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'apikey': token,
            'Authorization': token
        }
    })

    if (response.ok) {

        let body = await response.json()



        let likesdata = body[0].likes
        let comments = body[0].comments

        // Rendering the likes
        let likeLayOut = ``

        for (let i = 0; i < likesdata.length; i++) {
            likeLayOut += `<li class="list-group-item">${likesdata[i]}</li> `
        }
        reportLikes.innerHTML = likeLayOut

        // Render the Comments

        let commentLayOut = ``

        for (let i = 0; i < comments.length; i++) {
            commentLayOut += `<li class="list-group-item">${comments[i].name}: ${comments[i].comment} </li> `
        }

        reportComments.innerHTML = commentLayOut

    } else {
        reportLikes.innerHTML = `Something went wrong!`
    }

}

const showCommentsModal = async (id) => {

    commentModal = new bootstrap.Modal(document.getElementById("commentModal"))
    commentModal.show()

    inputIdComment.value = id

    let url = `${baseURL}?id=eq.${id}`

    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'apikey': token,
            'Authorization': token
        }
    })

    if (response.ok) {

        let body = await response.json()

        let comments = body[0].comments


        // Render the Comments

        let commentLayOut = ``

        for (let i = 0; i < comments.length; i++) {
            commentLayOut += `<li class="list-group-item">${comments[i].name}: ${comments[i].comment} </li> `
        }

        reportComments.innerHTML = commentLayOut

    } else {
        reportComments.innerHTML = `Something went wrong!`
    }
}

const showTweetModal = () => {

    createTweet = new bootstrap.Modal(document.getElementById("createTweet"))
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
    let likes = []
    let comments = []

    let jsonBody = {
        description,
        name,
        likes,
        comments
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
        createTweet.hide()
        getAllPosts()
    } else {
        let body = await response.json()
        console.log(body)
    }

}


const getAllPosts = async () => {

    let url = `${baseURL}?order=id.desc`

    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'apikey': token,
            'Authorization': token
        }
    })

    let data = await response.json()
    let layOut = ``

    data.forEach((x) => {

        let likeCounter = 0
        let commentCounter = 0

        if (x.likes) {
            likeCounter = x.likes.length
        }

        if(x.comments){
            commentCounter = x.comments.length
        }


        layOut += `<div class="card mb-3 mx-auto" style="width: 300px">

                <div class="card-header">
                    <h5 class="card-title">${x.name}</h5>
                </div>
                <div class="card-body mx-auto">
                    <p class="card-text">${x.description}</p>
                </div>

                <div class="card-fotter row mx-2">

                    <div class="col">
                        <button class="btn btn-danger mb-2" onclick="showLikesModal(${x.id})">${likeCounter} 
                        <i class="fas fa-heart"></i>
                        </button>
                    </div>

                    <div class="col">
                        <button onclick="showCommentsModal(${x.id})" class="btn btn-success mb-2">${commentCounter} 
                        <i class="fas fa-comment"></i>
                        </button>
                    </div>

                     <div class="col">
                        <button onclick="createLike(${x.id})" class="btn btn-danger mb-2">
                        <i class="fas fa-heart"></i>
                        </button>
                    </div>

                </div>
            </div>
`
    })

    wall.innerHTML = layOut

}


const createLike = async (id) => {

    let username = window.localStorage.getItem("username")

    let url = `${baseURL}?id=eq.${id}`

    let responseLikes = await fetch(url, {
        method: 'GET',
        headers: {
            'apikey': token,
            'Authorization': token
        }
    })

    if (responseLikes.ok) {

        let bodyLikes = await responseLikes.json()
        let post = bodyLikes[0]

        if (!post.likes.includes(username)) {
            post.likes.push(username)

            let response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'apikey': token,
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(post)
            })

            if (response.ok) {
                getAllPosts()
                
            } else {
                console.log("Like wasn´t added")
            }


        }
    } else {
        console.log(`Post with id: ${id} is not getting returned from supabase`)
    }

}


const createComment2 = async () => {

  

    let id = inputIdComment.value
    let name = window.localStorage.getItem("username")
    let comment = inputComment.value
    let today = new Date()
    let date = `${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`
    
    let commentObject = {
        name, 
        comment, 
        date
    }


    let url = `${baseURL}?id=eq.${id}`

    let responseComments = await fetch(url, {
        method: 'GET',
        headers: {
            'apikey': token,
            'Authorization': token
        }
    })

    if (responseComments.ok) {

        let bodyComments = await responseComments.json()
        let post = bodyComments[0]


        post.comments.push(commentObject)

        let response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'apikey': token,
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        })

        if (response.ok) {
            getAllPosts() 
            commentModal.hide()
            showCommentsModal(id)
            inputComment.value = ""
        } else {
            console.log("Comment wasn´t added")
        }



    } else {
        console.log(`Post with id: ${id} is not getting returned from supabase`)
    }

}
