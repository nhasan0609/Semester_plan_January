const subjects = [
    "HS 4990-01 Research Seminar in Health Science 1",
    "CHEM 3212-01 Biochemistry",
    "MATH 1281-01 Statistical Inference",
    "BIOL 1301-01 Introduction to Biology"
];

const tasks = [
    "Written Assignment",
    "Self quiz",
    "Discussion forum",
    "Learning journal"
];

function selectSubject() {
    const weekNumber = document.getElementById('weekNumber').value;
    const subjectSelectionContainer = document.getElementById('subjectSelectionContainer');
    subjectSelectionContainer.innerHTML = '';

    if (weekNumber) {
        const subjectSelect = document.createElement('select');
        subjectSelect.id = 'subjectSelect';
        subjectSelect.onchange = () => createTaskTable(weekNumber, subjectSelect.value);
        subjects.forEach((subject, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = subject;
            subjectSelect.appendChild(option);
        });

        subjectSelectionContainer.appendChild(subjectSelect);
        createTaskTable(weekNumber, subjectSelect.value);
        displayReport(weekNumber);
    }
}

function createTaskTable(weekNumber, subjectIndex) {
    const tasksContainer = document.getElementById('tasksContainer');
    tasksContainer.innerHTML = '';

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `<th>Task</th><th>Done</th>`;
    table.appendChild(headerRow);

    tasks.forEach(task => {
        const key = `${subjects[subjectIndex]}_${task}_week${weekNumber}`;
        const isChecked = localStorage.getItem(key) === 'done' ? 'checked' : '';
        const taskRow = document.createElement('tr');
        taskRow.innerHTML = `
            <td>${task} (Week ${weekNumber})</td>
            <td><input type="radio" name="${key}" ${isChecked} onclick="storeTask('${key}')" ondblclick="undoTask('${key}', this)"></td>
        `;
        table.appendChild(taskRow);
    });

    // Check for extra tasks
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(`${subjects[subjectIndex]}_`) && key.endsWith(`_week${weekNumber}`) && !tasks.includes(key.split('_')[1])) {
            const isChecked = localStorage.getItem(key) === 'done' ? 'checked' : '';
            const taskRow = document.createElement('tr');
            taskRow.innerHTML = `
                <td>${key.split('_')[1]} (Week ${weekNumber})</td>
                <td><input type="radio" name="${key}" ${isChecked} onclick="storeTask('${key}')" ondblclick="undoTask('${key}', this)"></td>
            `;
            table.appendChild(taskRow);
        }
    }

    tasksContainer.appendChild(table);

    // Ask if any extra tasks need to be added
    const extraTaskContainer = document.getElementById('extraTaskContainer');
    extraTaskContainer.innerHTML = `
        <label for="extraTask">Add an extra task for Week ${weekNumber}? </label>
        <select id="extraTaskOption" onchange="toggleExtraTaskInput(${weekNumber}, ${subjectIndex})">
            <option value="no">No</option>
            <option value="yes">Yes</option>
        </select>
        <div id="extraTaskInputContainer"></div>
    `;
}

function toggleExtraTaskInput(weekNumber, subjectIndex) {
    const extraTaskOption = document.getElementById('extraTaskOption').value;
    const extraTaskInputContainer = document.getElementById('extraTaskInputContainer');

    if (extraTaskOption === 'yes') {
        extraTaskInputContainer.innerHTML = `
            <input type="text" id="extraTask" name="extraTask" placeholder="Enter extra task">
            <button type="button" onclick="addExtraTask(${weekNumber}, ${subjectIndex})">Add Task</button>
        `;
    } else {
        extraTaskInputContainer.innerHTML = '';
    }
}

function addExtraTask(weekNumber, subjectIndex) {
    const extraTask = document.getElementById('extraTask').value;
    if (extraTask) {
        const key = `${subjects[subjectIndex]}_${extraTask}_week${weekNumber}`;
        localStorage.setItem(key, 'not done');
        createTaskTable(weekNumber, subjectIndex);
        displayReport(weekNumber);
    }
}

function storeTask(key) {
    localStorage.setItem(key, 'done');
    const weekNumber = document.getElementById('weekNumber').value;
    displayReport(weekNumber);
}

function undoTask(key, element) {
    localStorage.removeItem(key);
    element.checked = false;
    const weekNumber = document.getElementById('weekNumber').value;
    displayReport(weekNumber);
}

function displayReport(weekNumber) {
    const reportContainer = document.getElementById('reportContainer');
    reportContainer.innerHTML = '<h2>Weekly Report</h2>';

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `<th>Subject</th><th>Task</th><th>Status</th>`;
    table.appendChild(headerRow);

    subjects.forEach(subject => {
        tasks.forEach(task => {
            const key = `${subject}_${task}_week${weekNumber}`;
            const isChecked = localStorage.getItem(key) === 'done';
            const status = isChecked ? '<span class="tick">&#10004;</span>' : '<span class="cross">&#10008;</span>';
            const taskRow = document.createElement('tr');
            taskRow.innerHTML = `
                <td>${subject}</td>
                <td>${task} (Week ${weekNumber})</td>
                <td>${status}</td>
            `;
            table.appendChild(taskRow);
        });

        // Check for extra tasks
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(`${subject}_`) && key.endsWith(`_week${weekNumber}`) && !tasks.includes(key.split('_')[1])) {
                const isChecked = localStorage.getItem(key) === 'done';
                const status = isChecked ? '<span class="tick">&#10004;</span>' : '<span class="cross">&#10008;</span>';
                const taskRow = document.createElement('tr');
                taskRow.innerHTML = `
                    <td>${subject}</td>
                    <td>${key.split('_')[1]} (Week ${weekNumber})</td>
                    <td>${status}</td>
                `;
                table.appendChild(taskRow);
            }
        }
    });

    reportContainer.appendChild(table);
}
