var app = function () {

  document.getElementById('calendar-form').addEventListener('submit', function (event) {
    event.preventDefault();
  }, false);

  var calendar;
  var weekday;
  var colors = ['rebeccapurple', 'limegreen', 'deeppink', 'cornflowerblue', 'gray', 'green',
    'blue', 'maroon', 'navy', 'olive', 'orange', 'purple', 'red',
    'silver', 'teal', 'yellowgreen'];
  var birthdayDataArr = [];
  var yearInput;

  initializeCalendarData();
  updateCalendars();

  function initializeCalendarData() {
    calendar = {
      mon: [],
      tue: [],
      wed: [],
      thurs: [],
      fri: [],
      sat: [],
      sun: []
    }

    weekday = new Array(7);
    weekday[0] = "sun";
    weekday[1] = "mon";
    weekday[2] = "tue";
    weekday[3] = "wed";
    weekday[4] = "thurs";
    weekday[5] = "fri";
    weekday[6] = "sat";
  }

  function onSubmitCalendarForm() {
    clearError();

    let form = document.getElementById('calendar-form');
    const birthData = form.birthInput.value;
    yearInput = form.year.value;

    if (!validateForm(birthData, yearInput)) {
      return;
    }

    try {
      birthdayDataArr = JSON.parse(birthData);
    } catch (error) {
      setError('JSON data invalid');
      return;
    }

    generateCalendarData();
    updateCalendars();
  }

  function generateCalendarData() {
    initializeCalendarData();
    birthdayDataArr.forEach(birthData => {
      const birthdate = new Date(birthData.birthday.split('/'));
      if (isNaN(birthdate)) {
        setError(`BirthDate for ${birthData.name} contains some invalid date, skipping that name`);
        return;
      }

      birthdate.setYear(yearInput);
      const day = weekday[birthdate.getDay()];
      const initials = getInitials(birthData.name);
      calendar[day].push(initials);
    });
  }

  function updateCalendars() {
    for (const day in calendar) {
      let calendarBox = document.getElementById(day);
      calendarBox.innerHTML = null;
      const dayArrLen = calendar[day].length;
      const sizeClass = getSizeCalss(dayArrLen);
      let currentColorIndex = 0;

      if (calendar[day].length === 0) {
        const toBeAppended = `<div class='card card-size-1' style="color: grey">No Birthdays</div>`;
        calendarBox.insertAdjacentHTML('beforeend', toBeAppended);
      }

      calendar[day].forEach((initials, index) => {
        let style = `background-color: ${colors[currentColorIndex]};`;
        style += (sizeClass === 'card-size-3' && (index + 1) % 3 === 0) ? ' flex: 1;' : '';
        const toBeAppended = `
          <div class="card ${sizeClass}" style="${style}">${initials}</div>        
        `;
        calendarBox.insertAdjacentHTML('beforeend', toBeAppended);
        currentColorIndex = currentColorIndex === colors.length - 1 ? 0 : ++currentColorIndex;
      });
    }
  }

  function validateForm(birthData, yearInput) {
    if (birthData === '' || yearInput === '') {
      setError('Please fill all the details');
      return false;
    }

    if (yearInput.length != 4) {
      setError('Please enter year in YYYY format');
      return false;
    }

    return true;
  }

  function clearError() {
    var errorBlock = document.getElementById('error');
    errorBlock.innerHTML = '';
  }

  function setError(error) {
    var errorBlock = document.getElementById('error');
    // errorBlock.innerHTML = error;
    const toBeAppended = `<div>${error}</div>`
    errorBlock.insertAdjacentHTML('beforeend', toBeAppended);
  }

  function getSizeCalss(len) {
    return len === 1 ? 'card-size-1' : (len < 5 ? 'card-size-2' : (len < 9 ? 'card-size-3' : 'card-size-4'));
  }

  function getInitials(name) {
    const fullNameArr = name.split(' ');
    const initials = fullNameArr[0].substring(0, 1) + fullNameArr[fullNameArr.length - 1].substring(0, 1);
    return initials;
  }

  return {
    onSubmitCalendarForm
  };
}();