var API_BASE = 'http://localhost:3000';

// If user is not logged in, go back to login page
if (sessionStorage.getItem('sms_logged_in') !== 'true') {
  window.location.href = 'index.html';
}

// Buttons
var logoutBtn = document.getElementById('logoutBtn');
var viewTab = document.getElementById('viewTab');
var insertTab = document.getElementById('insertTab');
var updateTab = document.getElementById('updateTab');
var deleteTab = document.getElementById('deleteTab');

// Cancel buttons
var viewCancel = document.getElementById('viewCancel');
var insertCancel = document.getElementById('insertCancel');
var updateCancel1 = document.getElementById('updateCancel1');
var updateCancel2 = document.getElementById('updateCancel2');
var deleteCancel = document.getElementById('deleteCancel');

// Sections
var viewPanel = document.getElementById('viewPanel');
var insertPanel = document.getElementById('insertPanel');
var updatePanel = document.getElementById('updatePanel');
var deletePanel = document.getElementById('deletePanel');

// Forms
var viewForm = document.getElementById('viewForm');
var insertForm = document.getElementById('insertForm');
var updateSearchForm = document.getElementById('updateSearchForm');
var updateForm = document.getElementById('updateForm');
var deleteForm = document.getElementById('deleteForm');

// Result/Message areas
var viewResult = document.getElementById('viewResult');
var insertMsg = document.getElementById('insertMsg');
var updateMsg = document.getElementById('updateMsg');
var deleteMsg = document.getElementById('deleteMsg');

// This function shows messages in green or red
function showMessage(el, text, ok) {
  el.textContent = text;

  // For VIEW output, keep the bordered result box style
  if (el === viewResult) {
    el.className = 'result-box ' + (ok ? 'msg-success' : 'msg-error');
    return;
  }

  el.className = ok ? 'msg-success' : 'msg-error';
}

// This function hides all sections
function hideAllSections() {
  viewPanel.className = 'section hidden';
  insertPanel.className = 'section hidden';
  updatePanel.className = 'section hidden';
  deletePanel.className = 'section hidden';
}

// This function clears all output/messages
function clearAllMessages() {
  viewResult.textContent = '';
  viewResult.className = 'result-box';

  insertMsg.textContent = '';
  insertMsg.className = '';

  updateMsg.textContent = '';
  updateMsg.className = '';

  deleteMsg.textContent = '';
  deleteMsg.className = '';
}

// This function shows the VIEW section
function showView() {
  hideAllSections();
  clearAllMessages();
  viewForm.reset();
  viewPanel.className = 'section';
}

// This function shows the INSERT section
function showInsert() {
  hideAllSections();
  clearAllMessages();
  insertForm.reset();
  insertPanel.className = 'section';
}

// This function shows the UPDATE section
function showUpdate() {
  hideAllSections();
  clearAllMessages();
  updateSearchForm.reset();
  updateForm.reset();
  updateForm.className = 'hidden';
  updatePanel.className = 'section';
}

// This function shows the DELETE section
function showDelete() {
  hideAllSections();
  clearAllMessages();
  deleteForm.reset();
  deletePanel.className = 'section';
}

// This function cancels current operation and goes back to dashboard
function cancelOperation() {
  hideAllSections();
  clearAllMessages();
  viewForm.reset();
  insertForm.reset();
  updateSearchForm.reset();
  updateForm.reset();
  updateForm.className = 'hidden';
  deleteForm.reset();

  // Clear any shown student details
  viewResult.textContent = '';
  viewResult.className = 'result-box';
}

// Start state: only show buttons
hideAllSections();
clearAllMessages();

logoutBtn.addEventListener('click', function () {
  sessionStorage.removeItem('sms_logged_in');
  window.location.href = 'index.html';
});

viewTab.addEventListener('click', function () {
  showView();
});

insertTab.addEventListener('click', function () {
  showInsert();
});

