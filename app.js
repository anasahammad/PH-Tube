const allBtn = document.getElementById('button-group');
const videoContainer = document.getElementById('video-container');
const errorElement = document.getElementById('error-element');
const sortBtn = document.getElementById('sort-btn');


let selectedCatagory = 1000;

let sortedByView = false;
sortBtn.addEventListener("click", ()=>{
    sortedByView = true;
    fetchByCatagory(selectedCatagory, sortedByView);
})

const loadCatagory = async () =>{
    const res = await fetch('https://openapi.programming-hero.com/api/videos/categories')
    const data = await res.json();
    const catagory = data.data;

    let currentlyActiveButton = null;
    catagory.forEach((item) =>{

        // console.log(item)
        const newBtn = document.createElement('button');
        newBtn.className = ' .buttons btn  bg-slate-700 btn-ghost text-white'
        newBtn.innerText = item.category;
        newBtn.addEventListener('click', ()=> {


            if (currentlyActiveButton) {
                currentlyActiveButton.classList.remove('bg-[#FF1F3D]');
            }
    
            currentlyActiveButton = newBtn;
    
            newBtn.classList.add('bg-[#FF1F3D]');
            fetchByCatagory(item.category_id)
           
           
          
        })
       
        allBtn.appendChild(newBtn);
    })
   

}


const fetchByCatagory = async (catagoryId, sortedByView)=>{
    videoContainer.innerHTML = '';

    selectedCatagory = catagoryId;
    const res = await fetch(`https://openapi.programming-hero.com/api/videos/category/${catagoryId}`)
    const data = await res.json();
    const allVideo = data.data;

    if(sortedByView){
        allVideo.sort((a,b) =>{
            const totalViewsStrFirst = a.others?.views;
            const totalViewsStrSecond = b.others?.views;
            const totalViewsFirstNumber = parseFloat(totalViewsStrFirst.replace("K", '')) || 0;
            const totalViewsSecondNumber = parseFloat(totalViewsStrSecond.replace("K", '')) || 0;

            return totalViewsSecondNumber - totalViewsFirstNumber;
        })
    }

    if(allVideo.length === 0){
        errorElement.classList.remove('hidden');
    } else{
        errorElement.classList.add("hidden");
    }
    allVideo.forEach((video)=>{
        const newCard = document.createElement('div');
        let verifiedBadge = '<img class="w-6 h-6" src="images/download.jpg" alt=""/>';
       if(video.authors[0].verified){
        verifiedBadge = ``;
       }
        newCard.innerHTML = `
       <div class="card w-full bg-base-100 shadow-xl">
       <figure class="overflow-hidden h-72">
        <img class="w-full" src="${video.thumbnail}" alt="shoes"/>
        
       </figure>

       <div class="card-body">
       <div class="flex space-x-4 justify-start items-start">
        <div>
        <img class="w-12 h-12 rounded-full" src="${video.authors[0].profile_picture}"/>
        </div>
        <div>
            <h2 class="card-title">${video.title}</h2>
            <div class="flex mt-3">
             <p class="">${video.authors[0].profile_name}</p>
                ${verifiedBadge}
            </div>
            <p class="mt-3">${video.others.views} views</p>
        </div>
       </div>
       </div>
       </div>
        `
        videoContainer.appendChild(newCard);

    })
    
}
loadCatagory();
fetchByCatagory(selectedCatagory, sortedByView)