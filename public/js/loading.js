
document.addEventListener('DOMContentLoaded',async function() {


    try {
        const request = await fetch('https://api-blog-ahz5.onrender.com/api/entries/')
        const response = await request.json();
        if (response.ok) drawAvailableData()
        
    } catch (error) {
        serverError();
    }

});

const drawAvailableData = () => {
    const loadingDiv = document.querySelector('.loadingDiv');
    const main = document.querySelector('.main')
    loadingDiv.classList.toggle('delete')
    main.classList.toggle('delete')
}

const serverError = () => {
    const loadingImg = document.querySelector('.loadingImg');
    const firstTitle = document.querySelector('.firstTitle');
    const secondTitle = document.querySelector('.secondTitle');
    loadingImg.classList.toggle('delete')
    firstTitle.innerHTML = 'Fallo del'
    secondTitle.innerHTML = 'Servidor'
}
