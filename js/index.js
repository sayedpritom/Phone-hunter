// Spinner in search button
const spinnerSearch = document.getElementById("spinnerSearch");

// grab search button html element node
document.getElementById("search-btn").addEventListener("click", () => {
    spinnerSearch.style.display = "inline-block";
    showAllResults()
})

// Show all search results in display function
const showAllResults = (isTwenty = true) => {

    // grab details Section html element node
    const detailsSection = document.getElementById("detailsSection");
    detailsSection.innerHTML = '';

    // convert input into lowercase for case insensitive search
    let input = document.getElementById("input").value.toLowerCase();

    // grab cards html element node
    const cards = document.getElementById("cards");
    cards.innerHTML = '';

    // grab show All Btn Holder element node
    const showAllBtnHolder = document.getElementById("showAllBtnHolder");


    // get each mobile data using fetch api
    fetch(`https://openapi.programming-hero.com/api/phones?search=${input}`)
        .then(response => response.json())
        .then(result => {
            if (result.status) {
                let products;

                // condition for showing 20 items by default
                isTwenty ? products = result.data.slice(0, 20) : products = result.data;

                // create each card item with mobile data & image
                products.forEach(item => {
                    const card = document.createElement('div');
                    card.classList.add("col-12", "col-md-6", "col-lg-4", "my-5", "p-5");
                    card.innerHTML = `
                <div class="card rounded-3 mx-auto border-0" style="width: 18rem;">
                    <div class="p-4">
                        <img src=${item.image} class="card-img-top img-fluid" alt="...">
                    </div>
                    <div class="card-body">
                      <h5 class="card-title">${item.phone_name}</h5>
                      <p class="card-text">${item.brand}</p>
                      <a onclick="showDetails('${item.slug}')" id="viewDetailsBtn">View Details</a>
                    </div>
                  </div>
                `;
                    cards.appendChild(card)
                })

                // create show all button
                const showAllBtn = document.createElement('button');
                showAllBtn.innerText = 'Show All Results';

                // set id & click handler 
                showAllBtn.setAttribute('onclick', "showAllResults(false)")
                showAllBtn.setAttribute('id', "showAllBtn")

                //append show all button
                showAllBtnHolder.innerHTML = '';
                showAllBtnHolder.appendChild(showAllBtn);

                // clean spinner after loading data
                spinnerSearch.style.display = "none";

            } else {
                // Show error message
                const card = document.createElement('div');
                card.innerHTML = `
                <h3 class="text-white">Result not found! Please search something else.</h3>
                `;
                cards.appendChild(card)

                // clean spinner after loading data
                spinnerSearch.style.display = "none";
            }
        })

}

// Show product details function
const showDetails = (slug) => {

    // get html node of detailsSection element
    const detailsSection = document.getElementById("detailsSection");
    detailsSection.innerHTML = '';

    // get mobile details data using fetch api
    fetch(`https://openapi.programming-hero.com/api/phone/${slug}`)
        .then((response) => response.json())
        .then(result => {
            // set data in variables
            const data = result.data;

            const image = data.image;
            const name = data.name;
            const releaseDate = data.releaseDate;
            const storage = data.mainFeatures.storage;
            const displaySize = data.mainFeatures.displaySize;
            const chipSet = data.mainFeatures.chipSet;
            const memory = data.mainFeatures.memory;
            const sensors = data.mainFeatures.sensors;
            const others = data.others;

            // Create details div & set details
            const details = document.createElement("div");
            details.classList.add("row");
            details.setAttribute("id", "details")

            // set data in template string
            details.innerHTML = `
        <div class="col-12 col-md-4 my-3"><img id="detailsSectionImage" src=${image} alt=""></div> 
        <div class="col-12 col-md-8 my-3">
            <h2>Model: ${name}</h2> <br/>
            <p><b>Release Date:</b> ${releaseDate ? releaseDate : "No release date found"}</p>
            <p><b>Storage:</b> ${storage}</p>
            <p><b>Display:</b> ${displaySize}</p>
            <p><b>Chipset:</b> ${chipSet}</p>
            <p><b>Memory:</b> ${memory}</p>
            <p id="sensors"><b>Sensors: </b></p>
            <p id="others"><b>Others: </b></p>
        </div>
        
        `;

            // append data
            detailsSection.appendChild(details)

            // get html nodes of sensors & others element
            const sensorsElement = document.getElementById('sensors');
            const othersElement = document.getElementById('others');

            // set others feature by for in loop
            for (const other in others) {
                const otherSpanTag = document.createElement('span');
                otherSpanTag.innerHTML = `${other} : ${others[other]} `;
                othersElement.appendChild(otherSpanTag)
            }

            // set sensors by for of loop
            for (const sensor of sensors) {
                const sensorSpanTag = document.createElement('span');
                sensorSpanTag.innerHTML = `${sensor}, `;
                sensorsElement.appendChild(sensorSpanTag)
            }

        })
}