updateTab.addEventListener('click', function () {
  showUpdate();
});

deleteTab.addEventListener('click', function () {
  showDelete();
});

viewCancel.addEventListener('click', function () {
  cancelOperation();
});

insertCancel.addEventListener('click', function () {
  cancelOperation();
});

updateCancel1.addEventListener('click', function () {
  cancelOperation();
});

updateCancel2.addEventListener('click', function () {
  cancelOperation();
});

deleteCancel.addEventListener('click', function () {
  cancelOperation();
});

// This function fetches and shows a student
function viewStudent() {
  viewResult.textContent = '';
  viewResult.className = 'result-box';

  var regno = document.getElementById('viewRegno').value;
  if (regno === '') {
    showMessage(viewResult, 'Enter Reg No', false);
    return;
  }

  fetch(API_BASE + '/student/' + regno)
    .then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok) {
          showMessage(viewResult, 'Student not found', false);
          return;
        }

        var s = data;
        var out = '';
        out += 'Student Details\n';
        out += '-------------------------\n';
        out += 'Name      : ' + s.name + '\n';
        out += 'Reg No    : ' + s.regno + '\n';
        out += 'Year      : ' + s.year + '\n';
        out += 'Section   : ' + s.section + '\n\n';
        out += 'Marks:\n';
        out += 'DBMS      : ' + s.dbms + '\n';
        out += 'CN        : ' + s.cn + '\n';
        out += 'TOC       : ' + s.toc + '\n';
        out += 'DAA       : ' + s.daa + '\n';
        out += 'EVS       : ' + s.evs + '\n';
        out += 'OS        : ' + s.os + '\n\n';
        out += '-------------------------\n';
        out += 'Total     : ' + s.total + '\n';
        out += 'Average   : ' + Number(s.average).toFixed(2) + '\n';
        out += 'Result    : ' + (s.result || '') + '\n';
        out += '-------------------------\n';

        viewResult.textContent = out;
        viewResult.className = 'result-box';
      });
    })
    .catch(function () {
      showMessage(viewResult, 'Server not reachable', false);
    });
}

viewForm.addEventListener('submit', function (e) {
  e.preventDefault();
  viewStudent();
});

// This function inserts a student
function insertStudent() {
  insertMsg.textContent = '';
  insertMsg.className = '';

  var body = {
    regno: document.getElementById('ins_regno').value,
    name: document.getElementById('ins_name').value,
    year: document.getElementById('ins_year').value,
    section: document.getElementById('ins_section').value,
    dbms: document.getElementById('ins_dbms').value,
    cn: document.getElementById('ins_cn').value,
    toc: document.getElementById('ins_toc').value,
    daa: document.getElementById('ins_daa').value,
    evs: document.getElementById('ins_evs').value,
    os: document.getElementById('ins_os').value
  };

  fetch(API_BASE + '/student', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
    .then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok) {
          showMessage(insertMsg, data.message || 'Insert failed', false);
          return;
        }

        var total =
          Number(body.dbms) +
          Number(body.cn) +
          Number(body.toc) +
          Number(body.daa) +
          Number(body.evs) +
          Number(body.os);

        var avg = Number((total / 6).toFixed(2));
        var resultText = '';

        if (avg > 85) {
          resultText = 'Distinction';
        } else if (avg >= 50 && avg <= 85) {
          resultText = 'Average';
        } else {
          resultText = 'Fail';
        }

        showMessage(
          insertMsg,
          'Student inserted successfully. Average: ' + avg.toFixed(2) + ' Result: ' + resultText,
          true
        );
        insertForm.reset();
      });
    })
    .catch(function () {
      showMessage(insertMsg, 'Server not reachable', false);
    });
}

insertForm.addEventListener('submit', function (e) {
  e.preventDefault();
  insertStudent();
});

