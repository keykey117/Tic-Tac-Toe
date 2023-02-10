//first step, attach event (submit) listener to the form to get user data

//attach event listeners to each "game box"

//next, initialise the game

//next, check which game mode we are playing

//set win conditions

//determine current player

//after each move, check win conditions and if not met, set other player as active

const form = document.querySelector("#myForm");

form.addEventListener("submit", (event) => {
    //prevent event refresh
    event.preventDefault();

    //initialise user form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    document.querySelector(".modal-wrapper").setAttribute("hidden", true);
    console.log(data);
});
