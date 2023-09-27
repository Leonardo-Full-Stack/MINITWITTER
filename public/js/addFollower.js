

const addFollower = async (follower, following) => {

    const body = {
        follower,
        following
    }
    try {
        const req = await fetch('http://localhost:3000/api/aut/follows/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
        const resp = await req.json()

        if (resp.ok) pintar(following)
    } catch (error) {
        console.log(error)
    }
}

const pintar = (name) => {
    const followingButtons = document.querySelectorAll(`.${name}`)
    
    followingButtons.forEach(item  => {
        item.classList.toggle('unFollowedButton');
        item.classList.add('followedButton');
        item.innerHTML = ''
        item.innerHTML = 'Siguiendo'
    })
}