// This function loads a student for update
function loadStudentForUpdate() {
  updateMsg.textContent = '';
  updateMsg.className = '';
  updateForm.reset();
  updateForm.className = 'hidden';

  var regno = document.getElementById('upd_regno').value;
  if (regno === '') {
    showMessage(updateMsg, 'Enter Reg No', false);
    return;
  }

  fetch(API_BASE + '/student/' + regno)
    .then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok) {
          showMessage(updateMsg, 'Student not found', false);
          return;
        }

        var s = data;
        document.getElementById('upd_name').value = s.name;
        document.getElementById('upd_year').value = s.year;
        document.getElementById('upd_section').value = s.section;
        document.getElementById('upd_dbms').value = s.dbms;
        document.getElementById('upd_cn').value = s.cn;
        document.getElementById('upd_toc').value = s.toc;
        document.getElementById('upd_daa').value = s.daa;
        document.getElementById('upd_evs').value = s.evs;
        document.getElementById('upd_os').value = s.os;

        updateForm.className = '';
        showMessage(updateMsg, 'Loaded. Edit and click Update', true);
      });
    })
    .catch(function () {
      showMessage(updateMsg, 'Server not reachable', false);
    });
}

updateSearchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  loadStudentForUpdate();
});

// This function updates a student
function updateStudent() {
  updateMsg.textContent = '';
  updateMsg.className = '';

  var regno = document.getElementById('upd_regno').value;

  var body = {
    name: document.getElementById('upd_name').value,
    year: document.getElementById('upd_year').value,
    section: document.getElementById('upd_section').value,
    dbms: document.getElementById('upd_dbms').value,
    cn: document.getElementById('upd_cn').value,
    toc: document.getElementById('upd_toc').value,
    daa: document.getElementById('upd_daa').value,
    evs: document.getElementById('upd_evs').value,
    os: document.getElementById('upd_os').value
  };

  fetch(API_BASE + '/student/' + regno, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
    .then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok) {
          if (data && data.message === 'Student not found') {
            showMessage(updateMsg, 'Student not found', false);
          } else {
            showMessage(updateMsg, 'Update failed', false);
          }
          return;
        }

        var total =
          Number(body.dbms) +
          Number(body.cn) +
          Number(body.toc) +
          Number(body.daa) +
          Number(body.evs) +
          Number(body.os);

        var avg = Number((total / 6).toFixed(2));
        var resultText = '';

        if (avg > 85) {
          resultText = 'Distinction';
        } else if (avg >= 50 && avg <= 85) {
          resultText = 'Average';
        } else {
          resultText = 'Fail';
        }

        showMessage(
          updateMsg,
          'Student updated successfully. Average: ' + avg.toFixed(2) + ' Result: ' + resultText,
          true
        );
        updateSearchForm.reset();
        updateForm.reset();
        updateForm.className = 'hidden';
      });
    })
    .catch(function () {
      showMessage(updateMsg, 'Server not reachable', false);
    });
}

updateForm.addEventListener('submit', function (e) {
  e.preventDefault();
  updateStudent();
});

// This function deletes a student
function deleteStudent() {
  deleteMsg.textContent = '';
  deleteMsg.className = '';

  var regno = document.getElementById('delRegno').value;
  if (regno === '') {
    showMessage(deleteMsg, 'Enter Reg No', false);
    return;
  }

  fetch(API_BASE + '/student/' + regno, {
    method: 'DELETE'
  })
    .then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok) {
          if (data && data.message === 'Student not found') {
            showMessage(deleteMsg, 'Student not found', false);
          } else {
            showMessage(deleteMsg, 'Delete failed', false);
          }
          return;
        }

        showMessage(deleteMsg, 'Student deleted successfully', true);
        deleteForm.reset();
      });
    })
    .catch(function () {
      showMessage(deleteMsg, 'Server not reachable', false);
    });
}

deleteForm.addEventListener('submit', function (e) {
  e.preventDefault();
  deleteStudent();
});
