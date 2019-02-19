// Modals
var modals = document.querySelectorAll('.modal');
console.log(modals)

modals.forEach(function (modal) {
	var closeButton = modal.getElementsByClassName('close');
	closeButton[0].onclick = function() {
		modal.style.display = "none"
	}
})

var buttons = document.querySelectorAll('.bookingBtn')
buttons.forEach(function(button) {
	button.onclick = function() {
		var modal = document.getElementById('myModal2')
		modal.style.display = "block"
		schedule.initId(button.dataset.id)
	}
})

var newReservationModal = document.getElementById('myModal3')

newReservationModal.getElementsByClassName('request-date')[0].onclick = function() {
	var id = document.getElementById('new-reservation-id').value
	var date = document.getElementById('new-reservation-date').value
	var hour = document.getElementById('new-reservation-hour').value
	var minute = document.getElementById('new-reservation-minute').value
	var name = document.getElementById('new-reservation-name').value
	var lastName = document.getElementById('new-reservation-lastname').value
	var phone = document.getElementById('new-reservation-phone').value
	storage.addBooking(id, date, hour, minute, name, lastName, phone)
	newReservationModal.style.display = "none"
	schedule.init()
}

function onNewReservation(id, date, hour, minute) {
	document.getElementById('new-reservation-id').value = id
	document.getElementById('new-reservation-date').value = date
	document.getElementById('new-reservation-hour').value = hour
	document.getElementById('new-reservation-minute').value = minute
	newReservationModal.style.display = "block"
}

// Slides in Registration
var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
	showSlides(slideIndex += n);
}

function currentSlide(n) {
	showSlides(slideIndex = n);
}

function showSlides(n) {
	var i;
	var slides = document.getElementsByClassName("slider");
	if (n > slides.length) {slideIndex = 1}    
	if (n < 1) {slideIndex = slides.length}
	for (i = 0; i < slides.length; i++) {
			slides[i].style.display = "none";  
	}
	slides[slideIndex-1].style.display = "block";  
}

// Logic
var storage = new Storage()
var schedule = new Schedule(document.getElementById('schedule'), storage, onNewReservation)
var date = new Date()
schedule.initDate(date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate())
var calendar = VanillaCalendar(document.getElementById('myModal2'), schedule)
calendar.init({
	disablePastDays: true
})


