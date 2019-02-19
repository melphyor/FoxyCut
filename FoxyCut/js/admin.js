// Modals
var modals = document.querySelectorAll('.modal');
console.log(modals)

modals.forEach(function (modal) {
	var closeButton = modal.getElementsByClassName('close');
	closeButton[0].onclick = function() {
		modal.style.display = "none"
	}
})

var viewReservationModal = document.getElementById('viewReservationModal')

viewReservationModal.getElementsByClassName('delete-date')[0].onclick = function() {
	var id = document.getElementById('view-reservation-id').value
	var date = document.getElementById('view-reservation-date').value
	var hour = document.getElementById('view-reservation-hour').value
	var minute = document.getElementById('view-reservation-minute').value

    onDeleteReservation(id, date, hour, minute)
}

var newReservationModal = document.getElementById('newReservationModal')

newReservationModal.getElementsByClassName('request-date')[0].onclick = function() {
	if (!formValidation()) {
		return
	}
 
    var id = document.getElementById('new-reservation-id').value
	var date = document.getElementById('new-reservation-date').value
	var hour = document.getElementById('new-reservation-hour').value
	var minute = document.getElementById('new-reservation-minute').value
	var name = document.getElementById('new-reservation-name').value
	var lastName = document.getElementById('new-reservation-lastname').value
	var phone = document.getElementById('new-reservation-phone').value
	if (!storage.addBooking(id, date, hour, minute, name, lastName, phone)) {
		alert("The client with this phone number already has the reservation!")
		return
	}
	newReservationModal.style.display = "none"
	schedule.init()
}

document.querySelector('.myBtn.login').onclick = function() {
    window.location.href = "index.html"
}

// UI events
document.getElementById("hairdresser-select").onchange = function(e) {
    schedule.initId(e.target.value);
}

onNewReservation = function(id, date, hour, minute) {
    console.log('add: ', id, ', ', date, ', ', hour, ', ', minute)
	document.getElementById('new-reservation-id').value = id
	document.getElementById('new-reservation-date').value = date
	document.getElementById('new-reservation-hour').value = hour
	document.getElementById('new-reservation-minute').value = minute
	newReservationModal.style.display = "block"
}

onViewReservation = function(id, date, hour, minute) {
    console.log('view: ', id, ', ', date, ', ', hour, ', ', minute)
    var booking = storage.getBooking(id, date, hour, minute)
	document.getElementById('view-reservation-id').value = id
	document.getElementById('view-reservation-date').value = date
	document.getElementById('view-reservation-hour').value = hour
	document.getElementById('view-reservation-minute').value = minute
	document.getElementById('view-reservation-name').value = booking.name
	document.getElementById('view-reservation-lastname').value = booking.lastName
	document.getElementById('view-reservation-phone').value = booking.phone
	viewReservationModal.style.display = "block"
}

onDeleteReservation = function(id, date, hour, minute) {
    console.log('delete: ', id, ', ', date, ', ', hour, ', ', minute)

    if (confirm('Do you want to delete this reservation?')) {
        storage.deleteBooking(id, date, hour, minute)
        viewReservationModal.style.display = "none"
        schedule.init()
    }
}

// Logic
var storage = Storage()
var schedule = Schedule(document.getElementById('schedule'), storage, onNewReservation, onViewReservation, onDeleteReservation)
var date = new Date()
schedule.initDate(new Date().yyyymmdd())
var calendar = VanillaCalendar(document.querySelector('.vcal-container'), schedule)
calendar.init({
	disablePastDays: true
})

schedule.initId(document.getElementById('hairdresser-select').value)
