function VanillaCalendar(element, scedule) {
    return {
        month: element.querySelectorAll('[data-calendar-area="month"]')[0],
        next: element.querySelectorAll('[data-calendar-toggle="next"]')[0],
        previous: element.querySelectorAll('[data-calendar-toggle="previous"]')[0],
        label: element.querySelectorAll('[data-calendar-label="month"]')[0],
        activeDates: null,
        date: new Date(),
        todaysDate: new Date(),
    
        init: function (options) {
            this.options = options
            this.date.setDate(1)
            this.createMonth()
            this.createListeners()
        },
    
        createListeners: function () {
            var _this = this
            this.next.addEventListener('click', function () {
                _this.clearCalendar()
                var nextMonth = _this.date.getMonth() + 1
                _this.date.setMonth(nextMonth)
                _this.createMonth()
            })
            // Clears the calendar and shows the previous month
            this.previous.addEventListener('click', function () {
                _this.clearCalendar()
                var prevMonth = _this.date.getMonth() - 1
                _this.date.setMonth(prevMonth)
                _this.createMonth()
            })
        },
    
        createDay: function (num, day, year) {
            var newDay = document.createElement('div')
            var dateEl = document.createElement('span')
            dateEl.innerHTML = num
            newDay.className = 'vcal-date'
            newDay.setAttribute('data-calendar-date', this.date.getFullYear() + '-' + this.date.getMonth() + '-' + this.date.getDate())
    
            // if it's the first day of the month
            if (num === 1) {
                if (day === 0) {
                    newDay.style.marginLeft = (6 * 14.28) + '%'
                } else {
                    newDay.style.marginLeft = ((day - 1) * 14.28) + '%'
                }
            }
    
            if (this.options.disablePastDays && this.date.getTime() <= this.todaysDate.getTime() - 1) {
                newDay.classList.add('vcal-date--disabled')
            } else {
                newDay.classList.add('vcal-date--active')
                newDay.setAttribute('data-calendar-status', 'active')
            }
    
            if (this.date.toString() === this.todaysDate.toString()) {
                newDay.classList.add('vcal-date--today')
            }
    
            newDay.appendChild(dateEl)
            this.month.appendChild(newDay)
        },
    
        dateClicked: function () {
            var _this = this
            this.activeDates = element.querySelectorAll(
                '[data-calendar-status="active"]'
            )
            for (var i = 0; i < this.activeDates.length; i++) {
                this.activeDates[i].addEventListener('click', function (event) {
                    _this.removeActiveClass()
                    this.classList.add('vcal-date--selected')
                    schedule.initDate(this.dataset.calendarDate)
                })
            }
        },
    
        createMonth: function () {
            var currentMonth = this.date.getMonth()
            while (this.date.getMonth() === currentMonth) {
                this.createDay(
                    this.date.getDate(),
                    this.date.getDay(),
                    this.date.getFullYear()
                )
                this.date.setDate(this.date.getDate() + 1)
            }  
            // while loop trips over and day is at 30/31, bring it back
            this.date.setDate(1)
            this.date.setMonth(this.date.getMonth() - 1)
        
            this.label.innerHTML =
                this.monthsAsString(this.date.getMonth()) + ' ' + this.date.getFullYear()
            this.dateClicked()
        },
    
        monthsAsString: function (monthIndex) {
            return [
                'January',
                'Febuary',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ][monthIndex]
        },
    
        clearCalendar: function () {
            this.month.innerHTML = ''
        },
    
        removeActiveClass: function () {
            for (var i = 0; i < this.activeDates.length; i++) {
                this.activeDates[i].classList.remove('vcal-date--selected')
            }
        }
    }
}

function Schedule(element, storage, onaddclick) {
    var _id = void 0;
    var _date = void 0;
    return {
        table: element.querySelectorAll('.schedule-table')[0],
        initId: function(id) {
            _id = id
            this.init()
        },
        initDate: function(date) {
            _date = date
            this.init()
        },
        init: function() {
            var bookings = storage.getBookings(_id, _date)
            this.generate(bookings)
        },
        generate: function(bookings) {
            console.log(bookings)
            var self = this
            this.table.innerHTML = ''

            var hours = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19']
            var minutes = ['00', '15', '30', '45']

            var row = document.createElement('tr')
            var col = document.createElement('td')
            row.appendChild(col)
            minutes.forEach(function(minute) {
                var col = document.createElement('td')
                col.classList.add('bookingTime')
                col.innerText = minute
                row.appendChild(col)
            })

            this.table.appendChild(row)

            hours.forEach(function(hour) {
                var row = document.createElement('tr')
                var col = document.createElement('td')
                col.classList.add('bookingTime')
                col.innerText = hour
                row.appendChild(col)

                minutes.forEach(function(minute) {
                    var col = document.createElement('td')
                    col.classList.add('info')

                    var booking = null
                    for (var i = 0; booking == null && i < bookings.length; i++) {
                        if (bookings[i].hour == hour && bookings[i].minute == minute) {
                            booking = bookings[i]
                        }
                    }

                    if (booking == null) {
                        var btn = document.createElement('a')
                        btn.href = '#'
                        btn.innerText = 'Free'
                        btn.onclick = function() {
                            onaddclick(_id, _date, hour, minute)
                            return false
                        }
                        col.appendChild(btn)
                    } else {
                        col.innerText = 'Busy'
                    }

                    row.appendChild(col)
                })

                self.table.appendChild(row)
            })
        }
    }
}

function Storage() {
    var loadItems = function() {
        return JSON.parse(localStorage.getItem('schedules'))
    }
    var saveItems = function(items) {
        localStorage.setItem('schedules', JSON.stringify(items))
    }
    var items = loadItems() || []
    return {
        getBookings: function(id, date) {
            console.log("getBookings(", id, ", ", date, ")")
            return items.filter(function(i) { return i.id == id && (!date || i.date == date) })
        },
        addBooking: function(id, date, hour, minute, phone, name, lastName) {
            console.log("addBooking(", id, ", ", date, ")")

            items.push({ id: id, date: date, hour: hour, minute: minute, phone: phone, name: name, lastName: lastName })
            saveItems(items)
        },
        deleteBooking: function(id, date, hour, minute) {
            items = items.filter(function(item) {
                return !(item.id == id && item.date == date && item.hour == hour && item.minute == minute)
            })
            saveItems(items)
        }
    }
}

// Form Validation
function formValidation() {
    let phone = document.getElementById('new-reservation-phone');
    let filterPhone = /^8\d{8}$/;
    let phoneErrorText = "Number should start from 8 and to have 9 digits"

    if (!filterPhone.test(phone.value)) {
        document.getElementById("errorMessage").innerHTML = phoneErrorText;
        phone.focus();
        return false;
    }
}