const spinner = document.getElementById("spinner");

document.getElementById("search-btn").addEventListener("click", () => {
    spinner.style.display = "inline-block";
    showAllResults()
})

const showAllResults = (isTwenty = true) => {
    const detailsSection = document.getElementById("detailsSection");
    detailsSection.innerHTML = '';

    // Make input in small laterr
    let input = document.getElementById("input").value.toLowerCase();
    const cards = document.getElementById("cards");


    cards.innerHTML = '';
    fetch(`https://openapi.programming-hero.com/api/phones?search=${input}`)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            if (result.status) {
                let products;
                isTwenty ? products = result.data.slice(0, 20) : products = result.data;
                products.forEach(item => {
                    const card = document.createElement('div');
                    card.classList.add("col-12", "col-md-6", "col-lg-4", "my-5");
                    card.innerHTML = `
                <div class="card rounded mx-auto" style="width: 18rem;">
                    <div class="p-3">
                        <img src=${item.image} class="card-img-top img-fluid" alt="...">
                    </div>
                    <div class="card-body">
                      <h5 class="card-title">${item.phone_name}</h5>
                      <p class="card-text">${item.brand}</p>
                      <a onclick="showDetails('${item.slug}')" class="btn btn-primary">View Details</a>
                    </div>
                  </div>
                `;
                    cards.appendChild(card)
                })
                const showAllBtn = document.createElement('button');
                showAllBtn.innerText = 'Show All Results';
                showAllBtn.setAttribute('onclick', "showAllResults(false)")
                cards.appendChild(showAllBtn);
                // showAllBtn.addEventListener('click', () => showAllResults(false));
                spinner.style.display = "none";
            } else {
                const card = document.createElement('div');
                card.innerHTML = `
                <h3>Result not found! Please search something else.</h3>
                `;
                cards.appendChild(card)
                spinner.style.display = "none";
            }
        })

}


const showDetails = (slug) => {
    const detailsSection = document.getElementById("detailsSection");
    detailsSection.innerHTML = '';
    fetch(`https://openapi.programming-hero.com/api/phone/${slug}`)
        .then((response) => response.json())
        .then(result => {
            const sensors = [...result.data.mainFeatures.sensors];
            const others = result.data.others;
            // console.log(result.data.others);
            console.log(others);

            const details = document.createElement("div");
            details.classList.add("row");

            details.innerHTML = `
        <div class="col-12 col-md-6 my-2"><img id="detailsSectionImage" src=${result.data.image} alt=""></div> 
        <div class="col-12 col-md-6">
            <h3>Model: ${result.data.name}</h3> 
            <p>Release Date: ${result.data.releaseDate ? result.data.releaseDate : "No release date found"}</p>
            <p>Storage: ${result.data.mainFeatures.storage}</p>
            <p>Display: ${result.data.mainFeatures.displaySize}</p>
            <p>Chipset: ${result.data.mainFeatures.chipSet}</p>
            <p id="sensors"><b>Sensors: </b></p>
            <p id="others"><b>Others: </b></p>
        </div>
        
        `;
            detailsSection.appendChild(details)

            const sensorsElement = document.getElementById('sensors');
            const othersElement = document.getElementById('others');

            for(const other in others) {
                const otherSpanTag = document.createElement('span');
                otherSpanTag.innerHTML = `${other} : ${others[other]} `;
                othersElement.appendChild(otherSpanTag)
                // console.log()
                // console.log(othersElement)
            }

            for(const sensor of sensors) {
                const sensorSpanTag = document.createElement('span');
                sensorSpanTag.innerHTML = `${sensor}, `;
                sensorsElement.appendChild(sensorSpanTag)
                // console.log()
                // console.log(sensorsElement)
            }
            // console.log(sensorsP);
            // console.log(result.data.brand);
        })
}